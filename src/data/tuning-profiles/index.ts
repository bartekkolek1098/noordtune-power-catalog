// Server only: node:crypto deliberately prevents this dataset entering client bundles.
import {createHash} from "node:crypto";
import records from "./profiles.json" with {type: "json"};
import sourceRecords from "./source-index.json" with {type: "json"};
import type {SourceObservation, SourcedTuningProfile} from "./schema.ts";

export const sourcedTuningProfiles = records as unknown as readonly SourcedTuningProfile[];
export const tuningProfileSources = sourceRecords as unknown as readonly Pick<SourceObservation, "id" | "provider" | "sourceName" | "url" | "retrievedAt" | "status" | "retrievalMethod">[];
export const tuningDatasetFingerprint = createHash("sha256").update(JSON.stringify(records)).digest("hex");
