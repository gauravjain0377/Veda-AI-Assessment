import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session-store";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const session = getSession(sessionId);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.stage === "error") {
    return NextResponse.json({ error: session.error }, { status: 500 });
  }

  if (session.stage !== "done" || !session.result) {
    return NextResponse.json({ error: "Processing not complete", stage: session.stage }, { status: 202 });
  }

  return NextResponse.json(session.result);
}
