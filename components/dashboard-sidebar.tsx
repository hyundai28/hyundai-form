"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

interface DashboardSidebarProps {
  isAdmin: boolean;
}

export function DashboardSidebar({ isAdmin }: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Formulário NF",
      href: "/dashboard/form-nf",
      icon: FileText,
      visible: true,
    },
    {
      label: "Relatório",
      href: "/dashboard/relatorio",
      icon: BarChart3,
      visible: isAdmin,
    },
  ];

  const visibleItems = menuItems.filter((item) => item.visible);

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white shadow-lg transform transition-transform duration-300 z-40",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white">
              D
            </div>
            <Link href="/">
              <span className="font-bold text-lg">Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 flex flex-col gap-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-500 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 flex flex-row items-center justify-between">
            <UserButton />
            <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded">
              {isAdmin ? "Admin" : "User"}
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Spacer */}
      <div className="h-16 lg:hidden" />
    </>
  );
}
