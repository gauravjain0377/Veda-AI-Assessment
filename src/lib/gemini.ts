// ─── API Key Rotation Manager ─────────────────────────────────────────────────
// Supports multiple keys: GEMINI_API_KEY, GEMINI_API_KEY_2, GEMINI_API_KEY_3, etc.
// When a key hits its quota (429), it's marked exhausted and the next key is used.

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from "@google/generative-ai";
import { Question, AnswerBlock, GradingResult, MappedQuestion } from "./types";
import { ProcessedFile } from "./pdf-utils";

const ALL_KEYS: string[] = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
].filter(Boolean) as string[];

if (ALL_KEYS.length === 0) {
  console.warn("[Gemini] No API keys set — all calls will fail with 403");
} else {
  console.log(`[Gemini] Loaded ${ALL_KEYS.length} API key(s) for rotation`);
}

// Track exhausted keys and when their quota resets (timestamp in ms)
const exhaustedKeys = new Map<string, number>();

function getAvailableKey(): string | null {
  const now = Date.now();
  // Clear expired exhausted marks (reset after 1 hour to be safe)
  for (const [key, expiresAt] of exhaustedKeys.entries()) {
    if (now > expiresAt) exhaustedKeys.delete(key);
  }
  // Return first non-exhausted key
  return ALL_KEYS.find((k) => !exhaustedKeys.has(k)) ?? null;
}

function markKeyExhausted(key: string, retryAfterSeconds = 3600) {
  exhaustedKeys.set(key, Date.now() + retryAfterSeconds * 1000);
  const remaining = ALL_KEYS.filter((k) => !exhaustedKeys.has(k)).length;
  console.warn(`[Gemini] Key ...${key.slice(-6)} marked exhausted for ${retryAfterSeconds}s. ${remaining}/${ALL_KEYS.length} keys still available.`);
}

// Safety settings — allow educational content
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

// FREE TIER MODEL — gemini-3.6-flash
const FREE_MODEL = "gemini-3.6-flash";

function getModel(jsonMode = true, key?: string) {
  const activeKey = key ?? getAvailableKey();
  if (!activeKey) throw new Error("All Gemini API keys have exceeded their quota. Please add more keys or wait for the quota to reset (usually resets at midnight Pacific Time).");
  return new GoogleGenerativeAI(activeKey).getGenerativeModel({
    model: FREE_MODEL,
    safetySettings,
    generationConfig: {
      temperature: 0.1,
      ...(jsonMode ? { responseMimeType: "application/json" } : {}),
    },
  });
}

/** Build a Gemini Part from processed file data */
function fileToPart(mimeType: string, base64Data: string): Part {
  return { inlineData: { mimeType, data: base64Data } };
}

/** Helper to retry Gemini operations on failure (rate-limiting or overloaded server).
 *  On 429: marks the current key exhausted and immediately retries with the next key.
 *  On other errors: uses exponential backoff.
 */
async function withRetry<T>(
  fn: (key: string) => Promise<T>,
  retries = ALL_KEYS.length * 2,
  delay = 2000
): Promise<T> {
  const key = getAvailableKey();
  if (!key) {
    throw new Error("All Gemini API keys have exceeded their quota. Please add more keys or wait for the quota to reset (usually resets at midnight Pacific Time).");
  }
  try {
    return await fn(key);
  } catch (error: any) {
    const is429 = error?.status === 429 ||
      (error?.message && error.message.includes("429")) ||
      (error?.message && error.message.includes("Too Many Requests")) ||
      (error?.message && error.message.includes("RESOURCE_EXHAUSTED"));

    if (is429) {
      // Extract retryDelay from errorDetails (e.g., "53s")
      let exhaustSeconds = 3600; // mark exhausted for 1 hour by default
      try {
        const retryInfo = error?.errorDetails?.find(
          (d: any) => d["@type"]?.includes("RetryInfo")
        );
        if (retryInfo?.retryDelay) {
          const s = parseInt(retryInfo.retryDelay.replace("s", ""), 10);
          if (!isNaN(s)) exhaustSeconds = s + 60; // expire 60s after suggested retry
        }
      } catch {}

      // Mark this key exhausted so next call uses a different key
      markKeyExhausted(key, exhaustSeconds);

      if (retries <= 0) {
        console.error(`[Gemini] All retries exhausted.`);
        throw error;
      }

      // Check if another key is available immediately
      const nextKey = getAvailableKey();
      if (nextKey) {
        console.log(`[Gemini] Switching to next API key ...${nextKey.slice(-6)}`);
        return withRetry(fn, retries - 1, delay); // immediate retry with new key
      }

      // All keys exhausted — wait for the shortest cooldown
      const shortestWaitMs = Math.min(...[...exhaustedKeys.values()].map(t => t - Date.now()));
      const waitSec = Math.max(Math.ceil(shortestWaitMs / 1000), 5);
      console.warn(`[Gemini] All keys exhausted. Waiting ${waitSec}s for next available key...`);
      await new Promise((resolve) => setTimeout(resolve, waitSec * 1000));
      return withRetry(fn, retries - 1, delay);
    }

    // For non-quota errors (network, 500, etc.), use exponential backoff
    if (retries <= 0) throw error;
    console.warn(`[Gemini] Request failed. Retrying in ${delay}ms... (${retries} left). Error:`, error);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

/** Strip markdown code fences from Gemini JSON response */
function parseJSON<T>(text: string): T {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned) as T;
}

// ─── Question Extraction ────────────────────────────────────────────────────

/**
 * Extract every question from the question paper.
 * Supports both PDF (sent as application/pdf) and images.
 */
export async function extractQuestions(file: ProcessedFile): Promise<{
  questions: Question[];
  qualityWarning?: string;
}> {
  // Build parts array: each part is a page/file
  const fileParts: Part[] = file.parts.map((p) => fileToPart(p.mimeType, p.data));

  const prompt = `You are an expert at reading question papers. Analyze this ${file.isPDF ? "PDF" : "image"} of a question paper.

Extract EVERY question and return strict JSON.

CRITICAL RULES:
1. Preserve the EXACT printed question numbers (e.g., "1", "2", "11(a)", "11(b)", "Q3")
2. Treat labeled sub-parts as SEPARATE entries — 11(a) and 11(b) = TWO questions
3. Keep questions in EXACT printed order
4. Do NOT renumber or reformat
5. Return bounding boxes normalized 0–1 scale (x, y, width, height relative to page)
6. If multi-page PDF: page is 0-indexed page number where question appears

Return ONLY this JSON (no extra text):
{
  "questions": [
    {
      "id": "q1",
      "number": "1",
      "text": "full question text here",
      "page": 0,
      "bbox": {"x": 0.05, "y": 0.1, "width": 0.9, "height": 0.08},
      "maxScore": 2
    }
  ],
  "qualityWarning": null
}`;

  try {
    const response = await withRetry((key) => getModel(true, key).generateContent([prompt, ...fileParts]));
    const text = response.response.text();
    const parsed = parseJSON<{ questions: Question[]; qualityWarning?: string }>(text);
    return {
      questions: parsed.questions ?? [],
      qualityWarning: parsed.qualityWarning ?? undefined,
    };
  } catch (e: any) {
    console.error("[Gemini] extractQuestions error:", e);
    const isQuota = e?.status === 429 || (e?.message && e.message.includes("429"));
    const msg = isQuota
      ? "⚠️ Gemini API quota exceeded (free tier limit reached). Please wait a few minutes and try again."
      : "Could not extract questions — check image quality.";
    return { questions: [], qualityWarning: msg };
  }
}

// ─── Answer Extraction ──────────────────────────────────────────────────────

/**
 * Extract all answer blocks from the student's answer sheet.
 */
export async function extractAnswers(file: ProcessedFile): Promise<{
  answers: AnswerBlock[];
  qualityWarning?: string;
}> {
  const fileParts: Part[] = file.parts.map((p) => fileToPart(p.mimeType, p.data));

  const prompt = `You are an expert at reading handwritten student answer sheets. Analyze this ${file.isPDF ? "PDF" : "image"}.

Extract EVERY answer block and return strict JSON.

CRITICAL RULES:
1. Look for student-written question labels like "Q1", "Q.1", "1.", "Ans 3", "11 a", etc.
2. matched_question_number: the label the student wrote (normalized, e.g. "1", "11(a)"), or null if no label
3. Transcribe handwritten text as accurately as possible
4. An answer may span multiple pages — include all pages and bboxes
5. Bboxes normalized 0–1 scale per page (page is 0-indexed)

Return ONLY this JSON (no extra text):
{
  "answers": [
    {
      "id": "a1",
      "matched_question_number": "1",
      "text": "transcribed handwritten text here",
      "pages": [0],
      "bboxes": [
        {"page": 0, "bbox": {"x": 0.05, "y": 0.15, "width": 0.9, "height": 0.25}}
      ]
    }
  ],
  "qualityWarning": null
}`;

  try {
    const response = await withRetry((key) => getModel(true, key).generateContent([prompt, ...fileParts]));
    const text = response.response.text();
    const parsed = parseJSON<{ answers: AnswerBlock[]; qualityWarning?: string }>(text);
    return {
      answers: parsed.answers ?? [],
      qualityWarning: parsed.qualityWarning ?? undefined,
    };
  } catch (e: any) {
    console.error("[Gemini] extractAnswers error:", e);
    const isQuota = e?.status === 429 || (e?.message && e.message.includes("429"));
    const msg = isQuota
      ? "⚠️ Gemini API quota exceeded (free tier limit reached). Please wait a few minutes and try again."
      : "Could not extract answers — check image quality.";
    return { answers: [], qualityWarning: msg };
  }
}

// ─── Semantic Matching ──────────────────────────────────────────────────────

/**
 * Use Gemini to find which unmatched answer best fits an unmatched question.
 */
export async function semanticMatch(
  questionText: string,
  answerCandidates: { id: string; text: string }[]
): Promise<{ answerId: string; confidence: number } | null> {
  if (answerCandidates.length === 0) return null;

  const prompt = `Given this question and candidate student answers, find the best semantic match.

QUESTION: "${questionText}"

CANDIDATES:
${answerCandidates.map((a, i) => `[${i}] id="${a.id}" text="${a.text.slice(0, 400)}"`).join("\n")}

Return ONLY JSON:
{
  "bestIndex": -1,
  "answerId": null,
  "confidence": 0.0
}

Set bestIndex to -1 and answerId to null if no good match (confidence < 0.6).`;

  try {
    const response = await withRetry((key) => getModel(true, key).generateContent(prompt));
    const parsed = parseJSON<{ bestIndex: number; answerId: string | null; confidence: number }>(
      response.response.text()
    );
    if (parsed.bestIndex === -1 || !parsed.answerId || parsed.confidence < 0.6) return null;
    return { answerId: parsed.answerId, confidence: parsed.confidence };
  } catch {
    return null;
  }
}

// ─── Grading ────────────────────────────────────────────────────────────────

/**
 * Grade a single matched question. Uses free-tier gemini-3.6-flash.
 */
export async function gradeQuestion(
  questionText: string,
  answerText: string,
  maxScore: number = 2
): Promise<GradingResult> {
  const prompt = `You are a teacher grading a student exam answer. Be fair and specific.

QUESTION (${maxScore} marks): "${questionText}"

STUDENT'S ANSWER: "${answerText}"

Return ONLY JSON:
{
  "score": 0,
  "maxScore": ${maxScore},
  "verdict": "incorrect",
  "feedback": "1-3 specific sentences about this answer."
}

Rules:
- verdict = "correct" if score = ${maxScore}
- verdict = "partial" if 0 < score < ${maxScore}
- verdict = "incorrect" if score = 0`;

  try {
    const response = await withRetry((key) => getModel(true, key).generateContent(prompt));
    const parsed = parseJSON<GradingResult>(response.response.text());
    return {
      score: Math.max(0, Math.min(parsed.score, maxScore)),
      maxScore,
      verdict: parsed.verdict,
      feedback: parsed.feedback,
    };
  } catch {
    return { score: 0, maxScore, verdict: "incorrect", feedback: "Could not grade this answer." };
  }
}

// ─── Overall Feedback ───────────────────────────────────────────────────────

export async function generateOverallFeedback(
  mapped: MappedQuestion[],
  totalScore: number,
  totalMax: number
): Promise<string> {
  const pct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
  const answered = mapped.filter((m) => m.answer !== null).length;
  const unanswered = mapped.filter((m) => m.answer === null).length;

  const prompt = `A student scored ${totalScore}/${totalMax} (${pct}%) on an exam.
Answered: ${answered} questions. Left unanswered: ${unanswered} questions.

Write 2-3 sentences of overall feedback for the teacher to share with the student.
Be encouraging but honest. Return ONLY the plain text feedback, no JSON, no quotes.`;

  try {
    const response = await withRetry((key) =>
      new GoogleGenerativeAI(key).getGenerativeModel({
        model: FREE_MODEL,
        safetySettings,
        generationConfig: { temperature: 0.7 },
      }).generateContent(prompt)
    );
    return response.response.text().trim();
  } catch {
    return `The student scored ${totalScore}/${totalMax} (${pct}%). ${answered} questions answered, ${unanswered} left unanswered.`;
  }
}
