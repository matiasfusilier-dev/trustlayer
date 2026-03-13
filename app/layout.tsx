import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "TrustLayer",
  description: "Plataforma KYC y análisis crediticio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, backgroundColor: '#0a0a0a' }}>
        <Sidebar />
        <main style={{ marginLeft: '56px', minHeight: '100vh' }}>
          {children}
        </main>
      </body>
    </html>
  );
}