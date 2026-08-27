import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { processUploadedFile } from "@/lib/pdf-utils";
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

    const qpBuffer = Buffer.from(await qpFile.arrayBuffer());
    const asBuffer = Buffer.from(await asFile.arrayBuffer());

    const warnings: string[] = [];

    // ── Stage 1: Extract questions ──
    const qpFileProcessed = await processUploadedFile(qpBuffer, qpFile.name);
    const { questions, qualityWarning: qw1 } = await extractQuestions(qpFileProcessed);
    if (qw1) warnings.push(qw1);

    // ── Stage 2: Extract answers ──
    const asFileProcessed = await processUploadedFile(asBuffer, asFile.name);
    const { answers, qualityWarning: qw2 } = await extractAnswers(asFileProcessed);
    if (qw2) warnings.push(qw2);

    // ── Stage 3: Map answers to questions ──
    const { mapped, orphans } = await mapAnswers(questions, answers);

    // ── Stage 4: Grade ──
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
      sessionId: uuidv4(),
      questions,
      mappedQuestions: mapped,
      orphanAnswers: orphans,
      overallFeedback,
      totalScore,
      totalMaxScore,
      answeredCount,
      unansweredCount,
      orphanCount: orphans.length,
      questionPaperImages: qpFileProcessed.displayImages,
      answerSheetImages:   asFileProcessed.displayImages,
      qualityWarning: warnings.length > 0 ? warnings.join(" ") : undefined,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error("[upload] POST error:", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Processing failed" }, { status: 500 });
  }
}
