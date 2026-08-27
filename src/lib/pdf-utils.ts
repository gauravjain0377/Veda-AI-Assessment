// File processing utilities
// Key insight: Gemini 2.0 Flash natively understands PDF files as inline data.
// We do NOT need to convert PDFs to images — we pass them directly with mime type application/pdf.
// This eliminates the pdfjs-dist / DOMMatrix issue entirely.

export interface ProcessedFile {
  /** Array of "pages" to send to Gemini. For images = 1 entry. For PDFs = 1 entry (Gemini handles pagination). */
  parts: { mimeType: string; data: string }[];
  /** Display images for the answer-sheet viewer (base64 data URLs). For PDFs we use the same data. */
  displayImages: string[];
  isPDF: boolean;
}

/**
 * Process an uploaded file buffer into Gemini-ready parts and display images.
 * - PDF: sent as application/pdf directly (Gemini handles multi-page natively)
 * - JPG/PNG: sent as image/* per page
 */
export async function processUploadedFile(
  buffer: Buffer,
  filename: string
): Promise<ProcessedFile> {
  const ext = filename.toLowerCase().split(".").pop() ?? "";
  const base64 = buffer.toString("base64");

  if (ext === "pdf" || isPDF(buffer)) {
    const dataURL = `data:application/pdf;base64,${base64}`;
    return {
      parts: [{ mimeType: "application/pdf", data: base64 }],
      displayImages: [dataURL],
      isPDF: true,
    };
  } else if (ext === "jpg" || ext === "jpeg") {
    const dataURL = `data:image/jpeg;base64,${base64}`;
    return {
      parts: [{ mimeType: "image/jpeg", data: base64 }],
      displayImages: [dataURL],
      isPDF: false,
    };
  } else if (ext === "png") {
    const dataURL = `data:image/png;base64,${base64}`;
    return {
      parts: [{ mimeType: "image/png", data: base64 }],
      displayImages: [dataURL],
      isPDF: false,
    };
  } else {
    // Fallback: try as PNG
    const dataURL = `data:image/png;base64,${base64}`;
    return {
      parts: [{ mimeType: "image/png", data: base64 }],
      displayImages: [dataURL],
      isPDF: false,
    };
  }
}

/** Check if buffer is a PDF by magic bytes */
export function isPDF(buffer: Buffer): boolean {
  return buffer.slice(0, 4).toString("ascii") === "%PDF";
}
