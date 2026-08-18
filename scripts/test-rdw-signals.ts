import assert from "node:assert/strict";
import {buildPurchaseSignals, getApkFacts, isLikelyImported} from "../src/lib/rdw-signals.ts";
import type {PurchaseSignalCode} from "../src/lib/rdw-types.ts";

type SignalInput = Parameters<typeof buildPurchaseSignals>[0];

const now = new Date("2026-01-01T12:00:00Z");

assert.equal(getApkFacts("2026-04-15", now).status, "valid");
assert.equal(getApkFacts("2026-02-15", now).status, "expiring-soon");
assert.equal(getApkFacts("2025-12-31", now).status, "expired");
assert.equal(getApkFacts(undefined, now).status, "unknown");
assert.equal(isLikelyImported("2018-01-01", "2020-06-01"), true);
assert.equal(isLikelyImported("2018-01-01", "2018-01-01"), false);

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
    daysSinceLastRegistration: 17
  },
  recalls: {openIndicator: false, openCount: 0, items: []},
  roadworthiness: {apkExpiry: "2026-04-15", ...getApkFacts("2026-04-15", now)},
  recallSourceStatus: "available"
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
  recalls: {openIndicator: true, openCount: 1, items: []},
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
  recalls: {openIndicator: null, openCount: null, items: []},
  roadworthiness: {apkExpiry: "2026-02-15", ...getApkFacts("2026-02-15", now)},
  recallSourceStatus: "unavailable"
}));
assert(partialSourceCodes.includes("apk-expiring"));
assert(partialSourceCodes.includes("odometer-unknown"));
assert(partialSourceCodes.includes("recall-unknown"));
assert(!partialSourceCodes.includes("recall-clear"));

console.log("RDW purchase signal fixtures passed: valid, expiring, expired, odometer, recall, import, WAM, transfer and partial-source states.");

function codes(signals: ReturnType<typeof buildPurchaseSignals>) {
  return signals.map((signal) => signal.code);
}
