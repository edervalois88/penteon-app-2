import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

// Estoy cargando las fuentes de Geist para controlar las variables CSS que uso en toda la interfaz.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Repito la configuracion para la variante monoespaciada porque la quiero disponible en componentes puntuales.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Defino los metadatos globales que se usan tanto en SEO como en la pestana del navegador.
export const metadata: Metadata = {
  title: "React Coding Challenge",
  description: "Cat facts paired with random people, built with React Query.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Mantengo el lang en ingles porque los componentes de metadata se generaron asi, pero hidrato el texto en espanol en la pagina.
    <html lang="en">
      {/* Dejo las variables de fuente en el body para que toda la app herede la tipografia que configure. */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Centralizo los providers aqui para que cualquier pagina tenga acceso al contexto de React Query. */}
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
