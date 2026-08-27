"use client";

import { useState } from "react";
import { VedaAILogo } from "./Sidebar";

interface MobileHeaderProps {
  onBack?: () => void;
  onMenuToggle: () => void;
  onSettingsToggle: () => void;
}

export default function MobileHeader({
  onBack,
  onMenuToggle,
  onSettingsToggle,
}: MobileHeaderProps) {
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifications = [
    { id: 1, text: "Class 10 Unit Test grading complete", time: "2 mins ago", unread: true },
    { id: 2, text: "Gemini 3.6 processed paper with 98% confidence", time: "10 mins ago", unread: false },
    { id: 3, text: "Delhi Public School dashboard sync complete", time: "1 hr ago", unread: false },
  ];

  return (
    <header
      className="flex md:hidden"
      style={{
        height: "56px",
        backgroundColor: "var(--sidebar-bg)",
        borderBottom: "1px solid var(--border-color)",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* Left: Back arrow / Logo + Text */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {onBack ? (
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              color: "var(--text-primary)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 10H5M10 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <VedaAILogo size={28} />
        )}
        <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)" }}>VedaAI</span>
      </div>

      {/* Right side controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
        {/* Bell Icon with orange dot */}
        <button
          onClick={() => {
            setIsBellOpen(!isBellOpen);
            setIsProfileOpen(false);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            color: "var(--text-primary)",
            position: "relative",
            display: "flex",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 17a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0010 17z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Notification Orange Badge */}
          <div
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#E14F26",
            }}
          />
        </button>

        {/* Notifications Popover Dropdown */}
        {isBellOpen && (
          <div
            style={{
              position: "absolute",
              top: "36px",
              right: "40px",
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              width: "280px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
              padding: "8px 0",
              zIndex: 100,
            }}
          >
            <div style={{ padding: "8px 16px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)" }}>Notifications</span>
              <span style={{ fontSize: "10px", color: "#E14F26", fontWeight: "600", cursor: "pointer" }}>Mark all read</span>
            </div>
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: "10px 16px",
                  borderBottom: "1px solid var(--border-color)",
                  cursor: "pointer",
                  backgroundColor: n.unread ? "var(--brand-orange-bg)" : "transparent",
                }}
                onClick={() => setIsBellOpen(false)}
              >
                <p style={{ fontSize: "11px", color: "var(--text-primary)", margin: "0 0 2px", fontWeight: n.unread ? "600" : "400" }}>{n.text}</p>
                <span style={{ fontSize: "9px", color: "var(--text-tertiary)" }}>{n.time}</span>
              </div>
            ))}
          </div>
        )}

        {/* Avatar Profile Icon */}
        <button
          onClick={() => {
            setIsProfileOpen(!isProfileOpen);
            setIsBellOpen(false);
          }}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: "#F59E0B",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          DP
        </button>

        {/* Profile Popover Dropdown */}
        {isProfileOpen && (
          <div
            style={{
              position: "absolute",
              top: "36px",
              right: "10px",
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              width: "220px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
              padding: "12px",
              zIndex: 100,
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-primary)" }}>Delhi Public School</div>
              <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>Bokaro Steel City</div>
            </div>
            <hr style={{ border: "0", borderTop: "1px solid var(--border-color)", margin: "8px 0" }} />
            <button
              onClick={() => {
                setIsProfileOpen(false);
                onSettingsToggle();
              }}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: "6px 0",
                fontSize: "12px",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ⚙ Preferences
            </button>
          </div>
        )}

        {/* Hamburger Menu (three lines) */}
        <button
          onClick={onMenuToggle}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
