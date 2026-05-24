import { Loader2 } from "lucide-react";

export default function WorkspaceLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      <p className="text-gray-400 font-medium animate-pulse">
        Memuat data workspace...
      </p>
    </div>
  );
}
