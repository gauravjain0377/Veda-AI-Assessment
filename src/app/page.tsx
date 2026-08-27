"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ProgressScreen from "@/components/ProgressScreen";
import ReviewScreen from "@/components/ReviewScreen";
import MobileHeader from "@/components/MobileHeader";
import MobileDrawer from "@/components/MobileDrawer";
import SettingsModal from "@/components/SettingsModal";
import DashboardView from "@/components/DashboardView";
import ClassroomView from "@/components/ClassroomView";
import AssignmentsView from "@/components/AssignmentsView";
import LibraryView from "@/components/LibraryView";
import { ProcessingResult, ProcessingStage } from "@/lib/types";

interface UploadedFile {
  file: File;
  name: string;
  size: string;
  pages?: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 16V8M8 12l4-4 4 4" stroke="#E14F26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" stroke="#E14F26" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <div
      style={{
        width: "36px",
        height: "36px",
        backgroundColor: "#EF4444",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "10px",
        fontWeight: "700",
        color: "white",
        flexShrink: 0,
      }}
    >
      PDF
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 2l10 10M12 2L2 12" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TeacherIllustration() {
  return (
    <div
      style={{
        width: "90px",
        height: "90px",
        position: "relative",
        margin: "0 auto 32px",
      }}
    >
      {/* Outer ring */}
      <div
        style={{
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          border: "2px dashed #E14F26",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* Inner circle with teacher */}
        <div
          style={{
            width: "68px",
            height: "68px",
            borderRadius: "50%",
            backgroundColor: "#FEF0EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
          }}
        >
          👩‍🏫
        </div>
      </div>
      {/* Orange dots around the circle */}
      {[0, 90, 180, 270].map((deg) => (
        <div
          key={deg}
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#E14F26",
            top: "50%",
            left: "50%",
            transform: `rotate(${deg}deg) translateX(44px) translateY(-50%)`,
          }}
        />
      ))}
    </div>
  );
}

interface DropZoneProps {
  label: string;
  highlightWord: string;
  accept: string;
  file: UploadedFile | null;
  onFile: (file: UploadedFile) => void;
  onClear: () => void;
  disabled?: boolean;
}

function DropZone({ label, highlightWord, accept, file, onFile, onClear, disabled }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f) return;
    onFile({
      file: f,
      name: f.name,
      size: formatSize(f.size),
    });
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled]
  );

  if (file) {
    return (
      <div
        style={{
          flex: 1,
          border: "1.5px solid var(--border-color)",
          borderRadius: "12px",
          backgroundColor: "var(--card-bg)",
          padding: "24px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minHeight: "120px",
        }}
      >
        <PdfIcon />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--text-primary)",
              margin: "0 0 4px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {file.name}
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-tertiary)", margin: 0 }}>
            {file.size}
            {file.pages ? ` • ${file.pages} Pages` : ""}
          </p>
        </div>
        <button
          onClick={onClear}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: "var(--border-color)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "var(--text-primary)",
          }}
        >
          <CloseIcon />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      style={{
        flex: 1,
        border: `1.5px dashed ${dragging ? "#E14F26" : "var(--border-color)"}`,
        borderRadius: "12px",
        backgroundColor: dragging ? "var(--brand-orange-bg)" : "var(--card-bg)",
        padding: "32px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "border-color 0.2s, background-color 0.2s",
        minHeight: "120px",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <UploadIcon />
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", margin: "0 0 4px" }}>
          Upload{" "}
          <span style={{ color: "#E14F26" }}>{highlightWord}</span>
        </p>
        <p style={{ fontSize: "11px", color: "var(--text-secondary)", margin: "0 0 6px" }}>PDF, JPG, PNG &bull; Max 10MB</p>
        <p style={{ fontSize: "11px", color: "var(--text-tertiary)", margin: 0 }}>Drag &amp; drop or click to browse</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export default function HomePage() {
  const [questionPaper, setQuestionPaper] = useState<UploadedFile | null>(null);
  const [answerSheet, setAnswerSheet] = useState<UploadedFile | null>(null);
  const [stage, setStage] = useState<ProcessingStage>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // View state: home | classroom | assignments | exams | library
  const [currentView, setCurrentView] = useState("exams");

  // Responsive & Settings states
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

  const canStart = questionPaper !== null && answerSheet !== null;

  const handleStartMapping = async () => {
    if (!canStart) return;

    setStage("uploading");
    setProgress(10);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("questionPaper", questionPaper!.file);
      formData.append("answerSheet", answerSheet!.file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Upload failed");
      }

      const { sessionId } = await uploadRes.json();
      setProgress(20);

      const eventSource = new EventSource(`/api/status/${sessionId}`);

      eventSource.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setStage(data.stage as ProcessingStage);
        setProgress(data.progress || 0);

        if (data.stage === "done") {
          eventSource.close();
          fetch(`/api/results/${sessionId}`)
            .then((r) => r.json())
            .then((resultData) => {
              setResult(resultData);
              setStage("done");
            })
            .catch((err) => {
              setError("Failed to load results");
              setStage("error");
            });
        } else if (data.stage === "error") {
          eventSource.close();
          setError(data.error || "Processing failed");
          setStage("error");
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setError("Connection error during processing");
        setStage("error");
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStage("error");
    }
  };

  const handleReset = () => {
    setStage("idle");
    setResult(null);
    setError(null);
    setProgress(0);
    setQuestionPaper(null);
    setAnswerSheet(null);
  };

  // Show review screen when done (takes over the whole viewport)
  if (currentView === "exams" && stage === "done" && result) {
    return <ReviewScreen result={result} onReset={handleReset} currentView={currentView} onViewChange={setCurrentView} />;
  }

  // Show progress screen during processing
  if (currentView === "exams" && stage !== "idle" && stage !== "error") {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <MobileHeader onMenuToggle={() => setIsMobileNavOpen(true)} onSettingsToggle={() => setIsSettingsOpen(true)} />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <Sidebar currentView={currentView} onViewChange={setCurrentView} onSettingsClick={() => setIsSettingsOpen(true)} />
          <ProgressScreen stage={stage} progress={progress} />
        </div>
        <MobileDrawer isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} currentView={currentView} onViewChange={setCurrentView} onSettingsToggle={() => setIsSettingsOpen(true)} />
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} theme={theme} onThemeChange={handleThemeChange} />
      </div>
    );
  }

  // Render content based on sidebar view state
  const renderContent = () => {
    switch (currentView) {
      case "home":
        return <DashboardView onStartExam={() => setCurrentView("exams")} />;
      case "classroom":
        return <ClassroomView />;
      case "assignments":
        return <AssignmentsView />;
      case "library":
        return <LibraryView />;
      case "exams":
      default:
        return (
          <main
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 24px",
              backgroundColor: "var(--content-bg)",
              overflow: "auto",
              transition: "all 0.2s ease",
            }}
          >
            {/* Page header */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h1 style={{ fontSize: "30px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                Upload <span style={{ color: "#E14F26" }}>Question Paper &amp; Answer Sheets</span>
              </h1>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                Upload both files to get started
              </p>
            </div>

            {/* Teacher illustration */}
            <TeacherIllustration />

            {/* Upload zones */}
            <div
              style={{
                display: "flex",
                flexDirection: typeof window !== "undefined" && window.innerWidth < 768 ? "column" : "row",
                gap: "16px",
                width: "100%",
                maxWidth: "700px",
                marginBottom: "24px",
              }}
              className="flex-col md:flex-row"
            >
              <DropZone
                label="Upload Question Paper"
                highlightWord="Question Paper"
                accept=".pdf,.jpg,.jpeg,.png"
                file={questionPaper}
                onFile={setQuestionPaper}
                onClear={() => setQuestionPaper(null)}
              />
              <DropZone
                label="Upload Answer Sheet"
                highlightWord="Answer Sheet"
                accept=".pdf,.jpg,.jpeg,.png"
                file={answerSheet}
                onFile={setAnswerSheet}
                onClear={() => setAnswerSheet(null)}
              />
            </div>

            {/* Error message */}
            {error && (
              <div
                style={{
                  backgroundColor: "#FDE8E8",
                  border: "1px solid #FCA5A5",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  marginBottom: "16px",
                  fontSize: "13px",
                  color: "#9B1C1C",
                  width: "100%",
                  maxWidth: "700px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>⚠️</span>
                {error}
                <button
                  onClick={() => setError(null)}
                  style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#9B1C1C" }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Start Mapping button */}
            <button
              onClick={handleStartMapping}
              disabled={!canStart}
              style={{
                backgroundColor: canStart ? "#111827" : "var(--border-color)",
                color: canStart ? "white" : "var(--text-tertiary)",
                border: "none",
                borderRadius: "10px",
                padding: "14px 32px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: canStart ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
                marginBottom: "12px",
              }}
            >
              Start Mapping
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <p style={{ fontSize: "13px", color: "var(--text-tertiary)", textAlign: "center", margin: 0 }}>
              Once both files are uploaded, you'll able to map answers with questions
            </p>
          </main>
        );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Mobile Top Bar */}
      <MobileHeader onMenuToggle={() => setIsMobileNavOpen(true)} onSettingsToggle={() => setIsSettingsOpen(true)} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar currentView={currentView} onViewChange={setCurrentView} onSettingsClick={() => setIsSettingsOpen(true)} />

        {renderContent()}
      </div>

      <MobileDrawer isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} currentView={currentView} onViewChange={setCurrentView} onSettingsToggle={() => setIsSettingsOpen(true)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} theme={theme} onThemeChange={handleThemeChange} />
    </div>
  );
}
