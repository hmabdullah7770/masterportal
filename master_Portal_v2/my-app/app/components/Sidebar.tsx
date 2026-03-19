// app/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  {
    title: "Frontend",
    icon: "🎨",
    children: [
      { title: "Admin", href: "/frontend/admin" },
      { title: "Dashboard", href: "/frontend/dashboard" },
      { title: "Debugger", href: "/frontend/debugger" },
      { title: "LocalStorage / TanStack", href: "/frontend/localstorage" },
    ],
  },
  {
    title: "Backend",
    icon: "⚙️",
    children: [
      { title: "APIs", href: "/backend/apis" },
      { title: "Auth", href: "/backend/auth" },
      { title: "Logs", href: "/backend/logs" },
    ],
  },
  {
    title: "Database",
    icon: "🗄️",
    children: [
      { title: "Models", href: "/database/models" },
      { title: "Queries", href: "/database/queries" },
      { title: "Migrations", href: "/database/migrations" },
    ],
  },
  {
    title: "AI",
    icon: "🤖",
    children: [
      { title: "Prompts", href: "/ai/prompts" },
      { title: "Models", href: "/ai/models" },
      { title: "Integrations", href: "/ai/integrations" },
    ],
  },
];

export default function Sidebar() {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggle = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  return (
    // ✅ h-screen + overflow-y-auto = sidebar scrolls on its own
    <aside className="w-64 h-screen overflow-y-auto flex-shrink-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
      {/* Logo — stays at top */}
      <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
        <h1 className="text-lg font-bold text-black dark:text-white">My App</h1>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((section) => {
          const isOpen = openSections.includes(section.title);
          return (
            <div key={section.title}>
              <button
                onClick={() => toggle(section.title)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span>{section.icon}</span>
                  <span>{section.title}</span>
                </div>
                <span
                  className={`text-xs text-zinc-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="mt-1 ml-4 pl-3 border-l border-zinc-200 dark:border-zinc-700 space-y-1">
                  {section.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-3 py-2 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-colors"
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
