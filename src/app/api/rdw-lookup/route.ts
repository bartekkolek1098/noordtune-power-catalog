import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import {
  lookupRdwVehicle,
  normalizeKenteken,
  RdwLookupError
} from "@/lib/rdw";
import {rateLimit} from "@/lib/rate-limit";

const lookupSchema = z.object({
  kenteken: z.string().min(1).max(16)
});

export async function GET(request: NextRequest) {
  return handleLookup(request, request.nextUrl.searchParams.get("kenteken"));
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = lookupSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("INVALID_INPUT", "Kenteken is required.", 400);
  }

  return handleLookup(request, parsed.data.kenteken);
}

async function handleLookup(request: NextRequest, input: string | null) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const limited = rateLimit(ip);

  if (!limited.allowed) {
    return errorResponse(
      "RATE_LIMITED",
      "Too many RDW lookups. Try again later.",
      429,
      {
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(limited.resetAt / 1000))
      }
    );
  }

  if (!input) {
    return errorResponse("INVALID_INPUT", "Kenteken is required.", 400);
  }

  try {
    const result = await lookupRdwVehicle(input);

    if (!result) {
      return errorResponse(
        "NOT_FOUND",
        "No RDW vehicle found for this kenteken.",
        404
      );
    }

    const includeRaw =
      request.nextUrl.searchParams.get("includeRaw") === "1" ||
      request.nextUrl.searchParams.get("includeRaw") === "true";
    const payload: Partial<typeof result> = {...result};

    if (!includeRaw) {
      delete payload.raw;
    }

    return NextResponse.json(
      {
        ...payload,
        normalizedKenteken: normalizeKenteken(input)
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "X-RDW-Cache": result.cached ? "hit" : "miss",
          "X-RateLimit-Remaining": String(limited.remaining),
          "X-RateLimit-Reset": String(Math.ceil(limited.resetAt / 1000))
        }
      }
    );
  } catch (error) {
    if (error instanceof RdwLookupError && error.code === "INVALID_PLATE") {
      return errorResponse("INVALID_PLATE", error.message, 400);
    }

    if (error instanceof RdwLookupError && error.code === "RDW_UNAVAILABLE") {
      return errorResponse("RDW_UNAVAILABLE", error.message, 502);
    }

    return errorResponse("SERVER_ERROR", "Unexpected lookup error.", 500);
  }
}

function errorResponse(
  code: string,
  message: string,
  status: number,
  headers?: HeadersInit
) {
  return NextResponse.json(
    {
      error: {
        code,
        message
      }
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...headers
      }
    }
  );
}
