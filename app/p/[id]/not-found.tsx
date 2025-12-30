export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "100px auto",
        padding: "40px",
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "20px",
            color: "#dc3545",
          }}
        >
          Error
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#dc3545",
            marginBottom: "30px",
          }}
        >
          Paste not found or has expired
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "500",
            fontSize: "16px",
          }}
        >
          ← Back to Create
        </a>
      </div>
    </div>
  );
}
