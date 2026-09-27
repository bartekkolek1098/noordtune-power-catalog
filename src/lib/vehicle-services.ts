import type {EngineVariant, ServiceOption} from "../data/catalog-shared.ts";

/** A missing transmission is not evidence that a TCU service is applicable. */
export function isVehicleServiceSelectable(
  vehicle: Pick<EngineVariant, "gearbox" | "options" | "serviceCompatibility">,
  option: Pick<ServiceOption, "id" | "requiresGearbox">
) {
  const compatibility = vehicle.serviceCompatibility?.[option.id]?.status;

  if (!vehicle.options.includes(option.id) || compatibility === "not-applicable") {
    return false;
  }

  if (option.requiresGearbox) {
    return (
      (vehicle.gearbox === "DSG" || vehicle.gearbox === "ZF" || vehicle.gearbox === "TCU") &&
      (compatibility === "supported" || compatibility === "conditional")
    );
  }

  return true;
}
