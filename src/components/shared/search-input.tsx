"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, X } from "lucide-react";

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("search") || "";
  const [value, setValue] = useState(initialQuery);
  const debouncedValue = useDebounce(value, 350);

  useEffect(() => {
    // 🔥 1. Ambil nilai pencarian yang ada di URL saat ini
    const currentSearchInUrl = searchParams.get("search") || "";

    // 🔥 2. GUARD CLAUSE: Jika nilai input sama dengan yang di URL, JANGAN lakukan apa pun!
    // Ini akan memutus lingkaran setan infinite loop secara instan.
    if (debouncedValue === currentSearchInUrl) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedValue) {
      params.set("search", debouncedValue);
    } else {
      params.delete("search");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedValue, pathname, router, searchParams]);

  return (
    <div className="relative w-full max-w-xs md:max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari file, blob ID, atau tx hash..."
        className="w-full h-9 pl-9 pr-8 bg-muted/40 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors"
          title="Bersihkan pencarian"
          aria-label="Bersihkan pencarian"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
