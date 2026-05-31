import { AccessToken } from "livekit-server-sdk";

const apiKey = process.env.LIVEKIT_API_KEY!;
const apiSecret = process.env.LIVEKIT_API_SECRET!;

export async function createRoomToken(
  roomName: string,
  userId: string,
  userName: string | null
): Promise<string> {
  const at = new AccessToken(apiKey, apiSecret, {
    identity: userId,
    name: userName || "User",
  });

  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  return await at.toJwt();
}

export function generateRoomId(sessionId: string): string {
  return `skillswap-${sessionId}`;
}
