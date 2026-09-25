import {customerProfile} from "@/lib/customer-profile";
import {NextRequest, NextResponse} from "next/server";
import {
  getModelsForBrand,
  getReferenceSelectorEstimate,
  getVehicleSelectorItems,
  getYearsForModel,
  searchVehicleSelectorItems
} from "@/data/catalog";
import {resolveStageQuote} from "@/data/pricing";

export const runtime = "nodejs";

const MAX_SEARCH_RESULTS = 4;
const MAX_ENGINE_RESULTS = 25;
const cacheHeaders = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
};

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get("mode");
  const brand = readParam(params, "brand");
  const model = readParam(params, "model");

  if (mode === "reference") {
    const id = readParam(params, "id");
    const estimate = id ? getReferenceSelectorEstimate(id) : undefined;
    if (!estimate?.profile) return invalidRequest();
    return json({estimate: {...estimate, profile: customerProfile({...estimate.profile, conditionCodes: [...(estimate.profile.conditionCodes ?? []), ...estimate.reasonCodes]})}, quote: resolveStageQuote(estimate.profile, estimate.profile.stages[0], {scope: "vehicle"})});
  }

  if (mode === "search") {
    const query = readParam(params, "q");

    return !query || query.length < 2
      ? invalidRequest()
      : json({vehicles: searchVehicleSelectorItems(query, MAX_SEARCH_RESULTS)});
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
    const year = Number(rawYear);

    if (
      !brand ||
      !model ||
      !rawYear ||
      !Number.isInteger(year) ||
      Number(year) < 1900 ||
      Number(year) > 2100
    ) {
      return invalidRequest();
    }

    return json({
      vehicles: getVehicleSelectorItems(
        {brand, model, year},
        MAX_ENGINE_RESULTS
      )
    });
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
