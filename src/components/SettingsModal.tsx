"use client";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  theme,
  onThemeChange,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        animation: "fade-in 0.2s ease-out forwards",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "360px",
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.04)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            ⚙ Preferences
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: "var(--text-secondary)",
              padding: "4px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Content - Dark Mode Preference toggle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", margin: "0 0 2px" }}>
                Theme Mode
              </p>
              <p style={{ fontSize: "11px", color: "var(--text-secondary)", margin: 0 }}>
                Adjust app colors for light or dark mode
              </p>
            </div>

            {/* Toggle switch */}
            <button
              onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
              style={{
                width: "48px",
                height: "26px",
                borderRadius: "999px",
                backgroundColor: theme === "dark" ? "#E14F26" : "#E5E7EB",
                border: "none",
                cursor: "pointer",
                position: "relative",
                padding: "2px",
                transition: "background-color 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  position: "absolute",
                  top: "2px",
                  left: theme === "dark" ? "24px" : "2px",
                  transition: "left 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                }}
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </div>
            </button>
          </div>

        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          style={{
            marginTop: "24px",
            width: "100%",
            backgroundColor: "#111827",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Save &amp; Close
        </button>
      </div>
    </div>
  );
}
