import "./globals.css";

export const metadata = {
  title: "AI Workflow Platform",
  description: "Automation Tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}