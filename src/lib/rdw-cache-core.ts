import type {RdwLookupResult} from "@/lib/rdw-types";

export type RdwLookupCore = Omit<RdwLookupResult, "cached" | "vehicle"> & {
  vehicle: Omit<RdwLookupResult["vehicle"], "plate">;
};

export function toPlateFreeRdwCore(result: RdwLookupResult): RdwLookupCore {
  const {cached, vehicle, ...rest} = result;
  const {plate, ...plateFreeVehicle} = vehicle;
  void cached;
  void plate;

  return {
    ...rest,
    vehicle: plateFreeVehicle
  };
}

export function attachPlateToRdwCore(
  core: RdwLookupCore,
  plate: string,
  cached: boolean
): RdwLookupResult {
  return {
    ...core,
    cached,
    vehicle: {
      ...core.vehicle,
      plate
    }
  };
}
