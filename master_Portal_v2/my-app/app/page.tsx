// app/page.tsx
import Link from "next/link";

// const sections = [
//   {
//     title: "Frontend",
//     description: "UI components, layouts and styling",
//     href: "/frontend",
//     bg: "bg-blue-50 dark:bg-blue-950",
//     border: "border-blue-200 dark:border-blue-800",
//     icon: "🎨",
//   },
//   {
//     title: "Backend",
//     description: "APIs, server logic and endpoints",
//     href: "/backend",
//     bg: "bg-green-50 dark:bg-green-950",
//     border: "border-green-200 dark:border-green-800",
//     icon: "⚙️",
//   },
//   {
//     title: "Database",
//     description: "Data models, queries and storage",
//     href: "/database",
//     bg: "bg-yellow-50 dark:bg-yellow-950",
//     border: "border-yellow-200 dark:border-yellow-800",
//     icon: "🗄️",
//   },
//   {
//     title: "AI",
//     description: "Models, prompts and integrations",
//     href: "/ai",
//     bg: "bg-purple-50 dark:bg-purple-950",
//     border: "border-purple-200 dark:border-purple-800",
//     icon: "🤖",
//   },
// ];

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-6">
      <main className="w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-center text-black dark:text-white mb-2">
          Welcome to My App
        </h1>
        <p className="text-center text-zinc-500 dark:text-zinc-400 mb-10">
          Select a section to get started
        </p>
      </main>
    </div>
  );
}
