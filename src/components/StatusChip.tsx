"use client";

import { MatchConfidence, Verdict } from "@/lib/types";

interface StatusChipProps {
  confidence: MatchConfidence;
  verdict?: Verdict | null;
  compact?: boolean;
}

const CONFIG = {
  confirmed: {
    bg: "var(--chip-green-bg)",
    text: "var(--chip-green-text)",
    label: "Answered",
  },
  inferred: {
    bg: "var(--chip-amber-bg)",
    text: "var(--chip-amber-text)",
    label: "Low Confidence",
  },
  unanswered: {
    bg: "var(--chip-red-bg)",
    text: "var(--chip-red-text)",
    label: "Unanswered",
  },
  orphan: {
    bg: "var(--chip-gray-bg)",
    text: "var(--chip-gray-text)",
    label: "Unmatched",
  },
};

export default function StatusChip({ confidence, compact = false }: StatusChipProps) {
  const config = CONFIG[confidence];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: compact ? "2px 8px" : "3px 10px",
        borderRadius: "999px",
        fontSize: compact ? "10px" : "11px",
        fontWeight: "600",
        backgroundColor: config.bg,
        color: config.text,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {config.label}
    </span>
  );
}

interface ScoreBadgeProps {
  score: number;
  maxScore: number;
  verdict: Verdict;
}

export function ScoreBadge({ score, maxScore, verdict }: ScoreBadgeProps) {
  const color =
    verdict === "correct"
      ? "var(--score-correct)"
      : verdict === "partial"
      ? "var(--score-partial)"
      : "var(--score-incorrect)";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: "13px",
        fontWeight: "700",
        color,
        flexShrink: 0,
        minWidth: "40px",
        justifyContent: "flex-end",
      }}
    >
      {score}/{maxScore}
    </span>
  );
}
