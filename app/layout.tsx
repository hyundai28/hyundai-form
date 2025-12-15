// RootLayout.tsx (Server)
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import { SidebarWrapper } from "@/components/sidebar-wrapper";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Sistema de Gestão de Documentos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased bg-zinc-200">
          <SidebarWrapper>{children}</SidebarWrapper>
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
