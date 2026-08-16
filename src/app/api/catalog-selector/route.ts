import {NextRequest, NextResponse} from "next/server";
import {
  getModelsForBrand,
  getVehicleSelectorItems,
  getYearsForModel,
  searchVehicleSelectorItems
} from "@/data/catalog";

export const runtime = "nodejs";

const cacheHeaders = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
};

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get("mode");
  const brand = readParam(params, "brand");
  const model = readParam(params, "model");

  if (mode === "search") {
    const query = readParam(params, "q");

    return query === null
      ? invalidRequest()
      : json({vehicles: searchVehicleSelectorItems(query, 4)});
  }

  if (mode === "models") {
    return brand ? json({models: getModelsForBrand(brand)}) : invalidRequest();
  }

  if (mode === "years") {
    return brand && model
      ? json({years: getYearsForModel(brand, model)})
      : invalidRequest();
  }

  if (mode === "engines") {
    const rawYear = readParam(params, "year");
    const year = rawYear ? Number(rawYear) : undefined;

    if (
      !brand ||
      !model ||
      (rawYear && (!Number.isInteger(year) || Number(year) < 1900))
    ) {
      return invalidRequest();
    }

    return json({vehicles: getVehicleSelectorItems({brand, model, year})});
  }

  return invalidRequest();
}

function readParam(params: URLSearchParams, key: string) {
  const value = params.get(key);

  if (value === null) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length <= 100 ? trimmed : null;
}

function json(data: object) {
  return NextResponse.json(data, {headers: cacheHeaders});
}

function invalidRequest() {
  return NextResponse.json(
    {error: {code: "INVALID_INPUT", message: "Invalid catalog selector request."}},
    {status: 400, headers: {"Cache-Control": "no-store"}}
  );
}
