"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url?: string; error?: string } | null>(
    null
  );
  const [copyMessage, setCopyMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const body: any = { content };
      if (maxViews && parseInt(maxViews) > 0) {
        body.max_views = parseInt(maxViews);
      }

      const response = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ url: data.url });
        setContent("");
        setMaxViews("");
      } else {
        setResult({ error: data.error || "Failed to create paste" });
      }
    } catch (error) {
      setResult({ error: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.url) {
      navigator.clipboard.writeText(result.url);
      setCopyMessage("URL copied to clipboard!");
      setTimeout(() => setCopyMessage(""), 2000);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h1
        style={{ textAlign: "center", marginBottom: "40px", fontSize: "32px" }}
      >
        Pastebin Lite
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Paste Content *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your text here..."
            required
            style={{
              width: "100%",
              minHeight: "200px",
              padding: "12px",
              fontSize: "14px",
              fontFamily: "Monaco, Consolas, monospace",
              border: "1px solid #ddd",
              borderRadius: "4px",
              resize: "vertical",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Max Views (optional)
          </label>
          <input
            type="number"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            placeholder="Leave empty for unlimited"
            min="1"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "14px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <small style={{ color: "#666", display: "block", marginTop: "4px" }}>
            The paste will be deleted after this many views
          </small>
        </div>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            fontWeight: "500",
            color: "white",
            backgroundColor: loading || !content.trim() ? "#ccc" : "#007bff",
            border: "none",
            borderRadius: "4px",
            cursor: loading || !content.trim() ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: result.error ? "#f8d7da" : "#d4edda",
            border: `1px solid ${result.error ? "#f5c6cb" : "#c3e6cb"}`,
            color: result.error ? "#721c24" : "#155724",
          }}
        >
          {result.error ? (
            <p style={{ margin: 0 }}>❌ {result.error}</p>
          ) : (
            <div>
              <p style={{ margin: "0 0 10px 0", fontWeight: "500" }}>
                ✅ Paste created successfully!
              </p>
              {copyMessage && (
                <div
                  style={{
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    marginBottom: "10px",
                    fontSize: "14px",
                    border: "1px solid #c3e6cb",
                  }}
                >
                  ✓ {copyMessage}
                </div>
              )}
              <div
                style={{
                  backgroundColor: "white",
                  padding: "10px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  value={result.url}
                  readOnly
                  style={{
                    flex: 1,
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
                <button
                  onClick={handleCopy}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                  }}
                >
                  Copy
                </button>
                <button
                  onClick={() => (window.location.href = result.url!)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                  }}
                >
                  View Paste
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
