// Client-safe DTO: catalog selection is NOT an RDW-identified customer vehicle.
export type ManualCatalogResult = {
  vehicle: {
    id: string; brand: string; model: string; generation: string; engine: string;
    fuel: string; yearFrom: number; yearTo: number; selectedYear?: number;
    displacementCc?: number; stockPowerHp?: number; stockPowerKw?: number;
  };
  status: "source-comparison" | "needs-review" | "select-year";
  stage1?: {powerHp: [number, number]; torqueNm?: [number, number]; stockTorqueNm?: number};
  sources: {title: string; url: string; powerHp: number; torqueNm?: number}[];
  fuelRon: number[];
  sourceProfileId?: string;
};
