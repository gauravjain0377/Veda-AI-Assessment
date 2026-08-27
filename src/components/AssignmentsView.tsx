"use client";

import { useState } from "react";

export default function AssignmentsView() {
  const assignments = [
    { id: "asm1", title: "Term 1 Algebra Test", date: "Aug 27, 2026", questions: 5, submissions: 24, average: "82%" },
    { id: "asm2", title: "Mechanics Weekly Quiz", date: "Aug 26, 2026", questions: 10, submissions: 22, average: "68%" },
    { id: "asm3", title: "Organic Chemistry Midterm", date: "Aug 25, 2026", questions: 6, submissions: 18, average: "74%" },
    { id: "asm4", title: "Genetics Unit Exam", date: "Aug 22, 2026", questions: 8, submissions: 25, average: "90%" },
  ];

  const [selectedAsm, setSelectedAsm] = useState<typeof assignments[0] | null>(assignments[0]);

  const questionBreakdown = [
    { num: "Q1", text: "State the Definition of Quadratic Equations.", errorRate: "12%", status: "Good" },
    { num: "Q2", text: "Find the roots of the equation 3x^2 - 5x + 2 = 0.", errorRate: "24%", status: "Good" },
    { num: "Q3", text: "Evaluate discriminant value for complex roots.", errorRate: "68%", status: "Critical" },
    { num: "Q4", text: "Apply quadratic formula to solve real-world distance problem.", errorRate: "42%", status: "Warning" },
    { num: "Q5", text: "Compare and contrast linear vs quadratic relationships.", errorRate: "18%", status: "Good" },
  ];

  return (
    <div style={{ flex: 1, padding: "24px", overflowY: "auto", backgroundColor: "var(--content-bg)", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 4px" }}>
          Assignments Analytics
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
          Manage your tests, track grading completion rates, and view detailed question-by-question metrics.
        </p>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", flex: 1 }}>
        {/* List of assignments */}
        <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "16px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "16px" }}>Exams List</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {assignments.map((asm) => (
                <div
                  key={asm.id}
                  onClick={() => setSelectedAsm(asm)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: `1.5px solid ${selectedAsm?.id === asm.id ? "#E14F26" : "var(--border-color)"}`,
                    cursor: "pointer",
                    backgroundColor: selectedAsm?.id === asm.id ? "var(--brand-orange-bg)" : "var(--card-bg)",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <h4 style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>{asm.title}</h4>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#E14F26" }}>{asm.average}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-tertiary)" }}>
                    <span>{asm.questions} Questions &bull; {asm.submissions} Students</span>
                    <span>{asm.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected assignment analytics */}
        <div style={{ flex: 1.5, minWidth: "320px" }}>
          {selectedAsm ? (
            <div style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 2px" }}>{selectedAsm.title}</h3>
                  <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>Question-by-Question Error Breakdown</span>
                </div>
                <div style={{ padding: "6px 12px", borderRadius: "20px", backgroundColor: "var(--chip-gray-bg)", color: "var(--chip-gray-text)", fontSize: "11px", fontWeight: "700" }}>
                  Avg: {selectedAsm.average}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {questionBreakdown.map((q) => (
                  <div
                    key={q.num}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--content-bg)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: "white", backgroundColor: "#E14F26", padding: "2px 6px", borderRadius: "4px" }}>
                          {q.num}
                        </span>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)" }}>Question Text</span>
                      </div>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor: q.status === "Critical" ? "var(--chip-red-bg)" : q.status === "Warning" ? "var(--chip-amber-bg)" : "var(--chip-green-bg)",
                          color: q.status === "Critical" ? "var(--chip-red-text)" : q.status === "Warning" ? "var(--chip-amber-text)" : "var(--chip-green-text)",
                        }}
                      >
                        Error: {q.errorRate}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.4" }}>{q.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "20px", textAlign: "center", color: "var(--text-tertiary)", fontSize: "12px" }}>
              Select an exam from the list to view its questions analytics breakdown
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
