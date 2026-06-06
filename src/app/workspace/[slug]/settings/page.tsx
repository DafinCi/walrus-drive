import { Settings, Sparkles, Wrench } from "lucide-react";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] p-8 max-w-3xl mx-auto">
      {/* Visual Centerpiece */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full transition-all duration-700 group-hover:bg-blue-500/30" />
        <div className="relative bg-gray-900/50 border border-gray-800 p-6 rounded-[6px] flex items-center justify-center backdrop-blur-sm">
          <Settings className="w-14 h-14 text-blue-400" />
        </div>
      </div>

      {/* Copywriting */}
      <h1 className="text-3xl font-bold tracking-tight text-white mb-4 flex items-center gap-3">
        Workspace Settings
      </h1>

      <p className="text-gray-400 text-center leading-relaxed mb-8 max-w-lg text-lg">
        We are actively crafting advanced configuration modules, including
        custom role definitions, environment variables, and deeper blockchain
        integrations.
        <br className="mb-4" />
        <span className="text-gray-300 font-medium">
          This module will be unlocked in the upcoming release.
        </span>
      </p>

      {/* Technical Indicator */}
      <div className="flex items-center gap-3 text-sm font-mono text-gray-500 bg-gray-900/40 px-5 py-2.5 border border-gray-800 rounded-[6px] shadow-inner">
        <Wrench className="w-4 h-4 text-gray-400" />
        <span>Target: {slug}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80 animate-pulse" />
        <span>Work in Progress</span>
      </div>
    </div>
  );
}
