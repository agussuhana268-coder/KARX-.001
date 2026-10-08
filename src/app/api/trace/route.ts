import { NextResponse } from "next/server";
import { validateIP } from "@/lib/ip-validation";
import { fetchIpIntelligence } from "@/lib/server/ip-intelligence-service";
import type { TraceApiResponse } from "@/types/ip-intelligence";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawIp = searchParams.get("ip");

  if (!rawIp) {
    const errorResponse: TraceApiResponse = {
      success: false,
      error: "Missing required parameter 'ip'.",
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  // Server-side IP validation
  const validation = validateIP(rawIp);
  if (!validation.isValid) {
    const errorResponse: TraceApiResponse = {
      success: false,
      error: validation.error || "Invalid target IP address.",
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  try {
    const intelligence = await fetchIpIntelligence(validation.cleaned);
    const successResponse: TraceApiResponse = {
      success: true,
      data: intelligence,
    };
    return NextResponse.json(successResponse, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal reconnaissance error.";
    const errorResponse: TraceApiResponse = {
      success: false,
      error: errorMessage,
    };
    return NextResponse.json(errorResponse, { status: 502 });
  }
}
