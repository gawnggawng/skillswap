interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  return (
    <div>
      <h1 className="text-3xl font-bold">Session</h1>
      <p className="mt-2 text-neutral-600">Session ID: {id}</p>
    </div>
  );
}
