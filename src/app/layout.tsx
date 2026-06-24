import type { Metadata } from "next";
import { CmsProvider } from "@/components/CmsProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuropGen",
  description: "Plataforma de psicoeducación genética y neuropsicológica para familias, pacientes y profesionales."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <CmsProvider>{children}</CmsProvider>
      </body>
    </html>
  );
}
