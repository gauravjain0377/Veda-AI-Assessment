"use client";

export default function LibraryView() {
  const categories = [
    { title: "Mathematics", files: 12, bg: "#FEF0EB", border: "#E14F26" },
    { title: "Physics", files: 8, bg: "#EBF5FF", border: "#3B82F6" },
    { title: "Chemistry", files: 6, bg: "#ECFDF5", border: "#10B981" },
    { title: "Biology", files: 5, bg: "#FFFBEB", border: "#F59E0B" },
  ];

  const files = [
    { name: "Algebra_Test_Answer_Key.pdf", category: "Mathematics", size: "2.4MB", date: "Aug 27, 2026" },
    { name: "Mechanics_Quiz_Key.pdf", category: "Physics", size: "1.8MB", date: "Aug 26, 2026" },
    { name: "Organic_Chemistry_Syllabus.pdf", category: "Chemistry", size: "3.1MB", date: "Aug 25, 2026" },
    { name: "Genetics_Key_Class12.pdf", category: "Biology", size: "1.2MB", date: "Aug 22, 2026" },
  ];

  return (
    <div style={{ flex: 1, padding: "24px", overflowY: "auto", backgroundColor: "var(--content-bg)", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 4px" }}>
            My Library
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
            Archive of answer keys, syllabi, and question papers for Delhi Public School.
          </p>
        </div>
        <button
          style={{
            backgroundColor: "#111827",
            color: "white",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            padding: "10px 18px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>📤</span> Upload File
        </button>
      </div>

      {/* Categories Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {categories.map((c) => (
          <div
            key={c.title}
            style={{
              backgroundColor: "var(--card-bg)",
              border: `1.5px solid var(--border-color)`,
              borderRadius: "10px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
            }}
          >
            <div style={{ width: "42px", height: "42px", borderRadius: "8px", backgroundColor: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", border: `1.5px solid ${c.border}` }}>
              📁
            </div>
            <div>
              <h4 style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 2px" }}>{c.title}</h4>
              <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>{c.files} documents</span>
            </div>
          </div>
        ))}
      </div>

      {/* Files List */}
      <div style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "20px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "16px" }}>All Documents</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {files.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                backgroundColor: "var(--content-bg)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px" }}>📄</span>
                <div>
                  <h4 style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-primary)", margin: "0 0 2px" }}>{f.name}</h4>
                  <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>{f.category} &bull; {f.size}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{f.date}</span>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#E14F26", fontSize: "12px", fontWeight: "600" }}>
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
