"use client";

import { useState } from "react";

export default function ClassroomView() {
  const students = [
    { name: "Aarav Sharma", roll: "10A01", avg: "88%", level: "Exemplary", weak: "Probability", color: "#10B981" },
    { name: "Ananya Iyer", roll: "10A02", avg: "94%", level: "Exemplary", weak: "None", color: "#10B981" },
    { name: "Gaurav Jain", roll: "10A03", avg: "72%", level: "Proficient", weak: "Quadratic Equations", color: "#F59E0B" },
    { name: "Kabir Mehta", roll: "10A04", avg: "46%", level: "Critical", weak: "Triangles & Geometry", color: "#EF4444" },
    { name: "Meera Nair", roll: "10A05", avg: "81%", level: "Proficient", weak: "Trigonometry", color: "#10B981" },
    { name: "Rohan Varma", roll: "10A06", avg: "59%", level: "Developing", weak: "Arithmetic Progressions", color: "#3B82F6" },
  ];

  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(students[0]);

  return (
    <div style={{ flex: 1, padding: "24px", overflowY: "auto", backgroundColor: "var(--content-bg)", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 4px" }}>
          My Classroom Roster
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
          View student rosters, cumulative average scores, and target topics.
        </p>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", flex: 1 }}>
        {/* Roster list */}
        <div style={{ flex: 1.5, minWidth: "300px", backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "16px", overflowY: "auto" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "16px" }}>Students (Class 10A)</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {students.map((s) => (
              <div
                key={s.roll}
                onClick={() => setSelectedStudent(s)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1.5px solid ${selectedStudent?.roll === s.roll ? "#E14F26" : "var(--border-color)"}`,
                  cursor: "pointer",
                  backgroundColor: selectedStudent?.roll === s.roll ? "var(--brand-orange-bg)" : "var(--card-bg)",
                  transition: "all 0.2s",
                }}
              >
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", margin: "0 0 2px" }}>{s.name}</h4>
                  <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>Roll: {s.roll}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>{s.avg}</div>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: "600",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: s.level === "Exemplary" ? "var(--chip-green-bg)" : s.level === "Critical" ? "var(--chip-red-bg)" : "var(--chip-gray-bg)",
                      color: s.level === "Exemplary" ? "var(--chip-green-text)" : s.level === "Critical" ? "var(--chip-red-text)" : "var(--chip-gray-text)",
                    }}
                  >
                    {s.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Student profile card */}
        <div style={{ flex: 1, minWidth: "260px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {selectedStudent ? (
            <div style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: selectedStudent.color, color: "white", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px" }}>
                  {selectedStudent.name[0]}
                </div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>{selectedStudent.name}</h3>
                  <p style={{ fontSize: "11px", color: "var(--text-secondary)", margin: 0 }}>Student ID: {selectedStudent.roll}</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>Class Average</span>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)" }}>{selectedStudent.avg}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>Performance Level</span>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: selectedStudent.color }}>{selectedStudent.level}</span>
                </div>

                <div>
                  <span style={{ fontSize: "11px", color: "var(--text-tertiary)", display: "block", marginBottom: "6px" }}>TARGET TOPIC / WEAKNESS</span>
                  <div style={{ backgroundColor: "var(--content-bg)", padding: "10px 12px", borderRadius: "6px", fontSize: "12px", color: "var(--text-primary)", display: "flex", gap: "6px", alignItems: "center" }}>
                    <span>📍</span> {selectedStudent.weak}
                  </div>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-tertiary)", display: "block", marginBottom: "6px" }}>AI EVALUATED PAPERS</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", backgroundColor: "var(--content-bg)", padding: "6px 10px", borderRadius: "4px" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Midterm Algebra</span>
                      <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>{selectedStudent.avg}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", backgroundColor: "var(--content-bg)", padding: "6px 10px", borderRadius: "4px" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Linear Equations</span>
                      <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>{Number(selectedStudent.avg.replace("%", "")) - 5}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "20px", textAlign: "center", color: "var(--text-tertiary)", fontSize: "12px" }}>
              Select a student to view detailed dashboard and topic analytics
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
