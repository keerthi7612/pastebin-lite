import { escape } from "html-escaper";
import { notFound } from "next/navigation";

async function getPaste(id: string) {
  try {
    // Get the base URL for server-side fetch
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:3000`;

    console.log(`🔗 Fetching paste from: ${baseUrl}/api/pastes/${id}`);
    const response = await fetch(`${baseUrl}/api/pastes/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`❌ Fetch failed with status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Paste fetched successfully`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching paste:", error);
    return null;
  }
}

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const paste = await getPaste(params.id);

  if (!paste) {
    return notFound();
  }

  const escapedContent = escape(paste.content);
  const formattedContent = escapedContent.replace(/\n/g, "<br>");

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#f5f5f5",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "20px", fontSize: "24px" }}>
          Paste Content
        </h1>

        {paste.remaining_views !== null && (
          <div
            style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "4px",
              padding: "10px",
              marginBottom: "15px",
              color: "#856404",
            }}
          >
            <strong>⚠️ Remaining Views:</strong> {paste.remaining_views}
          </div>
        )}

        <pre
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "15px",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            fontSize: "14px",
            lineHeight: "1.5",
            fontFamily: "Monaco, Consolas, monospace",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
        </pre>
      </div>

      <div style={{ textAlign: "center" }}>
        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "500",
          }}
        >
          ← Create New Paste
        </a>
      </div>
    </div>
  );
}
