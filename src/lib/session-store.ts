// In-memory session store (no database needed)
import { SessionState } from "./types";

const sessions = new Map<string, SessionState>();

export function createSession(id: string): void {
  sessions.set(id, { stage: "uploading", progress: 0 });
}

export function getSession(id: string): SessionState | undefined {
  return sessions.get(id);
}

export function updateSession(id: string, update: Partial<SessionState>): void {
  const existing = sessions.get(id);
  if (existing) {
    sessions.set(id, { ...existing, ...update });
  }
}

export function deleteSession(id: string): void {
  sessions.delete(id);
}

// Store uploaded file buffers keyed by sessionId
const fileBuffers = new Map<string, { questionPaper: Buffer; answerSheet: Buffer; questionPaperName: string; answerSheetName: string }>();

export function storeFiles(
  sessionId: string,
  questionPaper: Buffer,
  answerSheet: Buffer,
  questionPaperName: string,
  answerSheetName: string
): void {
  fileBuffers.set(sessionId, { questionPaper, answerSheet, questionPaperName, answerSheetName });
}

export function getFiles(sessionId: string) {
  return fileBuffers.get(sessionId);
}

export function clearFiles(sessionId: string): void {
  fileBuffers.delete(sessionId);
}
