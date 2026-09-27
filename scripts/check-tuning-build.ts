import assert from "node:assert/strict";
import {mkdirSync, readdirSync, readFileSync, writeFileSync} from "node:fs";
import {dirname, join, relative, resolve} from "node:path";
import {engineCatalog, vehicleDatabase} from "../src/data/catalog.ts";
import {sourcedTuningProfiles} from "../src/data/tuning-profiles/index.ts";

function files(directory: string): string[] {
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) =>
    entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]
  );
}

// Only built browser JavaScript is inspected: server modules and HTML/RSC selected
// vehicle DTOs are expected to contain server data or the chosen public profile.
const chunks = files(resolve(".next/static/chunks")).filter((file) => file.endsWith(".js"));
assert.ok(chunks.length > 0, "Run the production build before checking browser chunks");
const publicSourceIds = new Set(engineCatalog.flatMap((vehicle) => [vehicle.id, vehicle.sourceCanonicalId].filter(Boolean)));
const nonPublicSourceIds = new Set(vehicleDatabase.map((vehicle) => vehicle.id).filter((id) => !publicSourceIds.has(id)));
const sourcedIds = new Set(sourcedTuningProfiles.map(profile => profile.id));
const leaks: {file: string; ids: string[]}[] = [];
let bytes = 0;
for (const file of chunks) {
  const source = readFileSync(file, "utf8");
  bytes += Buffer.byteLength(source);
  const ids = [...new Set(source.match(/[a-z0-9]+(?:-[a-z0-9]+){2,}/g) ?? [])].filter((id) => nonPublicSourceIds.has(id) || sourcedIds.has(id));
  if (ids.length) leaks.push({file: relative(process.cwd(), file), ids});
}
const report = {
  checkedAt: new Date().toISOString(), browserJavaScriptChunks: chunks.length, browserJavaScriptBytes: bytes,
  canonicalRecords: vehicleDatabase.length, publicVehicles: engineCatalog.length,
  nonPublicCanonicalIdsChecked: nonPublicSourceIds.size, nonPublicCanonicalIdsInBrowserChunks: leaks,
  sourcedProfileIdsChecked: sourcedIds.size,
  scope: "Production browser JavaScript; selected profile DTOs in HTML/RSC/API are intentionally excluded."
};
const reportIndex = process.argv.indexOf("--report");
const reportPath = resolve(reportIndex >= 0 ? process.argv[reportIndex + 1] : "docs/tuning-qa/corrective/browser-bundle-check.json");
mkdirSync(dirname(reportPath), {recursive: true});
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
assert.deepEqual(leaks, [], "The canonical dataset must not be shipped to browser JavaScript");
console.log(JSON.stringify(report, null, 2));
