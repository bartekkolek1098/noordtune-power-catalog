import type {PricingTierId} from "@/data/pricing";

export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric";
export type ConfidenceLevel = "verified" | "estimated" | "manual-review";
export type RecommendedUse = "daily" | "performance" | "custom";
export type StageName = "Stage 1" | "Stage 2" | "Stage 3+";

export type RecommendedPackageDefinition = {
  stage: StageName;
  recommendedOptionIds?: string[];
  verificationRequired?: boolean;
  notes?: string[];
};

export type StageDefinition = {
  name: StageName;
  powerHp: number;
  torqueNm: number;
  price: number;
  requirements: string;
  packageItems: string[];
  pricingTier?: PricingTierId;
  confidenceLevel?: ConfidenceLevel;
  recommendedUse?: RecommendedUse;
  hardwareRequired?: boolean;
  tcuRecommended?: boolean;
  logCheckRecommended?: boolean;
  notes?: string[];
};

export type ServiceOption = {
  id: string;
  name: string;
  price: number;
  fuels?: FuelType[];
  requiresGearbox?: boolean;
  category: "software" | "emissions" | "gearbox" | "performance" | "security";
  description: string;
  pricingTier?: PricingTierId;
  legalReviewRequired?: boolean;
  diagnosisRequired?: boolean;
  recommendedByDefault?: boolean;
  compatibilityNotes?: string[];
};

export type EngineVariant = {
  id: string;
  brand: string;
  model: string;
  engine: string;
  version: string;
  fuel: FuelType;
  yearRange: string;
  years: number[];
  stockPowerHp: number;
  stockTorqueNm: number;
  ecuType: string;
  gearbox?: "DSG" | "ZF" | "TCU" | "Manual";
  generation?: string;
  platform?: string;
  engineCode?: string;
  tcuType?: string;
  drivetrain?: string;
  emissionsStandard?: string;
  confidenceLevel?: ConfidenceLevel;
  verificationRequired?: boolean;
  dataNotes?: string[];
  technicalNotes?: string[];
  recommendedPackage?: RecommendedPackageDefinition;
  stages: StageDefinition[];
  options: string[];
  image: string;
  popular?: boolean;
  tags: string[];
};

// Shared client-safe service definitions. The canonical vehicle database stays in catalog.ts.
export const serviceOptions: ServiceOption[] = [
  {
    id: "dpf",
    name: "DPF delete",
    price: 185,
    fuels: ["Diesel"],
    category: "emissions",
    legalReviewRequired: true,
    diagnosisRequired: true,
    recommendedByDefault: false,
    description: "DPF off / delete software for off-road or export use where legally permitted."
  },
  {
    id: "adblue",
    name: "AdBlue off",
    price: 199,
    fuels: ["Diesel"],
    category: "emissions",
    legalReviewRequired: true,
    diagnosisRequired: true,
    recommendedByDefault: false,
    description: "AdBlue / SCR off diagnostics and software solution where legally permitted."
  },
  {
    id: "egr",
    name: "EGR off",
    price: 149,
    fuels: ["Diesel", "Petrol"],
    category: "emissions",
    legalReviewRequired: true,
    diagnosisRequired: true,
    recommendedByDefault: false,
    description: "EGR off calibration for vehicles with EGR-related faults or race/export use."
  },
  {
    id: "scr",
    name: "SCR delete",
    price: 219,
    fuels: ["Diesel"],
    category: "emissions",
    legalReviewRequired: true,
    diagnosisRequired: true,
    recommendedByDefault: false,
    description: "SCR system software solution where legally permitted."
  },
  {
    id: "immo",
    name: "Immo off",
    price: 169,
    category: "security",
    diagnosisRequired: true,
    recommendedByDefault: false,
    description: "Immobilizer software service for ECU replacement and diagnostic repair scenarios."
  },
  {
    id: "speed-limiter",
    name: "Speed limiter removal",
    price: 119,
    category: "performance",
    diagnosisRequired: true,
    recommendedByDefault: false,
    description: "Vmax / speed limiter adjustment after drivetrain suitability check."
  },
  {
    id: "launch",
    name: "Launch control",
    price: 165,
    fuels: ["Petrol", "Hybrid"],
    category: "performance",
    diagnosisRequired: true,
    recommendedByDefault: false,
    description: "Launch control strategy for supported ECU/TCU combinations."
  },
  {
    id: "pops",
    name: "Pops & Bangs / Crackle",
    price: 149,
    fuels: ["Petrol"],
    category: "performance",
    diagnosisRequired: true,
    recommendedByDefault: false,
    description: "Crackle calibration for petrol engines, set conservatively for hardware safety."
  },
  {
    id: "gearbox",
    name: "DSG / TCU tuning",
    price: 239,
    requiresGearbox: true,
    category: "gearbox",
    pricingTier: "tcu-standard",
    diagnosisRequired: true,
    recommendedByDefault: false,
    description: "DSG, ZF or TCU shift strategy, torque limits and launch behavior where supported."
  }
];

export const allServiceOptionIds = serviceOptions.map((option) => option.id);
