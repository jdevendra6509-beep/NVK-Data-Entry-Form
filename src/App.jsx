import React, { useState, useEffect } from "react";

const COLORS = {
  yellow: "#FFEC00",
  blue: "#1991EB",
  pink: "#F96FB7",
  purple: "#9D4BE6",
  white: "#ffffff",
  border: "#E8EDEE",
  infoBg: "#f4f7fd"
};

const FONT = "'Quicksand', 'Nunito', 'Arial', sans-serif";

const CENTERS_URL = "https://sheetdb.io/api/v1/shq898iize5yy";
const ENTRIES_URL = "https://sheetdb.io/api/v1/a778ghwr05c6o";

function FormField({ label, value, onChange, id }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontWeight: 700,
          color: COLORS.purple,
          marginBottom: 8,
          fontSize: "1.04rem",
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        autoComplete="off"
        style={{
          width: "100%",
          border: `2px solid ${COLORS.border}`,
          borderRadius: 10,
          padding: "12px",
          fontSize: "1.13rem",
          fontFamily: FONT,
          fontWeight: 600,
          backgroundColor: COLORS.white,
        }}
        required
      />
    </div>
  );
}

function Card({ children }) {
  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: "1.3rem",
        boxShadow: "0 3px 26px rgba(100,111,255,0.10)",
        border: `2px solid ${COLORS.border}`,
        marginBottom: "2.2rem",
        padding: "2.2rem 2.1rem",
        minWidth: 330,
      }}
    >
      {children}
    </div>
  );
}

function InfoBox({ center, student, agreementDate, birthDate }) {
  return (
    <div style={{
      background: COLORS.infoBg,
      borderRadius: "1em",
      padding: "16px 18px",
      marginBottom: 22,
      color: COLORS.blue,
      fontWeight: 600,
      fontSize: "1.13rem",
      border: `2px solid ${COLORS.blue}`,
      boxShadow: "0 1px 9px rgba(25,145,235,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    }}>
      <div><strong>Center Name:</strong> {center}</div>
      <div><strong>Student Name:</strong> {student}</div>
      <div><strong>Agreement Date:</strong> {agreementDate}</div>
      <div><strong>Birth Date:</strong> {birthDate}</div>
    </div>
  );
}

function App() {
  const [centers, setCenters] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentData, setStudentData] = useState({});
  const [fields, setFields] = useState({
    field1: "",
    field2: "",
    field3: "",
    field4: "",
    field5: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(CENTERS_URL)
      .then((res) => res.json())
      .then((data) => setCenters([...new Set(data.map((row) => row["Center Name"]))]));
  }, []);

  useEffect(() => {
    if (selectedCenter) {
      fetch(CENTERS_URL)
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter((row) => row["Center Name"] === selectedCenter);
          setStudents(filtered.map((row) => row["Student Name"]));
        });
    } else {
      setStudents([]);
      setSelectedStudent("");
    }
  }, [selectedCenter]);

  useEffect(() => {
    if (selectedStudent && selectedCenter) {
      fetch(CENTERS_URL)
        .then((res) => res.json())
        .then((data) => {
          const studentRow = data.find(
            (row) =>
              row["Center Name"] === selectedCenter &&
              row["Student Name"] === selectedStudent
          );
          setStudentData(studentRow || {});
        });
    } else {
      setStudentData({});
    }
  }, [selectedStudent, selectedCenter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const entry = {
      Timestamp: new Date().toISOString(),
      "Center Name": selectedCenter,
      "Student Name": selectedStudent,
      Field1: fields.field1,
      Field2: fields.field2,
      Field3: fields.field3,
      Field4: fields.field4,
      Field5: fields.field5,
    };
    try {
      const res = await fetch(ENTRIES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [entry] }),
      });
      if (res.ok) {
        setFields({
          field1: "",
          field2: "",
          field3: "",
          field4: "",
          field5: "",
        });
        setSelectedCenter("");
        setSelectedStudent("");
        setStudentData({});
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2200);
      } else {
        alert("Could not submit to SheetDB.");
      }
    } catch {
      alert("Network error—please check your internet/SheetDB setup.");
    }
    setSubmitting(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(120deg, ${COLORS.yellow} 13%, ${COLORS.blue} 87%)`,
        fontFamily: FONT,
        paddingBottom: "2.1rem",
      }}
    >
      {/* Logo and header */}
      <div
        style={{
          background: COLORS.white,
          borderBottom: `5px solid ${COLORS.purple}`,
          padding: "1.6rem 0 1.5rem 0",
          textAlign: "center",
          marginBottom: "2.4rem",
        }}
      >
        <img
          src="/logo.png"
          alt="App Logo"
          style={{
            width: 180,
            height: "auto",
            borderRadius: "13px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
            marginBottom: 14,
            border: `3px solid ${COLORS.blue}`
          }}
        />
        <div
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            color: COLORS.purple,
            letterSpacing: "-1.7px",
          }}
        >
          Deva Data Entry App
        </div>
        <div
          style={{
            fontSize: "1.18rem",
            color: COLORS.blue,
            marginTop: 6,
            fontWeight: 600,
            opacity: 0.93
          }}
        >
          Corporate Student Information Portal
        </div>
      </div>

      <div style={{ maxWidth: 540, margin: "0 auto" }}>
        {submitted && (
          <Card>
            <div
              style={{
                textAlign: "center",
                color: COLORS.blue,
                fontWeight: 700,
                fontSize: "1.23rem",
                letterSpacing: "-0.5px"
              }}
            >
              ✅ Entry Submitted Successfully!
            </div>
          </Card>
        )}

        {/* Center selection */}
        {!selectedCenter && (
          <Card>
            <div
              style={{
                fontWeight: 700,
                color: COLORS.blue,
                fontSize: "1.14rem",
                marginBottom: 22,
              }}
            >
              Step 1: Select Center
            </div>
            <select
              style={{
                padding: "14px",
                fontSize: "1.08rem",
                borderRadius: "10px",
                border: `2px solid ${COLORS.purple}`,
                background: COLORS.white,
                fontFamily: FONT,
                width: "100%",
                marginBottom: 6,
                fontWeight: 600
              }}
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
            >
              <option value="">--Select a center--</option>
              {centers.map((center) => (
                <option key={center} value={center}>
                  {center}
                </option>
              ))}
            </select>
          </Card>
        )}

        {/* Student selection */}
        {selectedCenter && !selectedStudent && (
          <Card>
            <div
              style={{
                fontWeight: 700,
                color: COLORS.purple,
                fontSize: "1.13rem",
                marginBottom: 22,
              }}
            >
              Step 2: Select Student
            </div>
            <select
              style={{
                padding: "14px",
                fontSize: "1.08rem",
                borderRadius: "10px",
                border: `2px solid ${COLORS.purple}`,
                background: COLORS.white,
                fontFamily: FONT,
                width: "100%",
                marginBottom: 13,
                fontWeight: 600
              }}
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">--Select Student--</option>
              {students.map((student) => (
                <option key={student} value={student}>
                  {student}
                </option>
              ))}
            </select>
            <button
              style={{
                background: COLORS.blue,
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "10px 22px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1.09rem",
                marginTop: 4,
              }}
              onClick={() => setSelectedCenter("")}
              type="button"
            >
              ← Back
            </button>
          </Card>
        )}

        {/* Student detail display + data entry form */}
        {selectedStudent && (
          <Card>
            <div
              style={{
                fontWeight: 800,
                color: COLORS.purple,
                fontSize: "1.21rem",
                marginBottom: "1.5rem",
                letterSpacing: "-0.3px"
              }}
            >
              Step 3: Student Details & Entry
            </div>
            <InfoBox
              center={studentData["Center Name"]}
              student={studentData["Student Name"]}
              agreementDate={studentData["Agreement Date"]}
              birthDate={studentData["Birth Date"]}
            />
            <form onSubmit={handleSubmit} autoComplete="off">
              <FormField
                label="Field 1"
                id="field1"
                value={fields.field1}
                onChange={(e) => setFields((s) => ({ ...s, field1: e.target.value }))}
              />
              <FormField
                label="Field 2"
                id="field2"
                value={fields.field2}
                onChange={(e) => setFields((s) => ({ ...s, field2: e.target.value }))}
              />
              <FormField
                label="Field 3"
                id="field3"
                value={fields.field3}
                onChange={(e) => setFields((s) => ({ ...s, field3: e.target.value }))}
              />
              <FormField
                label="Field 4"
                id="field4"
                value={fields.field4}
                onChange={(e) => setFields((s) => ({ ...s, field4: e.target.value }))}
              />
              <FormField
                label="Field 5"
                id="field5"
                value={fields.field5}
                onChange={(e) => setFields((s) => ({ ...s, field5: e.target.value }))}
              />
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: `linear-gradient(135deg, ${COLORS.purple} 0%, ${COLORS.blue} 100%)`,
                  color: "#fff",
                  border: "none",
                  borderRadius: 13,
                  padding: "16px 0",
                  fontWeight: "bold",
                  fontSize: "1.18rem",
                  marginTop: 22,
                  width: "100%",
                  cursor: "pointer",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.09)",
                  transition: "background 0.15s"
                }}
              >
                {submitting ? "Submitting..." : "Submit Entry"}
              </button>
            </form>
            <button
              style={{
                background: COLORS.pink,
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "10px 22px",
                marginTop: 18,
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1.09rem",
              }}
              onClick={() => setSelectedStudent("")}
              type="button"
            >
              ← Back
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;
