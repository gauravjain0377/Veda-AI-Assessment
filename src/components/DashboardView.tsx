"use client";

interface DashboardViewProps {
  onStartExam: () => void;
}

export default function DashboardView({ onStartExam }: DashboardViewProps) {
  const stats = [
    { label: "TOTAL EXAMS GRADED", value: "48", change: "+12% this week", color: "#E14F26" },
    { label: "AVERAGE CLASS SCORE", value: "76.8%", change: "+2.4% vs last exam", color: "#10B981" },
    { label: "ACTIVE SUBMISSIONS", value: "5", change: "2 pending review", color: "#F59E0B" },
    { label: "ACCURACY RATE", value: "98.2%", change: "Based on AI feedback", color: "#3B82F6" },
  ];

  const recentActivity = [
    { class: "Class 10 - Mathematics", test: "Term 1 Algebra Test", date: "Today, 10:45 AM", score: "82%", status: "Evaluated" },
    { class: "Class 9 - Physics", test: "Mechanics Weekly Quiz", date: "Yesterday, 3:20 PM", score: "68%", status: "Needs Review" },
    { class: "Class 10 - Chemistry", test: "Organic Chemistry Midterm", date: "Aug 25, 2026", score: "74%", status: "Evaluated" },
    { class: "Class 12 - Biology", test: "Genetics Unit Exam", date: "Aug 22, 2026", score: "90%", status: "Evaluated" },
  ];

  return (
    <div style={{ flex: 1, padding: "24px", overflowY: "auto", backgroundColor: "var(--content-bg)" }}>
      {/* Header banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 4px" }}>
            Welcome Back, Delhi Public School
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
            Here is your classroom grading dashboard for Bokaro Steel City.
          </p>
        </div>
        <button
          onClick={onStartExam}
          style={{
            backgroundColor: "#E14F26",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 18px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 6px -1px rgba(225, 79, 38, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>➕</span> Grade New Exam
        </button>
      </div>

      {/* Stats Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              padding: "18px 20px",
            }}
          >
            <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-tertiary)", letterSpacing: "0.05em" }}>
              {s.label}
            </span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: "8px 0 4px" }}>
              {s.value}
            </div>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{s.change}</span>
          </div>
        ))}
      </div>

      {/* Two column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {/* Recent Evaluations */}
        <div style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "20px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 16px" }}>
            Recent Grading Evaluations
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recentActivity.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: i < recentActivity.length - 1 ? "12px" : "0",
                  borderBottom: i < recentActivity.length - 1 ? "1px solid var(--border-color)" : "none",
                }}
              >
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", margin: "0 0 2px" }}>
                    {r.class}
                  </h4>
                  <p style={{ fontSize: "11px", color: "var(--text-tertiary)", margin: "0 0 2px" }}>{r.test}</p>
                  <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>{r.date}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: r.status === "Needs Review" ? "#F59E0B" : "#10B981" }}>
                    {r.score}
                  </div>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: "600",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: r.status === "Needs Review" ? "var(--chip-amber-bg)" : "var(--chip-green-bg)",
                      color: r.status === "Needs Review" ? "var(--chip-amber-text)" : "var(--chip-green-text)",
                    }}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Classroom Insights */}
        <div style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "20px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 16px" }}>
            AI Classroom Insights
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ backgroundColor: "var(--brand-orange-bg)", padding: "12px", borderRadius: "8px", borderLeft: "4px solid #E14F26" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "#E14F26", margin: "0 0 4px" }}>⚠️ Concept Review Required</p>
              <p style={{ fontSize: "11px", color: "var(--text-primary)", margin: 0 }}>
                In <strong>Term 1 Algebra Test</strong>, 65% of students scored below 50% on questions related to <strong>Quadratic Equations</strong>. Consider reviewing this topic.
              </p>
            </div>

            <div style={{ backgroundColor: "var(--chip-green-bg)", padding: "12px", borderRadius: "8px", borderLeft: "4px solid #10B981" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "#10B981", margin: "0 0 4px" }}>🎉 High Performers</p>
              <p style={{ fontSize: "11px", color: "var(--text-primary)", margin: 0 }}>
                Class 12 Biology showed outstanding results on genetics unit. 5 students achieved perfect scores.
              </p>
            </div>

            <div style={{ backgroundColor: "var(--chip-gray-bg)", padding: "12px", borderRadius: "8px" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", margin: "0 0 4px" }}>📅 Next Scheduled Test</p>
              <p style={{ fontSize: "11px", color: "var(--text-primary)", margin: 0 }}>
                Science Quiz 3 is coming up on September 2nd, 2026. Prepare your answer keys in My Library.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
