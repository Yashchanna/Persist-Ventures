import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

function Login() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!name) return alert("Enter name");
    if (role === "student") navigate("/learn");
    else navigate("/guardian");
  };

  return (
    <div className="app">
      <h1>🎓 AI School Login</h1>

      <div className="card">
        <input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />

        <select onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="guardian">Guardian</option>
        </select>

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

/* ================= STUDENT LEARNING PAGE ================= */

function LearningApp() {
  const [age, setAge] = useState("");
  const [language, setLanguage] = useState("");
  const [subject, setSubject] = useState("");

  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);

  const [question, setQuestion] = useState("");
  const [tutorReply, setTutorReply] = useState("");

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        alert("⚠️ Stay focused! Lesson reset.");
        setLesson(null);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const generateCourse = async () => {
    const res = await fetch("http://localhost:5000/generate-course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age, language, subject }),
    });
    const data = await res.json();
    setCourse(data);
    setLesson(null);
  };

  const getNextLesson = async (performance) => {
    const res = await fetch("http://localhost:5000/get-lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ performance }),
    });
    const data = await res.json();
    setLesson(data);
    if (performance === "good") setXp((p) => p + 20);
    else setXp((p) => p + 5);
  };

  useEffect(() => {
    setLevel(1 + Math.floor(xp / 100));
  }, [xp]);

  const askTutor = async () => {
    if (!question.trim()) return;
    const res = await fetch("http://localhost:5000/ai-tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setTutorReply(data.reply);
  };

  return (
    <div className="app">
      <h1>📘 Student Learning</h1>

      <div className="progress-box">
        <p>Level {level}</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${xp % 100}%` }}></div>
        </div>
        <p>{xp} XP</p>
      </div>

      <div className="card">
        <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        <input placeholder="Language" value={language} onChange={(e) => setLanguage(e.target.value)} />
        <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <button onClick={generateCourse}>Generate Course</button>
      </div>

      {course && (
        <div className="card">
          <h2>{course.title}</h2>
          {course.modules.map((m, i) => (
            <div key={i}>
              <b>{m.name}</b>
              <ul>
                {m.lessons.map((l, j) => <li key={j}>{l}</li>)}
              </ul>
            </div>
          ))}
          <div className="btn-row">
            <button onClick={() => getNextLesson("good")}>😊 I did well</button>
            <button onClick={() => getNextLesson("bad")}>😓 I struggled</button>
          </div>
        </div>
      )}

      {lesson && (
        <div className="card">
          {lesson.lessonType === "quiz" ? (
            <>
              <p>{lesson.content.question}</p>
              {lesson.content.options.map((o, i) => <div key={i}>• {o}</div>)}
            </>
          ) : (
            <>
              <p>{lesson.content.title}</p>
              <iframe width="300" height="200" src={lesson.content.video} />
            </>
          )}
        </div>
      )}

      <div className="card tutor-card">
        <h3>🤖 Ask AI Tutor</h3>
        <textarea className="tutor-textarea" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <button className="tutor-btn" onClick={askTutor}>Ask Tutor</button>
        {tutorReply && <div className="tutor-reply"><b>Tutor:</b> {tutorReply}</div>}
      </div>
    </div>
  );
}

/* ================= GUARDIAN DASHBOARD ================= */

function GuardianDashboard() {
  return (
    <div className="app">
      <h1>👨‍👩‍👧 Guardian Dashboard</h1>
      <div className="card">
        <p>✔ Lessons Completed: 4</p>
        <p>✔ XP Earned: 85</p>
        <p>✔ Learning Style: Visual + Practice</p>
        <p>✔ Today's Focus Time: 32 mins</p>
        <p>(Demo Data)</p>
      </div>
    </div>
  );
}

/* ================= ROUTES ================= */

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/learn" element={<LearningApp />} />
      <Route path="/guardian" element={<GuardianDashboard />} />
    </Routes>
  );
}

export default App;
