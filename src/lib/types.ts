// Shared TypeScript types for VedaAI Grader

export interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Question {
  id: string;
  number: string;       // e.g. "11", "11(a)", "11(b)"
  text: string;
  page: number;         // 0-indexed page from question paper
  bbox: BBox;           // normalized 0–1 bounding box on that page
  maxScore?: number;    // parsed from question if available
}

export interface AnswerBlock {
  id: string;
  matched_question_number: string | null;
  text: string;
  pages: number[];      // 0-indexed pages from answer sheet
  bboxes: { page: number; bbox: BBox }[];
}

export type MatchConfidence = "confirmed" | "inferred" | "unanswered" | "orphan";

export type Verdict = "correct" | "partial" | "incorrect";

export interface GradingResult {
  score: number;
  maxScore: number;
  verdict: Verdict;
  feedback: string;
}

export interface MappedQuestion {
  question: Question;
  answer: AnswerBlock | null;
  confidence: MatchConfidence;
  grading: GradingResult | null;
}

export interface OrphanAnswer {
  answer: AnswerBlock;
  confidence: "orphan";
}

export interface ProcessingResult {
  sessionId: string;
  questions: Question[];
  mappedQuestions: MappedQuestion[];
  orphanAnswers: OrphanAnswer[];
  overallFeedback: string;
  totalScore: number;
  totalMaxScore: number;
  answeredCount: number;
  unansweredCount: number;
  orphanCount: number;
  // Page images as base64 data URLs
  questionPaperImages: string[];
  answerSheetImages: string[];
  // Low-quality warning
  qualityWarning?: string;
}

export type ProcessingStage =
  | "idle"
  | "uploading"
  | "extracting-questions"
  | "extracting-answers"
  | "mapping"
  | "grading"
  | "done"
  | "error";

export interface SessionState {
  stage: ProcessingStage;
  result?: ProcessingResult;
  error?: string;
  progress?: number; // 0-100
}
