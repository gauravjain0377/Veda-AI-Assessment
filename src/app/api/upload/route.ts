import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createSession, updateSession } from "@/lib/session-store";
import { processUploadedFile, ProcessedFile } from "@/lib/pdf-utils";
import {
  extractQuestions,
  extractAnswers,
  gradeQuestion,
  generateOverallFeedback,
  semanticMatch,
} from "@/lib/gemini";
import {
  Question,
  AnswerBlock,
  MappedQuestion,
  OrphanAnswer,
  ProcessingResult,
} from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;

/** Normalize question number for matching: "Q 11 (a)" → "11a" */
function normalizeNum(num: string | null): string {
  if (!num) return "";
  return num
    .toLowerCase()
    .replace(/^q\.?\s*/i, "")        // strip leading Q / Q.
    .replace(/\s+/g, "")             // remove spaces
    .replace(/[^a-z0-9]/g, "");      // remove punctuation
}

/** Map extracted answers to questions */
async function mapAnswers(
  questions: Question[],
  answers: AnswerBlock[]
): Promise<{ mapped: MappedQuestion[]; orphans: OrphanAnswer[] }> {
  const usedIds = new Set<string>();
  const mapped: MappedQuestion[] = [];

  // Pass 1 — confirmed: exact question-number label match
  for (const question of questions) {
    const qn = normalizeNum(question.number);
    const match = answers.find(
      (a) => !usedIds.has(a.id) && a.matched_question_number !== null && normalizeNum(a.matched_question_number) === qn
    );
    if (match) {
      usedIds.add(match.id);
      mapped.push({ question, answer: match, confidence: "confirmed", grading: null });
    } else {
      mapped.push({ question, answer: null, confidence: "unanswered", grading: null });
    }
  }

  // Pass 2 — inferred: semantic similarity for remaining unmatched pairs
  const unmatchedAnswers = answers.filter((a) => !usedIds.has(a.id));
  const unansweredMapped = mapped.filter((m) => m.answer === null);

  for (const mappedQ of unansweredMapped) {
    const candidates = unmatchedAnswers
      .filter((a) => !usedIds.has(a.id))
      .map((a) => ({ id: a.id, text: a.text }));
    if (candidates.length === 0) break;

    try {
      const result = await semanticMatch(mappedQ.question.text, candidates);
      if (result) {
        const found = unmatchedAnswers.find((a) => a.id === result.answerId);
        if (found) {
          usedIds.add(found.id);
          mappedQ.answer = found;
          mappedQ.confidence = "inferred";
        }
      }
    } catch (e) {
      console.error("[mapping] semantic match error:", e);
    }
  }

  // Remaining answers = orphans
  const orphans: OrphanAnswer[] = answers
    .filter((a) => !usedIds.has(a.id))
    .map((a) => ({ answer: a, confidence: "orphan" as const }));

  return { mapped, orphans };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const qpFile = formData.get("questionPaper") as File | null;
    const asFile = formData.get("answerSheet") as File | null;

    if (!qpFile || !asFile) {
      return NextResponse.json({ error: "Both files required" }, { status: 400 });
    }

    const sessionId = uuidv4();
    createSession(sessionId);

    // Kick off processing in the background
    processInBackground(
      sessionId,
      Buffer.from(await qpFile.arrayBuffer()),
      Buffer.from(await asFile.arrayBuffer()),
      qpFile.name,
      asFile.name
    ).catch((e) => {
      console.error("[upload] background processing crashed:", e);
      updateSession(sessionId, { stage: "error", error: String(e) });
    });

    return NextResponse.json({ sessionId });
  } catch (e) {
    console.error("[upload] POST error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

async function processInBackground(
  sessionId: string,
  qpBuffer: Buffer,
  asBuffer: Buffer,
  qpName: string,
  asName: string
) {
  const warnings: string[] = [];

  try {
    // ── Stage 1: Extract questions ─────────────────────────────────────────
    updateSession(sessionId, { stage: "extracting-questions", progress: 20 });
    console.log(`[${sessionId}] processing question paper: ${qpName}`);

    const qpFile: ProcessedFile = await processUploadedFile(qpBuffer, qpName);
    const { questions, qualityWarning: qw1 } = await extractQuestions(qpFile);
    if (qw1) warnings.push(qw1);
    console.log(`[${sessionId}] extracted ${questions.length} questions`);

    // ── Stage 2: Extract answers ───────────────────────────────────────────
    updateSession(sessionId, { stage: "extracting-answers", progress: 45 });
    console.log(`[${sessionId}] processing answer sheet: ${asName}`);

    const asFile: ProcessedFile = await processUploadedFile(asBuffer, asName);
    const { answers, qualityWarning: qw2 } = await extractAnswers(asFile);
    if (qw2) warnings.push(qw2);
    console.log(`[${sessionId}] extracted ${answers.length} answer blocks`);

    // ── Stage 3: Map answers to questions ──────────────────────────────────
    updateSession(sessionId, { stage: "mapping", progress: 65 });
    const { mapped, orphans } = await mapAnswers(questions, answers);
    console.log(`[${sessionId}] mapped: ${mapped.filter(m=>m.answer).length} confirmed/inferred, ${orphans.length} orphans`);

    // ── Stage 4: Grade ─────────────────────────────────────────────────────
    updateSession(sessionId, { stage: "grading", progress: 80 });
    for (const m of mapped) {
      if (m.answer) {
        try {
          m.grading = await gradeQuestion(m.question.text, m.answer.text, m.question.maxScore ?? 2);
        } catch (e) {
          console.error(`[grading] Q${m.question.number} failed:`, e);
          m.grading = { score: 0, maxScore: m.question.maxScore ?? 2, verdict: "incorrect", feedback: "Grading failed." };
        }
      } else {
        m.grading = { score: 0, maxScore: m.question.maxScore ?? 2, verdict: "incorrect", feedback: "This question was not answered." };
      }
    }

    const totalScore    = mapped.reduce((s, m) => s + (m.grading?.score ?? 0), 0);
    const totalMaxScore = mapped.reduce((s, m) => s + (m.grading?.maxScore ?? 2), 0);
    const answeredCount  = mapped.filter((m) => m.answer !== null).length;
    const unansweredCount = mapped.filter((m) => m.answer === null).length;

    const overallFeedback = await generateOverallFeedback(mapped, totalScore, totalMaxScore);

    const result: ProcessingResult = {
      sessionId,
      questions,
      mappedQuestions: mapped,
      orphanAnswers: orphans,
      overallFeedback,
      totalScore,
      totalMaxScore,
      answeredCount,
      unansweredCount,
      orphanCount: orphans.length,
      // Display: pass raw data URLs for answer sheet pages
      questionPaperImages: qpFile.displayImages,
      answerSheetImages:   asFile.displayImages,
      qualityWarning: warnings.length > 0 ? warnings.join(" ") : undefined,
    };

    updateSession(sessionId, { stage: "done", progress: 100, result });
    console.log(`[${sessionId}] done! score=${totalScore}/${totalMaxScore}`);
  } catch (e) {
    console.error(`[${sessionId}] processing error:`, e);
    updateSession(sessionId, {
      stage: "error",
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
