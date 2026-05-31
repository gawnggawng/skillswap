interface SessionRoomProps {
  params: Promise<{ id: string }>;
}

export default async function SessionRoomPage({ params }: SessionRoomProps) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Video Call Room</h1>
        <p className="mt-2 text-neutral-600">
          Session {id} — LiveKit video room will load here.
        </p>
      </div>
    </div>
  );
}
