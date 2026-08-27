import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session-store";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let lastStage = "";
      let attempts = 0;
      const maxAttempts = 300; // 5 minutes at 1s intervals

      const interval = setInterval(() => {
        attempts++;
        if (attempts > maxAttempts) {
          clearInterval(interval);
          const data = JSON.stringify({ stage: "error", error: "Processing timed out" });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          controller.close();
          return;
        }

        const session = getSession(sessionId);
        if (!session) {
          clearInterval(interval);
          const data = JSON.stringify({ stage: "error", error: "Session not found" });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          controller.close();
          return;
        }

        if (session.stage !== lastStage) {
          lastStage = session.stage;
          const data = JSON.stringify({
            stage: session.stage,
            progress: session.progress || 0,
            error: session.error,
          });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }

        if (session.stage === "done" || session.stage === "error") {
          clearInterval(interval);
          controller.close();
        }
      }, 1000);

      // Cleanup on client disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
