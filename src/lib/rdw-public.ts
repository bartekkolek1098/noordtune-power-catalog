import "server-only";

import {
  getPublicStagePrice,
  getPublicStagePricingTier
} from "@/data/pricing";
import {getPublishedVehicleIdForMatch} from "@/data/catalog";
import type {
  RdwLookupResult,
  RdwTuningLookupResult,
  RdwVehicleCheckResult
} from "@/lib/rdw-types";

export function toTuningLookupResult(
  result: RdwLookupResult
): RdwTuningLookupResult {
  const {vehicle} = result;
  const tuningMatch = result.tuningMatch
    ? {
        ...result.tuningMatch,
        publicVehicleId: getPublishedVehicleIdForMatch(
          result.tuningMatch.variant.id
        ),
        variant: {
          ...result.tuningMatch.variant,
          stages: result.tuningMatch.variant.stages.map((stage) => {
            const {sourcePrice: _sourcePrice, ...publicStage} = stage;
            void _sourcePrice;

            return {
              ...publicStage,
              price: getPublicStagePrice(result.tuningMatch!.variant, stage),
              pricingTier:
                getPublicStagePricingTier(result.tuningMatch!.variant, stage) ??
                stage.pricingTier
            };
          })
        }
      }
    : null;

  return {
    source: result.source,
    cached: result.cached,
    fetchedAt: result.fetchedAt,
    vehicle: {
      plate: vehicle.plate,
      make: vehicle.make,
      model: vehicle.model,
      version: vehicle.version,
      type: vehicle.type,
      variant: vehicle.variant,
      execution: vehicle.execution,
      vehicleType: vehicle.vehicleType,
      body: vehicle.body,
      fuel: vehicle.fuel,
      fuels: vehicle.fuels,
      engine: vehicle.engine
    },
    tuningMatch
  };
}

export function toVehicleCheckResult(
  result: RdwLookupResult
): RdwVehicleCheckResult {
  const {tuningMatch: _tuningMatch, ...vehicleCheck} = result;
  void _tuningMatch;
  return vehicleCheck;
}
