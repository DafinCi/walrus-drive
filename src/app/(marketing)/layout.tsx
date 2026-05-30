import { LandingNavbar } from "@/components/marketing/landing-navbar";

export default function MarketingRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-foreground font-sans antialiased selection:bg-sky-500/30 selection:text-sky-200">
      {/* Navbar global untuk seluruh ranah marketing */}
      <LandingNavbar />

      {children}

      {/* Footer global untuk seluruh ranah marketing */}
      <footer className="w-full border-t border-zinc-900 py-8 text-center text-[11px] text-zinc-600">
        <p>
          © 2026 TrestoSpace. Built exclusively for Tatum x Walrus Global
          Hackathon.
        </p>
      </footer>
    </div>
  );
}
