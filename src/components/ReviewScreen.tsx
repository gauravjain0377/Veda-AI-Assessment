"use client";

import { useState, useEffect } from "react";
import { ProcessingResult, MappedQuestion, OrphanAnswer } from "@/lib/types";
import Sidebar from "./Sidebar";
import QuestionList from "./QuestionList";
import AnswerSheetViewer from "./AnswerSheetViewer";
import GradingSummary from "./GradingSummary";
import MobileHeader from "./MobileHeader";
import MobileDrawer from "./MobileDrawer";
import SettingsModal from "./SettingsModal";

interface ReviewScreenProps {
  result: ProcessingResult;
  onReset: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function ReviewScreen({ result, onReset, currentView, onViewChange }: ReviewScreenProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    result.mappedQuestions[0]?.question.id || null
  );
  const [selectedOrphanId, setSelectedOrphanId] = useState<string | null>(null);

  // Responsive & Settings states
  const [activeTab, setActiveTab] = useState<"questions" | "answers">("questions");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Initialize theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleSelect = (id: string, type: "question" | "orphan") => {
    if (type === "question") {
      setSelectedQuestionId(id);
      setSelectedOrphanId(null);
    } else {
      setSelectedOrphanId(id);
      setSelectedQuestionId(null);
    }
    // Auto switch tab to answers on mobile when user clicks a question to view highlight
    if (window.innerWidth < 768) {
      setActiveTab("answers");
    }
  };

  const selectedQuestion = result.mappedQuestions.find(
    (m) => m.question.id === selectedQuestionId
  ) || null;

  const selectedOrphan = result.orphanAnswers.find(
    (o) => o.answer.id === selectedOrphanId
  ) || null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "var(--content-bg)",
      }}
    >
      {/* Mobile Top Bar */}
      <MobileHeader onBack={onReset} onMenuToggle={() => setIsMobileNavOpen(true)} onSettingsToggle={() => setIsSettingsOpen(true)} />

      {/* Segment controller for mobile screens */}
      <div
        className="flex md:hidden"
        style={{
          padding: "8px 16px",
          backgroundColor: "var(--sidebar-bg)",
          borderBottom: "1px solid var(--border-color)",
          gap: "8px",
        }}
      >
        <button
          onClick={() => setActiveTab("questions")}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            border: "none",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            backgroundColor: activeTab === "questions" ? "var(--text-primary)" : "var(--border-color)",
            color: activeTab === "questions" ? "var(--sidebar-bg)" : "var(--text-secondary)",
            transition: "all 0.15s ease",
          }}
        >
          Questions
        </button>
        <button
          onClick={() => setActiveTab("answers")}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            border: "none",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            backgroundColor: activeTab === "answers" ? "var(--text-primary)" : "var(--border-color)",
            color: activeTab === "answers" ? "var(--sidebar-bg)" : "var(--text-secondary)",
            transition: "all 0.15s ease",
          }}
        >
          Answer Sheet
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <Sidebar currentView={currentView} onViewChange={onViewChange} onSettingsClick={() => setIsSettingsOpen(true)} />

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Quality warning */}
          {result.qualityWarning && (
            <div
              style={{
                backgroundColor: "#FEF3C7",
                borderBottom: "1px solid #FCD34D",
                padding: "10px 20px",
                fontSize: "13px",
                color: "#92400E",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              <span>⚠️</span>
              {result.qualityWarning}
            </div>
          )}

          {/* Grading summary bar */}
          <GradingSummary result={result} onReset={onReset} />

          {/* Overall AI feedback */}
          {result.overallFeedback && (
            <div
              style={{
                backgroundColor: "var(--chip-green-bg)",
                borderBottom: "1px solid var(--border-color)",
                padding: "10px 20px",
                fontSize: "13px",
                color: "var(--chip-green-text)",
                lineHeight: "1.5",
                flexShrink: 0,
              }}
            >
              <strong>AI Overall Feedback: </strong>
              {result.overallFeedback}
            </div>
          )}

          {/* Two-pane layout */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* Left: Question list (shown on mobile only when questions tab is active) */}
            <div
              className={`${activeTab === "questions" ? "flex" : "hidden"} md:flex`}
              style={{ flexShrink: 0, height: "100%" }}
            >
              <QuestionList
                mappedQuestions={result.mappedQuestions}
                orphanAnswers={result.orphanAnswers}
                selectedId={selectedQuestionId || selectedOrphanId}
                onSelect={handleSelect}
                totalScore={result.totalScore}
                totalMaxScore={result.totalMaxScore}
              />
            </div>

            {/* Right: Answer sheet viewer (shown on mobile only when answers tab is active) */}
            <div
              className={`${activeTab === "answers" ? "flex" : "hidden"} md:flex`}
              style={{ flex: 1, height: "100%", overflow: "hidden" }}
            >
              <AnswerSheetViewer
                images={result.answerSheetImages}
                selectedQuestion={selectedQuestion}
                selectedOrphan={selectedOrphan}
                allMappedQuestions={result.mappedQuestions}
              />
            </div>
          </div>
        </div>
      </div>

      <MobileDrawer isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} currentView={currentView} onViewChange={onViewChange} onSettingsToggle={() => setIsSettingsOpen(true)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} theme={theme} onThemeChange={handleThemeChange} />
    </div>
  );
}
