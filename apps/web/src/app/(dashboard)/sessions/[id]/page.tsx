import { PageHeader } from "@/components/page-header";

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  return (
    <PageHeader
      title="Session"
      description={
        <>
          Session ID: <span className="font-mono text-foreground">{id}</span>
        </>
      }
    />
  );
}
