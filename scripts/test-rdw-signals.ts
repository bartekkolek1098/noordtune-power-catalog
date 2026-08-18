import assert from "node:assert/strict";
import {
  attachPlateToRdwCore,
  toPlateFreeRdwCore
} from "../src/lib/rdw-cache-core.ts";
import {
  buildPurchaseSignals,
  getApkFacts,
  getDaysBetweenFirstAdmissionAndNlRegistration,
  isLikelyImported
} from "../src/lib/rdw-signals.ts";
import type {PurchaseSignalCode, RdwLookupResult} from "../src/lib/rdw-types.ts";

type SignalInput = Parameters<typeof buildPurchaseSignals>[0];

const now = new Date("2026-01-01T12:00:00Z");

assert.equal(getApkFacts("2026-04-15", now).status, "valid");
assert.equal(getApkFacts("2026-02-15", now).status, "expiring-soon");
assert.equal(getApkFacts("2025-12-31", now).status, "expired");
assert.equal(getApkFacts(undefined, now).status, "unknown");
assert.equal(isLikelyImported("2018-01-01", "2018-01-01"), false);
assert.equal(isLikelyImported("2018-01-01", "2018-01-02"), false);
assert.equal(isLikelyImported("2018-01-01", "2018-01-31"), false);
assert.equal(isLikelyImported("2018-01-01", "2018-02-01"), true);
assert.equal(isLikelyImported("2018-01-01", "2020-06-01"), true);
assert.equal(isLikelyImported(undefined, "2020-06-01"), null);
assert.equal(getDaysBetweenFirstAdmissionAndNlRegistration("2018-01-01", "2018-01-31"), 30);
assert.equal(getDaysBetweenFirstAdmissionAndNlRegistration("2018-01-01", "2018-02-01"), 31);

const base: SignalInput = {
  insurance: {wamInsured: true},
  odometer: {judgement: "Logisch", lastRegistrationYear: 2025},
  ownershipRegistration: {
    currentRegistrationDate: "2025-12-15",
    firstAdmission: "2018-01-01",
    firstRegistrationNl: "2018-01-01",
    transferPossible: true,
    exportIndicator: false,
    waitingForInspection: false,
    taxiIndicator: false,
    likelyImported: false,
    daysBetweenFirstAdmissionAndNlRegistration: 0,
    daysSinceLastRegistration: 17
  },
  recalls: {
    status: "clear",
    openIndicator: false,
    openCount: 0,
    detailsAvailable: true,
    items: []
  },
  roadworthiness: {apkExpiry: "2026-04-15", ...getApkFacts("2026-04-15", now)}
};

const positiveCodes = codes(buildPurchaseSignals(base));
assert(positiveCodes.includes("apk-valid"));
assert(positiveCodes.includes("odometer-logical"));
assert(positiveCodes.includes("recall-clear"));
assert(positiveCodes.includes("transfer-possible"));

const checkRequired = buildPurchaseSignals({
  ...base,
  insurance: {wamInsured: false},
  odometer: {...base.odometer, judgement: "Onlogisch"},
  ownershipRegistration: {
    ...base.ownershipRegistration,
    transferPossible: false,
    exportIndicator: true,
    waitingForInspection: true,
    likelyImported: true
  },
  recalls: {
    status: "open",
    openIndicator: true,
    openCount: 1,
    detailsAvailable: true,
    items: []
  },
  roadworthiness: {apkExpiry: "2025-12-31", ...getApkFacts("2025-12-31", now)}
});
const requiredCodes = codes(checkRequired);
for (const expected of [
  "apk-expired",
  "odometer-illogical",
  "recall-open",
  "transfer-blocked",
  "exported",
  "waiting-for-inspection",
  "wam-uninsured",
  "likely-import"
] satisfies PurchaseSignalCode[]) {
  assert(requiredCodes.includes(expected), `Expected ${expected}`);
}

const partialSourceCodes = codes(buildPurchaseSignals({
  ...base,
  odometer: {...base.odometer, judgement: undefined},
  recalls: {
    status: "unknown",
    openIndicator: null,
    openCount: null,
    detailsAvailable: false,
    items: []
  },
  roadworthiness: {apkExpiry: "2026-02-15", ...getApkFacts("2026-02-15", now)}
}));
assert(partialSourceCodes.includes("apk-expiring"));
assert(partialSourceCodes.includes("odometer-unknown"));
assert(partialSourceCodes.includes("recall-unknown"));
assert(!partialSourceCodes.includes("recall-clear"));

const openWithoutDetails = buildPurchaseSignals({
  ...base,
  recalls: {
    status: "open",
    openIndicator: true,
    openCount: null,
    detailsAvailable: false,
    items: []
  }
});
assert(codes(openWithoutDetails).includes("recall-open"));
assert(!codes(openWithoutDetails).includes("recall-unknown"));

const normalizedPlate = "AB12CD";
const publicResult = {
  source: "RDW Open Data",
  cached: false,
  fetchedAt: "2026-01-01T12:00:00.000Z",
  vehicle: {plate: normalizedPlate, make: "Test", model: "Vehicle", fuels: []}
} as unknown as RdwLookupResult;
const cacheCore = toPlateFreeRdwCore(publicResult);
const serializedCacheValue = JSON.stringify(cacheCore);
assert.equal(serializedCacheValue.includes(normalizedPlate), false);
assert.equal(attachPlateToRdwCore(cacheCore, normalizedPlate, true).vehicle.plate, normalizedPlate);

console.log("RDW purchase signal fixtures passed: valid, expiring, expired, odometer, four recall states, conservative import threshold, WAM, transfer, partial-source and plate-free cache states.");

function codes(signals: ReturnType<typeof buildPurchaseSignals>) {
  return signals.map((signal) => signal.code);
}
