"use client";

import { VedaAILogo } from "./Sidebar";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView?: string;
  onViewChange?: (view: string) => void;
  onSettingsToggle: () => void;
}

export default function MobileDrawer({ isOpen, onClose, currentView = "exams", onViewChange, onSettingsToggle }: MobileDrawerProps) {
  if (!isOpen) return null;

  const navItems = [
    { label: "Home", view: "home" },
    { label: "My Classroom", view: "classroom" },
    { label: "Assignments", view: "assignments" },
    { label: "Exams", view: "exams" },
    { label: "My Library", view: "library" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "260px",
          height: "100%",
          backgroundColor: "var(--sidebar-bg)",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          animation: "slide-in-right 0.2s ease-out forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <VedaAILogo size={28} />
            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>VedaAI</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: "var(--text-primary)",
              padding: "4px",
            }}
          >
            ✕
          </button>
        </div>

        {/* AI Teacher's Toolkit button */}
        <button
          style={{
            width: "100%",
            backgroundColor: "var(--text-primary)",
            color: "var(--sidebar-bg)",
            border: "none",
            borderRadius: "8px",
            padding: "10px",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            marginBottom: "16px",
          }}
        >
          ✦ AI Teacher's Toolkit
        </button>

        {/* Nav list */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.label}
                onClick={() => {
                  onClose();
                  onViewChange?.(item.view);
                }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "13px",
                  fontWeight: isActive ? "600" : "400",
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  backgroundColor: isActive ? "var(--border-color)" : "transparent",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Footer info + Settings toggle */}
        <div style={{ borderTop: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "10px", paddingTop: "12px" }}>
          <button
            onClick={() => {
              onClose();
              onSettingsToggle();
            }}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "13px",
              color: "var(--text-secondary)",
              backgroundColor: "transparent",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ⚙ Settings
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "#F59E0B",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: "600",
              }}
            >
              DPS
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-primary)" }}>Delhi Public School</div>
              <div style={{ fontSize: "9px", color: "var(--text-tertiary)" }}>Bokaro Steel City</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
