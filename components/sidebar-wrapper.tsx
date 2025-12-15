// sidebar-wrapper.tsx (Client Component)
"use client";

import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useUser } from "@clerk/nextjs";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/sso-callback");

  const { user } = useUser();
  const role = user?.publicMetadata.role;

  let isAdmin = false;
  if (role === "admin") {
    isAdmin = true;
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {!hideSidebar && <DashboardSidebar isAdmin={isAdmin} />}
      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
