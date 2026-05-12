"use client";
import React, { useState, useRef } from "react";

const Page = () => {
  const [title,   setTitle]   = useState("");
  const [body,    setBody]    = useState("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const isSending = useRef(false); // ← guard to prevent double call

  async function handleSend() {
    if (isSending.current) return; // ← stop if already sending
    if (!title || !body) {
      setError("Please fill in both title and message.");
      return;
    }

    isSending.current = true; // ← lock
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res  = await fetch("/api/broadcast", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ title, body }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(`✅ Sent to ${data.success} driver(s) successfully!`);
        setTitle("");
        setBody("");
      } else {
        setError(`❌ Failed: ${data.error}`);
      }
    } catch {
      setError("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
      isSending.current = false; // ← unlock after done
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>📣 Broadcast to All Drivers</h1>
        <p style={styles.sub}>
          Send a push notification to every driver instantly
        </p>

        <div style={styles.field}>
          <label style={styles.label}>Notification Title</label>
          <input
            style={styles.input}
            placeholder="e.g. App Update, Important Notice"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Message</label>
          <textarea
            style={styles.textarea}
            placeholder="Type your message to all drivers..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
          />
        </div>

        {error  && <p style={styles.error}>{error}</p>}
        {result && <p style={styles.success}>{result}</p>}

        <button
          style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight:       "100vh",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    backgroundColor: "#f0faf4",
    padding:         "24px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius:    "16px",
    padding:         "40px",
    width:           "100%",
    maxWidth:        "480px",
    boxShadow:       "0 4px 24px rgba(0,0,0,0.08)",
  },
  heading: {
    fontSize:     "24px",
    fontWeight:   "700",
    color:        "#5a4b4b",
    marginBottom: "8px",
  },
  sub: {
    fontSize:     "14px",
    color:        "#888",
    marginBottom: "32px",
  },
  field: {
    marginBottom: "20px",
  },
  label: {
    display:      "block",
    fontSize:     "14px",
    fontWeight:   "600",
    color:        "#333",
    marginBottom: "8px",
  },
  input: {
    width:        "100%",
    padding:      "12px 16px",
    borderRadius: "10px",
    border:       "1.5px solid #B8E0C8",
    fontSize:     "15px",
    outline:      "none",
    boxSizing:    "border-box",
  },
  textarea: {
    width:        "100%",
    padding:      "12px 16px",
    borderRadius: "10px",
    border:       "1.5px solid #B8E0C8",
    fontSize:     "15px",
    outline:      "none",
    resize:       "vertical",
    boxSizing:    "border-box",
  },
  button: {
    width:           "100%",
    padding:         "14px",
    backgroundColor: "#4CAF50",
    color:           "#fff",
    border:          "none",
    borderRadius:    "10px",
    fontSize:        "16px",
    fontWeight:      "700",
    cursor:          "pointer",
    marginTop:       "8px",
  },
  error: {
    color:        "#e53935",
    fontSize:     "13px",
    marginBottom: "12px",
  },
  success: {
    color:        "#2E7D32",
    fontSize:     "13px",
    marginBottom: "12px",
  },
};

export default Page;