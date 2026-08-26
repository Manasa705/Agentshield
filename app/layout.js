import "./globals.css";

export const metadata = {
  title: "AgentShield — AI Agent Security Guard",
  description: "AI agent security guard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0B0E14] text-[#E6EDF3] font-body">
        {children}
      </body>
    </html>
  );
}
