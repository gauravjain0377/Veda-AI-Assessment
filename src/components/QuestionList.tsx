"use client";

import { useState } from "react";
import { MappedQuestion, OrphanAnswer } from "@/lib/types";
import StatusChip, { ScoreBadge } from "./StatusChip";

interface QuestionListProps {
  mappedQuestions: MappedQuestion[];
  orphanAnswers: OrphanAnswer[];
  selectedId: string | null;
  onSelect: (id: string, type: "question" | "orphan") => void;
  totalScore: number;
  totalMaxScore: number;
}

function ChevronIcon({ down }: { down: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ transform: down ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
    >
      <path d="M4 6l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExpandAllIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 5l5 5 5-5" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function QuestionList({
  mappedQuestions,
  orphanAnswers,
  selectedId,
  onSelect,
  totalScore,
  totalMaxScore,
}: QuestionListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  const handleExpandAll = () => {
    if (allExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(mappedQuestions.map((m) => m.question.id)));
    }
    setAllExpanded(!allExpanded);
  };

  return (
    <div
      className="w-full md:w-[420px]"
      style={{
        flexShrink: 0,
        backgroundColor: "var(--sidebar-bg)",
        borderRight: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          <h2 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
            Extracted Questions <span style={{ color: "var(--text-tertiary)", fontWeight: "400" }}>(from question paper)</span>
          </h2>
        </div>
        <button
          onClick={handleExpandAll}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12px",
            color: "var(--text-secondary)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "6px",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--border-color)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
        >
          <ExpandAllIcon />
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {/* Question list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px", backgroundColor: "var(--content-bg)" }}>
        {mappedQuestions.map((mapped, index) => {
          const isSelected = selectedId === mapped.question.id;
          const isExpanded = expandedIds.has(mapped.question.id) || isSelected;
          const hasAnswer = mapped.answer !== null;

          return (
            <div
              key={mapped.question.id}
              style={{
                border: `1.5px solid ${isSelected ? "#E14F26" : "var(--border-color)"}`,
                borderRadius: "10px",
                marginBottom: "6px",
                backgroundColor: isSelected ? "var(--brand-orange-bg)" : "var(--card-bg)",
                overflow: "hidden",
                transition: "border-color 0.2s, background-color 0.2s",
              }}
            >
              {/* Question row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (hasAnswer) onSelect(mapped.question.id, "question");
                  toggleExpand(mapped.question.id);
                }}
              >
                {/* Number badge */}
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    backgroundColor: isSelected ? "#E14F26" : "var(--border-color)",
                    color: isSelected ? "white" : "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "700",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  {index + 1}
                </div>

                {/* Question text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      WebkitLineClamp: isExpanded ? undefined : 2,
                      WebkitBoxOrient: "vertical" as const,
                      overflow: isExpanded ? "visible" : "hidden",
                    }}
                  >
                    {mapped.question.text}
                  </p>
                </div>

                {/* Score + chevron */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  {mapped.grading && (
                    <ScoreBadge
                      score={mapped.grading.score}
                      maxScore={mapped.grading.maxScore}
                      verdict={mapped.grading.verdict}
                    />
                  )}
                  <ChevronIcon down={isExpanded} />
                </div>
              </div>

              {/* Expanded: status chip + AI feedback */}
              {isExpanded && (
                <div
                  style={{
                    padding: "0 14px 14px",
                    borderTop: "1px solid var(--border-color)",
                    marginTop: "-2px",
                  }}
                >
                  <div style={{ display: "flex", gap: "6px", marginBottom: "10px", paddingTop: "10px" }}>
                    <StatusChip confidence={mapped.confidence} compact />
                    {mapped.confidence === "inferred" && (
                      <span
                        style={{
                          fontSize: "10px",
                          color: "var(--text-tertiary)",
                          alignSelf: "center",
                        }}
                      >
                        (matched by content similarity)
                      </span>
                    )}
                  </div>

                  {mapped.grading && mapped.grading.feedback && (
                    <div
                      style={{
                        backgroundColor: "var(--content-bg)",
                        borderRadius: "8px",
                        padding: "10px 12px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "var(--text-primary)",
                          margin: "0 0 6px",
                        }}
                      >
                        AI Feedback
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          margin: 0,
                          lineHeight: "1.5",
                        }}
                      >
                        {mapped.grading.feedback}
                      </p>
                    </div>
                  )}

                  {!hasAnswer && (
                    <p style={{ fontSize: "12px", color: "var(--score-incorrect)", margin: "8px 0 0" }}>
                      No answer found for this question.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Orphan answers section */}
        {orphanAnswers.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <h3
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "var(--text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: "0 4px 8px",
              }}
            >
              Unmatched Answers ({orphanAnswers.length})
            </h3>
            {orphanAnswers.map((orphan) => {
              const isSelected = selectedId === orphan.answer.id;
              return (
                <div
                  key={orphan.answer.id}
                  onClick={() => onSelect(orphan.answer.id, "orphan")}
                  style={{
                    border: `1.5px solid ${isSelected ? "var(--text-secondary)" : "var(--border-color)"}`,
                    borderRadius: "10px",
                    marginBottom: "6px",
                    backgroundColor: isSelected ? "var(--border-color)" : "var(--card-bg)",
                    padding: "12px 14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      backgroundColor: "var(--border-color)",
                      color: "var(--text-tertiary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: "700",
                      flexShrink: 0,
                    }}
                  >
                    ?
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "12px",
                        color: "var(--text-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {orphan.answer.text.slice(0, 80) || "Unlabeled answer block"}...
                    </p>
                    <StatusChip confidence="orphan" compact />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
