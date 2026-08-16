import type {
  EngineIdentity,
  EngineVariant,
  EcuSupport,
  ServiceCompatibilityMap,
  ServiceCompatibilityStatus,
  TcuSupport,
  TechnicalEvidence,
  TransmissionSupport
} from "@/data/catalog-shared";

export type CuratedVehicleTechnicalProfile = {
  vehicleId: string;
  sourceCanonicalId: string;
  publicationSource: "existing-curated" | "canonical-publication";
  generation?: string;
  platform?: string;
  imageStatus: "dedicated" | "family-level" | "generic-placeholder";
  engineIdentity: EngineIdentity;
  ecuSupport: EcuSupport;
  transmissionSupport: TransmissionSupport;
  tcuSupport?: TcuSupport;
  technicalEvidence: TechnicalEvidence;
  serviceCompatibility: ServiceCompatibilityMap;
};

const DIAGNOSIS_AND_LEGAL_REVIEW =
  "Diagnosis, vehicle configuration and legal use must be reviewed before this service is confirmed.";
const EXACT_CONTROL_UNIT_REVIEW =
  "Exact control-unit and software compatibility must be confirmed on the vehicle.";
const TRANSMISSION_REVIEW =
  "The exact gearbox and TCU variant must be confirmed before gearbox tuning is offered.";

function compatibility(status: ServiceCompatibilityStatus, note: string) {
  return {status, note};
}

function petrolCompatibility(
  gearboxStatus: ServiceCompatibilityStatus
): ServiceCompatibilityMap {
  return {
    dpf: compatibility(
      "not-applicable",
      "The diesel DPF service is not applicable to this petrol catalog entry."
    ),
    adblue: compatibility(
      "not-applicable",
      "AdBlue service is not applicable to this petrol catalog entry."
    ),
    egr: compatibility("conditional", DIAGNOSIS_AND_LEGAL_REVIEW),
    scr: compatibility(
      "not-applicable",
      "SCR service is not applicable to this petrol catalog entry."
    ),
    immo: compatibility("manual-review", EXACT_CONTROL_UNIT_REVIEW),
    "speed-limiter": compatibility(
      "conditional",
      "Drivetrain suitability and the active limiter strategy must be checked first."
    ),
    launch: compatibility(
      "manual-review",
      "Launch control depends on the exact ECU, transmission and software strategy."
    ),
    pops: compatibility(
      "conditional",
      "Hardware condition, catalyst configuration and intended legal use require review."
    ),
    gearbox: compatibility(
      gearboxStatus,
      gearboxStatus === "not-applicable"
        ? "No TCU tuning is applicable to the listed manual transmission."
        : TRANSMISSION_REVIEW
    )
  };
}

function dieselCompatibility(
  gearboxStatus: ServiceCompatibilityStatus
): ServiceCompatibilityMap {
  return {
    dpf: compatibility("conditional", DIAGNOSIS_AND_LEGAL_REVIEW),
    adblue: compatibility(
      "manual-review",
      "AdBlue equipment is not inferred from diesel fuel; the fitted system must be confirmed."
    ),
    egr: compatibility("conditional", DIAGNOSIS_AND_LEGAL_REVIEW),
    scr: compatibility(
      "manual-review",
      "SCR equipment is not inferred from diesel fuel; the fitted system must be confirmed."
    ),
    immo: compatibility("manual-review", EXACT_CONTROL_UNIT_REVIEW),
    "speed-limiter": compatibility(
      "conditional",
      "Drivetrain suitability and the active limiter strategy must be checked first."
    ),
    launch: compatibility(
      "manual-review",
      "Launch control requires vehicle-specific ECU/TCU confirmation."
    ),
    pops: compatibility(
      "not-applicable",
      "Pops & Bangs is not offered as a supported diesel service."
    ),
    gearbox: compatibility(gearboxStatus, TRANSMISSION_REVIEW)
  };
}

function internalEvidence(
  sourceReference: string,
  generatedEstimate: boolean
): TechnicalEvidence {
  return {
    sourceType: "internal",
    sourceReference,
    notes: [
      generatedEstimate
        ? "The canonical generated record is provenance for the published estimate, not proof of exact engine, ECU or TCU support."
        : "The existing curated record contains broad family labels only; exact variants still require workshop confirmation."
    ]
  };
}

function familyEngine(code: string): EngineIdentity {
  return {
    engineCodes: [code],
    status: "supported-family",
    notes: [
      `${code} is present in the existing curated label; an exact suffix or sub-variant is not claimed.`
    ]
  };
}

function unknownEngine(): EngineIdentity {
  return {
    status: "manual-review",
    notes: ["No exact engine code is supported by the current internal evidence."]
  };
}

function familyEcu(family: string): EcuSupport {
  return {
    family,
    status: "supported-family",
    notes: ["This is a broad ECU-family label, not an exact ECU variant."]
  };
}

function estimatedEcu(family: string): EcuSupport {
  return {
    family,
    status: "estimated",
    notes: [
      "The label comes from a generated family template and requires vehicle-specific confirmation."
    ]
  };
}

function familyTransmission(gearboxFamily: string): TransmissionSupport {
  return {
    gearboxFamily,
    status: "supported-family",
    notes: ["The transmission family is broad; the exact gearbox variant is not claimed."]
  };
}

function estimatedTransmission(gearboxFamily: string): TransmissionSupport {
  return {
    gearboxFamily,
    status: "estimated",
    notes: [
      "The transmission label comes from a generated family template and must be checked on the vehicle."
    ]
  };
}

function manualTransmissionReview(gearboxFamily: string): TransmissionSupport {
  return {
    gearboxFamily,
    status: "manual-review",
    notes: ["The current label is too broad to identify the installed transmission."]
  };
}

function manualTcu(family?: string): TcuSupport {
  return {
    family,
    status: "manual-review",
    notes: ["No exact TCU variant or software support is confirmed by current evidence."]
  };
}

function existingProfile(input: {
  vehicleId: string;
  generation?: string;
  platform?: string;
  engineIdentity: EngineIdentity;
  ecuFamily: string;
  transmissionSupport: TransmissionSupport;
  tcuSupport?: TcuSupport;
  serviceCompatibility: ServiceCompatibilityMap;
}): CuratedVehicleTechnicalProfile {
  const {ecuFamily, ...profile} = input;

  return {
    ...profile,
    sourceCanonicalId: input.vehicleId,
    publicationSource: "existing-curated",
    imageStatus: "generic-placeholder",
    ecuSupport: familyEcu(ecuFamily),
    technicalEvidence: internalEvidence(
      `Existing curated catalog record: ${input.vehicleId}`,
      false
    )
  };
}

function publishedProfile(input: {
  vehicleId: string;
  sourceCanonicalId: string;
  ecuFamily: string;
  gearboxFamily: string;
  fuel: "Petrol" | "Diesel";
}): CuratedVehicleTechnicalProfile {
  return {
    vehicleId: input.vehicleId,
    sourceCanonicalId: input.sourceCanonicalId,
    publicationSource: "canonical-publication",
    imageStatus: "generic-placeholder",
    engineIdentity: unknownEngine(),
    ecuSupport: estimatedEcu(input.ecuFamily),
    transmissionSupport: estimatedTransmission(input.gearboxFamily),
    tcuSupport: manualTcu(input.gearboxFamily),
    technicalEvidence: internalEvidence(
      `Canonical source record: ${input.sourceCanonicalId}`,
      true
    ),
    serviceCompatibility:
      input.fuel === "Diesel"
        ? dieselCompatibility("manual-review")
        : petrolCompatibility("manual-review")
  };
}

export const curatedVehicleTechnicalProfiles: CuratedVehicleTechnicalProfile[] = [
  existingProfile({
    vehicleId: "vw-golf-20-tsi-ea888",
    generation: "Golf 7",
    platform: "MQB",
    engineIdentity: familyEngine("EA888"),
    ecuFamily: "Bosch MED17 / MG1",
    transmissionSupport: familyTransmission("DSG"),
    tcuSupport: manualTcu("DSG"),
    serviceCompatibility: petrolCompatibility("conditional")
  }),
  existingProfile({
    vehicleId: "bmw-320d-b47",
    generation: "F30/F31",
    platform: "BMW 3 Series F30/F31",
    engineIdentity: familyEngine("B47"),
    ecuFamily: "Bosch EDC17 / MD1",
    transmissionSupport: familyTransmission("ZF"),
    tcuSupport: manualTcu("ZF"),
    serviceCompatibility: dieselCompatibility("conditional")
  }),
  existingProfile({
    vehicleId: "audi-a3-20-tdi",
    generation: "8V",
    platform: "MQB",
    engineIdentity: unknownEngine(),
    ecuFamily: "Bosch EDC17",
    transmissionSupport: familyTransmission("DSG"),
    tcuSupport: manualTcu("DSG"),
    serviceCompatibility: dieselCompatibility("conditional")
  }),
  existingProfile({
    vehicleId: "mercedes-a45-amg-m133",
    generation: "W176",
    platform: "MFA",
    engineIdentity: familyEngine("M133"),
    ecuFamily: "Bosch MED17",
    transmissionSupport: manualTransmissionReview("Automatic / TCU"),
    tcuSupport: manualTcu(),
    serviceCompatibility: petrolCompatibility("manual-review")
  }),
  existingProfile({
    vehicleId: "bmw-x3-e83-20d",
    generation: "E83",
    platform: "BMW X3 E83",
    engineIdentity: familyEngine("M47"),
    ecuFamily: "Bosch EDC16",
    transmissionSupport: familyTransmission("ZF"),
    tcuSupport: manualTcu("ZF"),
    serviceCompatibility: dieselCompatibility("conditional")
  }),
  existingProfile({
    vehicleId: "volvo-xc60-d5",
    generation: "XC60 I",
    engineIdentity: unknownEngine(),
    ecuFamily: "Bosch EDC17",
    transmissionSupport: manualTransmissionReview("Automatic / TCU"),
    tcuSupport: manualTcu(),
    serviceCompatibility: dieselCompatibility("manual-review")
  }),
  existingProfile({
    vehicleId: "ford-focus-st-20-ecoboost",
    generation: "Mk3",
    engineIdentity: unknownEngine(),
    ecuFamily: "Bosch MED17",
    transmissionSupport: estimatedTransmission("Manual"),
    serviceCompatibility: petrolCompatibility("not-applicable")
  }),
  publishedProfile({
    vehicleId: "bmw-1-series-f20-f21-118i",
    sourceCanonicalId: "bmw-1-serie-118i-2016",
    ecuFamily: "Bosch MG1 / MEVD",
    gearboxFamily: "ZF",
    fuel: "Petrol"
  }),
  publishedProfile({
    vehicleId: "bmw-1-series-f20-f21-118d",
    sourceCanonicalId: "bmw-1-serie-118d-2015",
    ecuFamily: "Bosch EDC17 / MD1",
    gearboxFamily: "ZF",
    fuel: "Diesel"
  }),
  publishedProfile({
    vehicleId: "bmw-1-series-f20-f21-120d",
    sourceCanonicalId: "bmw-1-serie-120d-2015",
    ecuFamily: "Bosch EDC17 / MD1",
    gearboxFamily: "ZF",
    fuel: "Diesel"
  }),
  publishedProfile({
    vehicleId: "bmw-3-series-f30-f31-318d",
    sourceCanonicalId: "bmw-3-serie-318d-2015",
    ecuFamily: "Bosch EDC17 / MD1",
    gearboxFamily: "ZF",
    fuel: "Diesel"
  }),
  publishedProfile({
    vehicleId: "bmw-3-series-f30-f31-330d",
    sourceCanonicalId: "bmw-3-serie-330d-2015",
    ecuFamily: "Bosch EDC17 / MD1",
    gearboxFamily: "ZF",
    fuel: "Diesel"
  }),
  publishedProfile({
    vehicleId: "bmw-5-series-f10-f11-520d",
    sourceCanonicalId: "bmw-5-serie-520d-2015",
    ecuFamily: "Bosch EDC17 / MD1",
    gearboxFamily: "ZF",
    fuel: "Diesel"
  }),
  publishedProfile({
    vehicleId: "bmw-3-series-g20-g21-320i",
    sourceCanonicalId: "bmw-3-serie-320i-2019",
    ecuFamily: "Bosch MG1 / MEVD",
    gearboxFamily: "ZF",
    fuel: "Petrol"
  }),
  publishedProfile({
    vehicleId: "volkswagen-golf-7-16-tdi",
    sourceCanonicalId: "volkswagen-golf-1-6-tdi-2017",
    ecuFamily: "Bosch EDC17 / MD1",
    gearboxFamily: "DSG",
    fuel: "Diesel"
  }),
  publishedProfile({
    vehicleId: "volkswagen-golf-7-20-tdi",
    sourceCanonicalId: "volkswagen-golf-2-0-tdi-2015",
    ecuFamily: "Bosch EDC17 / MD1",
    gearboxFamily: "DSG",
    fuel: "Diesel"
  }),
  publishedProfile({
    vehicleId: "volkswagen-golf-7-r-20-tsi",
    sourceCanonicalId: "volkswagen-golf-r-2-0-tsi-r-2017",
    ecuFamily: "Bosch MED17 / MG1",
    gearboxFamily: "DSG",
    fuel: "Petrol"
  }),
  publishedProfile({
    vehicleId: "volkswagen-passat-b8-20-tdi",
    sourceCanonicalId: "volkswagen-passat-2-0-tdi-2017",
    ecuFamily: "Bosch EDC17 / MD1",
    gearboxFamily: "DSG",
    fuel: "Diesel"
  }),
  publishedProfile({
    vehicleId: "audi-a3-8v-16-tdi",
    sourceCanonicalId: "audi-a3-1-6-tdi-2017",
    ecuFamily: "Bosch EDC17 / MD1",
    gearboxFamily: "DSG",
    fuel: "Diesel"
  }),
  publishedProfile({
    vehicleId: "audi-a4-b9-20-tdi-190",
    sourceCanonicalId: "audi-a4-2-0-tdi-190-2017",
    ecuFamily: "Bosch EDC17 / MD1",
    gearboxFamily: "DSG",
    fuel: "Diesel"
  }),
  publishedProfile({
    vehicleId: "audi-a4-b9-20-tfsi",
    sourceCanonicalId: "audi-a4-2-0-tfsi-2017",
    ecuFamily: "Bosch MED17 / MG1",
    gearboxFamily: "DSG",
    fuel: "Petrol"
  }),
  publishedProfile({
    vehicleId: "audi-a6-c7-30-tdi-272",
    sourceCanonicalId: "audi-a6-3-0-tdi-272-2016",
    ecuFamily: "Bosch EDC17 / MD1",
    gearboxFamily: "DSG",
    fuel: "Diesel"
  }),
  publishedProfile({
    vehicleId: "skoda-octavia-5e-20-tdi-150",
    sourceCanonicalId: "skoda-octavia-2-0-tdi-150-2017",
    ecuFamily: "Bosch EDC17 / MD1",
    gearboxFamily: "DSG",
    fuel: "Diesel"
  }),
  publishedProfile({
    vehicleId: "seat-leon-cupra-5f-20-tsi-300",
    sourceCanonicalId: "seat-leon-cupra-2-0-tsi-cupra-2017",
    ecuFamily: "Bosch MED17 / MG1",
    gearboxFamily: "DSG",
    fuel: "Petrol"
  })
];

export const curatedVehicleTechnicalProfileById = new Map(
  curatedVehicleTechnicalProfiles.map((profile) => [profile.vehicleId, profile])
);

export function applyCuratedTechnicalProfile(vehicle: EngineVariant): EngineVariant {
  const profile = curatedVehicleTechnicalProfileById.get(vehicle.id);

  if (!profile) {
    return vehicle;
  }

  return {
    ...vehicle,
    generation: profile.generation ?? vehicle.generation,
    platform: profile.platform ?? vehicle.platform,
    sourceCanonicalId: profile.sourceCanonicalId,
    publicationSource: profile.publicationSource,
    imageStatus: profile.imageStatus,
    engineIdentity: profile.engineIdentity,
    ecuSupport: profile.ecuSupport,
    transmissionSupport: profile.transmissionSupport,
    tcuSupport: profile.tcuSupport,
    technicalEvidence: profile.technicalEvidence,
    serviceCompatibility: profile.serviceCompatibility
  };
}
