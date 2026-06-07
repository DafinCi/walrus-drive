import Link from "next/link";
import { BookOpen, Code2, Layers, Terminal } from "lucide-react";

export default function DocsNestedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docMenus = [
    { name: "Introduction & Solution", href: "/docs", icon: BookOpen },
    { name: "Getting Started", href: "/docs/quickstart", icon: Terminal },
    { name: "Architecture & Walrus", href: "/docs/architecture", icon: Layers },
    { name: "Tatum API Integration", href: "/docs/tatum", icon: Code2 },
  ];

  return (
    <div className="max-w-6xl mx-auto pt-16 flex flex-col md:flex-row">
      <aside className="w-full md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-zinc-900 p-6 space-y-4 md:sticky md:top-16 md:h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-2">
          Documentation
        </div>
        <nav className="flex flex-col space-y-1">
          {docMenus.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-all"
            >
              <menu.icon className="h-4 w-4 text-zinc-500 shrink-0" />
              <span>{menu.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* KONTEN ARTIKEL DOKUMEN */}
      <main className="flex-1 p-6 md:p-10 max-w-3xl md:min-h-[calc(100vh-4rem)]">
        <article className="prose prose-invert prose-zinc max-w-none prose-sm prose-headings:text-white prose-headings:font-bold prose-p:text-zinc-400 prose-p:leading-relaxed">
          {children}
        </article>
      </main>
    </div>
  );
}
