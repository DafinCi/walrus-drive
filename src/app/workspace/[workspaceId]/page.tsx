import { WorkspaceDashboard } from "@/features/workspace/components/workspace-dashboard";

interface PageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspacePage({ params }: PageProps) {
  // Await params karena di Next.js 15+ params itu Asynchronous
  const { workspaceId } = await params;

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <WorkspaceDashboard workspaceId={workspaceId} />
      </div>
    </main>
  );
}
