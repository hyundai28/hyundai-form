import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Sistema de Gestão de Documentos",
};

 const isAdmin = true


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex min-h-screen bg-zinc-50">
            <DashboardSidebar isAdmin={isAdmin} />

            {/* Main Content */}
            <main className="flex-1 lg:ml-64">
              <div className="p-4 lg:p-8">{children}</div>
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
