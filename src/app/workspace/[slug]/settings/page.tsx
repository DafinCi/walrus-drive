import { Settings, Save } from "lucide-react";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 border-b border-gray-800 pb-5">
        <Settings className="w-8 h-8 text-gray-400" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Workspace Settings
          </h1>
          <p className="text-xs text-gray-400 font-mono ">
            Konfigurasi • ID: {workspaceId}
          </p>
        </div>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-[6px] space-y-6 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Nama Workspace
          </label>
          <input
            type="text"
            defaultValue="Workspace Utama Hackathon"
            className="w-full bg-gray-950 border border-gray-700 rounded-[6px] px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[6px] transition font-medium text-sm">
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan</span>
        </button>
      </div>
    </div>
  );
}
