"use client";

import { ProcessingStage } from "@/lib/types";

const STAGES: { key: ProcessingStage; label: string; description: string }[] = [
  { key: "uploading", label: "Uploading", description: "Sending files to server..." },
  { key: "extracting-questions", label: "Extracting Questions", description: "Reading question paper with AI..." },
  { key: "extracting-answers", label: "Extracting Answers", description: "Reading handwritten answers with AI..." },
  { key: "mapping", label: "Mapping Answers", description: "Matching answers to questions..." },
  { key: "grading", label: "Grading", description: "Evaluating and generating feedback..." },
  { key: "done", label: "Done", description: "Analysis complete!" },
];

function SparkleIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      {/* Central large sparkle */}
      <path
        d="M40 10 L43 34 L67 37 L43 40 L40 64 L37 40 L13 37 L37 34 Z"
        fill="#E14F26"
        style={{ animation: "sparkle-pulse 2s ease-in-out infinite" }}
      />
      {/* Top-right small sparkle */}
      <path
        d="M60 8 L61.5 16 L69 17.5 L61.5 19 L60 27 L58.5 19 L51 17.5 L58.5 16 Z"
        fill="#E14F26"
        opacity="0.7"
        style={{ animation: "sparkle-pulse 2s ease-in-out infinite 0.4s" }}
      />
      {/* Bottom-left small sparkle */}
      <path
        d="M20 53 L21.2 59 L27 60.2 L21.2 61.4 L20 67 L18.8 61.4 L13 60.2 L18.8 59 Z"
        fill="#E14F26"
        opacity="0.5"
        style={{ animation: "sparkle-pulse 2s ease-in-out infinite 0.8s" }}
      />
    </svg>
  );
}

interface ProgressScreenProps {
  stage: ProcessingStage;
  progress?: number;
}

export default function ProgressScreen({ stage, progress = 0 }: ProgressScreenProps) {
  const currentStageIdx = STAGES.findIndex((s) => s.key === stage);
  const currentStage = STAGES[currentStageIdx] || STAGES[0];

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px",
        backgroundColor: "var(--content-bg)",
        transition: "background-color 0.2s ease",
      }}
    >
      {/* Sparkle animation */}
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          backgroundColor: "var(--card-bg)",
          border: "2px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 24px rgba(225, 79, 38, 0.12)",
          transition: "all 0.2s ease",
        }}
      >
        <SparkleIcon />
      </div>

      {/* Stage text */}
      <div style={{ textAlign: "center" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "var(--text-primary)",
            margin: "0 0 8px",
          }}
        >
          {currentStage.label}...
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
          {currentStage.description}
        </p>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "320px",
          backgroundColor: "var(--border-color)",
          borderRadius: "999px",
          height: "6px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "#E14F26",
            borderRadius: "999px",
            width: `${progress}%`,
            transition: "width 0.5s ease",
          }}
        />
      </div>

      {/* Stage dots */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {STAGES.slice(0, -1).map((s, i) => {
          const isDone = i < currentStageIdx;
          const isCurrent = i === currentStageIdx;
          return (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: isCurrent ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "999px",
                  backgroundColor: isDone || isCurrent ? "#E14F26" : "var(--border-color)",
                  transition: "all 0.3s ease",
                  opacity: isDone ? 0.5 : 1,
                }}
              />
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: "12px", color: "var(--text-tertiary)", margin: 0 }}>
        This may take a while for large documents
      </p>
    </div>
  );
}
