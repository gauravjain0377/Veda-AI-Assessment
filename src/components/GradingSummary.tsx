"use client";

import { ProcessingResult } from "@/lib/types";

interface GradingSummaryProps {
  result: ProcessingResult;
  onReset: () => void;
}

export default function GradingSummary({ result, onReset }: GradingSummaryProps) {
  const percentage =
    result.totalMaxScore > 0
      ? Math.round((result.totalScore / result.totalMaxScore) * 100)
      : 0;

  const scoreColor =
    percentage >= 70 ? "#10B981" : percentage >= 40 ? "#F59E0B" : "#EF4444";

  return (
    <div
      style={{
        backgroundColor: "var(--sidebar-bg)",
        borderBottom: "1px solid var(--border-color)",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexShrink: 0,
        flexWrap: "wrap",
      }}
    >
      {/* Back + breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={onReset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            color: "var(--text-secondary)",
            padding: "4px 8px",
            borderRadius: "6px",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--border-color)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <span style={{ color: "var(--text-tertiary)", fontSize: "13px" }}>/</span>
        <span style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>Exams</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Score summary chips */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        {/* Total score */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--content-bg)",
            borderRadius: "10px",
            padding: "8px 14px",
            border: "1px solid var(--border-color)",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: "800",
              color: scoreColor,
              lineHeight: 1,
            }}
          >
            {result.totalScore}
            <span style={{ fontSize: "13px", color: "var(--text-tertiary)", fontWeight: "500" }}>
              /{result.totalMaxScore}
            </span>
          </div>
          <div>
            <div style={{ fontSize: "10px", color: "var(--text-tertiary)", fontWeight: "500" }}>TOTAL SCORE</div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: scoreColor }}>
              {percentage}%
            </div>
          </div>
        </div>

        {/* Answered */}
        <div
          style={{
            textAlign: "center",
            backgroundColor: "var(--chip-green-bg)",
            borderRadius: "10px",
            padding: "8px 14px",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--chip-green-text)" }}>
            {result.answeredCount}
          </div>
          <div style={{ fontSize: "10px", color: "var(--chip-green-text)", fontWeight: "600" }}>ANSWERED</div>
        </div>

        {/* Unanswered */}
        <div
          style={{
            textAlign: "center",
            backgroundColor: "var(--chip-red-bg)",
            borderRadius: "10px",
            padding: "8px 14px",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--chip-red-text)" }}>
            {result.unansweredCount}
          </div>
          <div style={{ fontSize: "10px", color: "var(--chip-red-text)", fontWeight: "600" }}>UNANSWERED</div>
        </div>

        {/* Orphans */}
        {result.orphanCount > 0 && (
          <div
            style={{
              textAlign: "center",
              backgroundColor: "var(--chip-gray-bg)",
              borderRadius: "10px",
              padding: "8px 14px",
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--chip-gray-text)" }}>
              {result.orphanCount}
            </div>
            <div style={{ fontSize: "10px", color: "var(--chip-gray-text)", fontWeight: "600" }}>UNMATCHED</div>
          </div>
        )}
      </div>
    </div>
  );
}
