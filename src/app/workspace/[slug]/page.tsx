import { WorkspaceDashboard } from "@/features/workspace/components/workspace-dashboard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WorkspacePage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <WorkspaceDashboard slug={slug} />
      </div>
    </main>
  );
}
