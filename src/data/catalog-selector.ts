import type {QuoteResolution} from "./pricing.ts";

export type VehicleSelectorItem = {
  kind?: "reference";
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
