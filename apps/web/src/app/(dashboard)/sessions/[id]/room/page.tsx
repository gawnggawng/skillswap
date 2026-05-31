import { Video } from "lucide-react";

interface SessionRoomProps {
  params: Promise<{ id: string }>;
}

export default async function SessionRoomPage({ params }: SessionRoomProps) {
  const { id } = await params;
  return (
    <div className="-m-8 flex min-h-screen items-center justify-center bg-foreground/95 px-4 text-background lg:-m-10">
      <div className="text-center">
        <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-online/15 text-online animate-pulse-ring">
          <Video className="size-6" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">Video call room</h1>
        <p className="mt-2 text-background/70">
          Session{" "}
          <span className="font-mono text-background">{id}</span> — LiveKit
          video room will load here.
        </p>
      </div>
    </div>
  );
}
