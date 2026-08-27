"use client";

// VedaAI Logo SVG component
export function VedaAILogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#111827" />
      <text x="6" y="22" fontSize="16" fontWeight="700" fill="white" fontFamily="serif">V</text>
    </svg>
  );
}



function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1.5 6.5L8 1.5L14.5 6.5V14.5H10V10H6V14.5H1.5V6.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
function ClassroomIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 13v2M10.5 13v2M3 15h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function AssignmentsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 1.5H12C12.8 1.5 13.5 2.2 13.5 3V13C13.5 13.8 12.8 14.5 12 14.5H4C3.2 14.5 2.5 13.8 2.5 13V3C2.5 2.2 3.2 1.5 4 1.5Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 6h5M5.5 9h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function ExamsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 1.5H10L13.5 5V14.5H3V1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M10 1.5V5H13.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function LibraryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 4.5v4l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.3 3.3l1.1 1.1M11.6 11.6l1.1 1.1M3.3 12.7l1.1-1.1M11.6 4.4l1.1-1.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// Navigation items with view identifiers
const navItems = [
  { icon: HomeIcon, label: "Home", view: "home" },
  { icon: ClassroomIcon, label: "My Classroom", view: "classroom" },
  { icon: AssignmentsIcon, label: "Assignments", view: "assignments" },
  { icon: ExamsIcon, label: "Exams", view: "exams" },
  { icon: LibraryIcon, label: "My Library", view: "library" },
];

interface SidebarProps {
  collapsed?: boolean;
  currentView?: string;
  onViewChange?: (view: string) => void;
  onSettingsClick?: () => void;
}

export default function Sidebar({ collapsed = false, currentView = "exams", onViewChange, onSettingsClick }: SidebarProps) {
  if (collapsed) {
    return (
      <div
        style={{
          width: "56px",
          backgroundColor: "#111827",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px 0",
          gap: "24px",
          flexShrink: 0,
        }}
      >
        <VedaAILogo size={32} />
      </div>
    );
  }

  return (
    <aside
      className="hidden md:flex"
      style={{
        width: "220px",
        backgroundColor: "var(--sidebar-bg)",
        borderRight: "1px solid var(--border-color)",
        flexDirection: "column",
        flexShrink: 0,
        height: "100%",
        transition: "all 0.2s ease",
      }}
    >
      {/* Logo + App name */}
      <div style={{ padding: "20px 16px", borderBottom: "1px solid var(--border-color)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <VedaAILogo size={32} />
          <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}>VedaAI</span>
        </div>
      </div>

      {/* AI Teacher's Toolkit button */}
      <div style={{ padding: "12px 12px 0" }}>
        <button
          style={{
            width: "100%",
            backgroundColor: "var(--text-primary)",
            color: "var(--sidebar-bg)",
            border: "none",
            borderRadius: "8px",
            padding: "9px 12px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "14px" }}>✦</span>
          AI Teacher's Toolkit
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "8px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map(({ icon: Icon, label, view }) => {
          const isActive = currentView === view;
          return (
            <button
              key={label}
              onClick={() => onViewChange?.(view)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: isActive ? "600" : "400",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                backgroundColor: isActive ? "var(--border-color)" : "transparent",
                width: "100%",
                textAlign: "left",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              <Icon />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Settings + User */}
      <div style={{ borderTop: "1px solid var(--border-color)", padding: "8px" }}>
        <button
          onClick={onSettingsClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            color: "var(--text-secondary)",
            backgroundColor: "transparent",
            width: "100%",
            textAlign: "left",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--border-color)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
        >
          <SettingsIcon />
          Settings
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#F59E0B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "600",
              color: "white",
              flexShrink: 0,
            }}
          >
            DPS
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-primary)" }}>Delhi Public School</div>
            <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>Bokaro Steel City</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
