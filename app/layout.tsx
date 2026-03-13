import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}