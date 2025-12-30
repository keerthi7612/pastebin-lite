export const metadata = {
  title: "Pastebin Lite",
  description: "A simple pastebin application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#f8f9fa" }}>{children}</body>
    </html>
  );
}
