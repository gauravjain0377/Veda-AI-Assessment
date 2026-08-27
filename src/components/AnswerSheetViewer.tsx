"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { MappedQuestion, OrphanAnswer, BBox, MatchConfidence } from "@/lib/types";

interface HighlightInfo {
  bbox: BBox;
  page: number;
  confidence: MatchConfidence;
  label: string;
}

interface AnswerSheetViewerProps {
  images: string[];           // data URLs — may be image/* or application/pdf
  selectedQuestion: MappedQuestion | null;
  selectedOrphan: OrphanAnswer | null;
  allMappedQuestions: MappedQuestion[];
}

const HIGHLIGHT_COLORS: Record<MatchConfidence, { fill: string; border: string }> = {
  confirmed:  { fill: "rgba(16, 185, 129, 0.18)", border: "#10B981" },
  inferred:   { fill: "rgba(245, 158, 11, 0.18)",  border: "#F59E0B" },
  unanswered: { fill: "rgba(239, 68, 68, 0.1)",   border: "#EF4444" },
  orphan:     { fill: "rgba(156, 163, 175, 0.18)", border: "#9CA3AF" },
};

// ─── Icons ─────────────────────────────────────────────────────────────────

function ZoomInIcon()  { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/><path d="M12 12l2.5 2.5M5 7h4M7 5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function ZoomOutIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/><path d="M12 12l2.5 2.5M5 7h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function ChevLeft()    { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function ChevRight()   { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }

// ─── Page Viewer (image with canvas highlight overlay) ─────────────────────

interface PageViewerProps {
  dataUrl: string;
  pageIndex: number;
  highlights: HighlightInfo[];
  zoom: number;
  isPDF: boolean;
}

function PageViewer({ dataUrl, pageIndex, highlights, zoom, isPDF }: PageViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef    = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Highlights for this specific page
  const pageHighlights = highlights.filter((h) => h.page === pageIndex);

  const drawHighlights = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current || !loaded) return;
    const img = imgRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const h of pageHighlights) {
      const colors = HIGHLIGHT_COLORS[h.confidence];
      const x = h.bbox.x * canvas.width;
      const y = h.bbox.y * canvas.height;
      const w = h.bbox.width  * canvas.width;
      const ht = h.bbox.height * canvas.height;

      ctx.fillStyle = colors.fill;
      ctx.fillRect(x, y, w, ht);

      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, ht);

      // Label badge
      ctx.font = "bold 14px Inter, sans-serif";
      const bw = ctx.measureText(h.label).width + 14;
      const bh = 22;
      const bx = x;
      const by = y - bh - 4;
      if (by > 0) {
        ctx.fillStyle = colors.border;
        ctx.beginPath();
        (ctx as CanvasRenderingContext2D & { roundRect?: (...args: unknown[]) => void }).roundRect?.(bx, by, bw, bh, 4) ?? ctx.rect(bx, by, bw, bh);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText(h.label, bx + 7, by + 15);
      }
    }
  }, [pageHighlights, loaded]);

  useEffect(() => {
    if (isPDF) return; // PDF uses iframe, no canvas overlay
    const img = new Image();
    img.onload = () => { imgRef.current = img; setLoaded(true); };
    img.src = dataUrl;
    setLoaded(false);
  }, [dataUrl, isPDF]);

  useEffect(() => { drawHighlights(); }, [drawHighlights]);

  if (isPDF) {
    // PDFs: render in iframe — highlights not supported but content visible
    return (
      <div
        style={{
          position: "relative",
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          transition: "transform 0.2s",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          borderRadius: "4px",
          overflow: "hidden",
          width: "800px",
          height: "1130px",
          border: pageHighlights.length > 0 ? "3px solid #10B981" : "2px solid transparent",
        }}
      >
        <iframe
          src={dataUrl}
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Answer sheet PDF"
        />
        {pageHighlights.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              backgroundColor: "#10B981",
              color: "white",
              borderRadius: "8px",
              padding: "4px 10px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            Answer highlighted on page {pageIndex + 1}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        transform: `scale(${zoom})`,
        transformOrigin: "top center",
        transition: "transform 0.2s",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        borderRadius: "4px",
        overflow: "hidden",
        border: pageHighlights.length > 0 ? "3px solid #10B981" : "2px solid transparent",
      }}
    >
      <img
        src={dataUrl}
        alt={`Answer sheet page ${pageIndex + 1}`}
        style={{ display: "block", maxWidth: "760px", userSelect: "none" }}
        onLoad={() => {
          const img = new Image();
          img.onload = () => { imgRef.current = img; setLoaded(true); };
          img.src = dataUrl;
        }}
        draggable={false}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ─── Main AnswerSheetViewer ─────────────────────────────────────────────────

export default function AnswerSheetViewer({
  images,
  selectedQuestion,
  selectedOrphan,
  allMappedQuestions,
}: AnswerSheetViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);

  const isPDF = images[0]?.startsWith("data:application/pdf");

  // Compute highlights
  const highlights: HighlightInfo[] = [];
  if (selectedQuestion?.answer) {
    for (const b of selectedQuestion.answer.bboxes) {
      highlights.push({
        bbox: b.bbox, page: b.page,
        confidence: selectedQuestion.confidence,
        label: `Q${selectedQuestion.question.number}`,
      });
    }
  } else if (selectedOrphan) {
    for (const b of selectedOrphan.answer.bboxes) {
      highlights.push({ bbox: b.bbox, page: b.page, confidence: "orphan", label: "?" });
    }
  }

  // Auto-navigate to page containing the first highlight
  useEffect(() => {
    if (highlights.length > 0) {
      const firstPage = highlights[0].page;
      if (firstPage < images.length) setCurrentPage(firstPage);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuestion?.question.id, selectedOrphan?.answer.id]);

  const zoomIn  = () => setZoom((z) => Math.min(z + 0.2, 2.5));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.4));
  const activePages = new Set(highlights.map((h) => h.page));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#1F2937", overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{
        height: "48px", backgroundColor: "#1F2937", borderBottom: "1px solid #374151",
        display: "flex", alignItems: "center", padding: "0 16px", gap: "12px", flexShrink: 0,
      }}>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "#FFFFFF" }}>Answer Sheet</span>
        <div style={{ flex: 1 }} />

        {/* Zoom */}
        <div style={{ display:"flex", alignItems:"center", gap:"4px", backgroundColor:"#374151", borderRadius:"8px", padding:"4px 8px" }}>
          <button onClick={zoomOut} style={{ background:"none", border:"none", cursor:"pointer", color:"#D1D5DB", padding:"2px", display:"flex" }}><ZoomOutIcon /></button>
          <button onClick={() => setZoom(1)} style={{ background:"none", border:"none", cursor:"pointer", color:"#D1D5DB", fontSize:"12px", padding:"2px 6px", minWidth:"52px" }}>
            {Math.round(zoom * 100)}%
          </button>
          <button onClick={zoomIn} style={{ background:"none", border:"none", cursor:"pointer", color:"#D1D5DB", padding:"2px", display:"flex" }}><ZoomInIcon /></button>
        </div>

        {/* Page nav (only for multi-page image sets) */}
        {!isPDF && images.length > 1 && (
          <div style={{ display:"flex", alignItems:"center", gap:"4px", backgroundColor:"#374151", borderRadius:"8px", padding:"4px 8px" }}>
            <button onClick={() => setCurrentPage((p) => Math.max(0, p-1))} disabled={currentPage===0}
              style={{ background:"none", border:"none", cursor:currentPage===0?"not-allowed":"pointer", color:currentPage===0?"#6B7280":"#D1D5DB", padding:"2px", display:"flex" }}><ChevLeft /></button>
            <span style={{ fontSize:"12px", color:"#D1D5DB", padding:"0 6px" }}>Page {currentPage+1} of {images.length}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(images.length-1, p+1))} disabled={currentPage===images.length-1}
              style={{ background:"none", border:"none", cursor:currentPage===images.length-1?"not-allowed":"pointer", color:currentPage===images.length-1?"#6B7280":"#D1D5DB", padding:"2px", display:"flex" }}><ChevRight /></button>
          </div>
        )}
      </div>

      {/* Page dots for multi-image sheets */}
      {!isPDF && images.length > 1 && (
        <div style={{ display:"flex", gap:"6px", justifyContent:"center", padding:"8px", backgroundColor:"#1F2937", flexShrink:0 }}>
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i)} style={{
              width: i===currentPage?"20px":"8px", height:"8px", borderRadius:"999px",
              backgroundColor: i===currentPage ? "#E14F26" : activePages.has(i) ? "#10B981" : "#4B5563",
              border:"none", cursor:"pointer", padding:0, transition:"all 0.2s",
            }}/>
          ))}
        </div>
      )}

      {/* PDF note banner */}
      {isPDF && highlights.length > 0 && (
        <div style={{
          backgroundColor: "#065F46", color: "#A7F3D0", padding: "8px 16px",
          fontSize: "12px", flexShrink: 0, display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span>📍</span>
          Answer found on page {(highlights[0].page ?? 0) + 1} of the PDF — scroll to that page in the viewer below.
        </div>
      )}

      {/* Canvas / iframe area */}
      <div style={{ flex:1, overflow:"auto", display:"flex", justifyContent:"center", padding:"24px" }}>
        {images.length > 0 ? (
          <PageViewer
            dataUrl={isPDF ? images[0] : images[currentPage]}
            pageIndex={isPDF ? 0 : currentPage}
            highlights={highlights}
            zoom={zoom}
            isPDF={isPDF}
          />
        ) : (
          <div style={{ color:"#6B7280", fontSize:"14px", alignSelf:"center" }}>No image available</div>
        )}
      </div>

      {/* Legend */}
      <div style={{
        display:"flex", gap:"16px", padding:"8px 16px",
        backgroundColor:"#111827", borderTop:"1px solid #374151",
        flexShrink:0, flexWrap:"wrap",
      }}>
        {(["confirmed","inferred","orphan"] as const).map((key) => (
          <div key={key} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <div style={{
              width:"12px", height:"12px", borderRadius:"2px",
              backgroundColor: HIGHLIGHT_COLORS[key].fill,
              border: `2px solid ${HIGHLIGHT_COLORS[key].border}`,
            }}/>
            <span style={{ fontSize:"11px", color:"#9CA3AF" }}>
              {key==="confirmed"?"Confirmed Match":key==="inferred"?"Low Confidence":"Unmatched"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
