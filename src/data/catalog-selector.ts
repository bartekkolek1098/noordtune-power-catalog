import type {QuoteResolution} from "./pricing.ts";

export type VehicleSelectorItem = {
  kind?: "reference" | "estimate" | "taxonomy";
  pagePath?: `/vehicles/${string}`;
  id: string;
  brand: string;
  model: string;
  engine: string;
  version: string;
  yearRange: string;
  ecuType: string;
  popular: boolean;
  quote: QuoteResolution;
};
