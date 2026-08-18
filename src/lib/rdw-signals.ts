import type {
  PurchaseSignal,
  RdwLookupResult
} from "@/lib/rdw-types";

type SignalInput = Pick<
  RdwLookupResult,
  "insurance" | "odometer" | "ownershipRegistration" | "recalls" | "roadworthiness"
>;

const DAY_MS = 86_400_000;

export function buildPurchaseSignals(
  input: SignalInput
): PurchaseSignal[] {
  const signals: PurchaseSignal[] = [];
  const {roadworthiness} = input;

  if (roadworthiness.status === "expired") {
    signals.push({
      code: "apk-expired",
      level: "check-required",
      date: roadworthiness.apkExpiry,
      days: roadworthiness.daysUntilExpiry ?? undefined
    });
  } else if (roadworthiness.status === "expiring-soon") {
    signals.push({
      code: "apk-expiring",
      level: "attention",
      date: roadworthiness.apkExpiry,
      days: roadworthiness.daysUntilExpiry ?? undefined
    });
  } else if (roadworthiness.status === "valid") {
    signals.push({
      code: "apk-valid",
      level: "positive",
      date: roadworthiness.apkExpiry,
      days: roadworthiness.daysUntilExpiry ?? undefined
    });
  } else {
    signals.push({code: "apk-unknown", level: "attention"});
  }

  const odometerJudgement = normalizeText(input.odometer.judgement);

  if (isIllogicalOdometer(odometerJudgement)) {
    signals.push({
      code: "odometer-illogical",
      level: "check-required",
      value: input.odometer.judgement
    });
  } else if (odometerJudgement === "logisch") {
    signals.push({
      code: "odometer-logical",
      level: "positive",
      value: input.odometer.judgement
    });
  } else {
    signals.push({
      code: "odometer-unknown",
      level: "attention",
      value: input.odometer.judgement
    });
  }

  if (input.recalls.status === "open") {
    signals.push({
      code: "recall-open",
      level: "check-required",
      value: input.recalls.openCount
    });
  } else if (input.recalls.status === "clear") {
    signals.push({code: "recall-clear", level: "positive", value: 0});
  } else {
    signals.push({code: "recall-unknown", level: "attention"});
  }

  if (input.ownershipRegistration.transferPossible === false) {
    signals.push({code: "transfer-blocked", level: "check-required"});
  } else if (input.ownershipRegistration.transferPossible === true) {
    signals.push({code: "transfer-possible", level: "positive"});
  }

  if (input.ownershipRegistration.exportIndicator === true) {
    signals.push({code: "exported", level: "check-required"});
  }

  if (input.ownershipRegistration.waitingForInspection === true) {
    signals.push({code: "waiting-for-inspection", level: "check-required"});
  }

  if (input.insurance.wamInsured === false) {
    signals.push({code: "wam-uninsured", level: "attention"});
  }

  if (input.ownershipRegistration.likelyImported === true) {
    signals.push({
      code: "likely-import",
      level: "attention",
      date: input.ownershipRegistration.firstRegistrationNl
    });
  }

  const registrationDays = input.ownershipRegistration.daysSinceLastRegistration;

  if (registrationDays !== null && registrationDays >= 0 && registrationDays <= 90) {
    signals.push({
      code: "recent-transfer",
      level: "attention",
      days: registrationDays,
      date: input.ownershipRegistration.currentRegistrationDate
    });
  }

  if (input.ownershipRegistration.taxiIndicator === true) {
    signals.push({code: "taxi-indicator", level: "attention"});
  }

  return signals.sort(
    (left, right) => signalPriority(left.level) - signalPriority(right.level)
  );
}

export function getApkFacts(expiry: string | undefined, now: Date = new Date()) {
  const daysUntilExpiry = daysBetween(now, expiry);

  if (daysUntilExpiry === null) {
    return {
      status: "unknown" as const,
      daysUntilExpiry: null
    };
  }

  if (daysUntilExpiry < 0) {
    return {
      status: "expired" as const,
      daysUntilExpiry
    };
  }

  if (daysUntilExpiry <= 60) {
    return {
      status: "expiring-soon" as const,
      daysUntilExpiry
    };
  }

  return {
    status: "valid" as const,
    daysUntilExpiry
  };
}

export function getDaysSince(date: string | undefined, now: Date = new Date()) {
  const days = daysBetween(date, now);
  return days === null ? null : Math.max(0, days);
}

export function isLikelyImported(
  firstAdmission: string | undefined,
  firstRegistrationNl: string | undefined
) {
  const days = getDaysBetweenFirstAdmissionAndNlRegistration(
    firstAdmission,
    firstRegistrationNl
  );
  return days === null ? null : days > 30;
}

export function getDaysBetweenFirstAdmissionAndNlRegistration(
  firstAdmission: string | undefined,
  firstRegistrationNl: string | undefined
) {
  const days = daysBetween(firstAdmission, firstRegistrationNl);
  return days === null ? null : Math.abs(days);
}

function daysBetween(from: Date | string | undefined, to: Date | string | undefined) {
  if (!from || !to) {
    return null;
  }

  const fromDate = typeof from === "string" ? parseIsoDate(from) : startOfUtcDay(from);
  const toDate = typeof to === "string" ? parseIsoDate(to) : startOfUtcDay(to);

  if (!fromDate || !toDate) {
    return null;
  }

  return Math.floor((toDate.getTime() - fromDate.getTime()) / DAY_MS);
}

function parseIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

  if (!match) {
    return null;
  }

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfUtcDay(value: Date) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function normalizeText(value: string | undefined) {
  return value?.trim().toLocaleLowerCase("nl-NL") ?? "";
}

function isIllogicalOdometer(value: string) {
  return value.includes("onlogisch") || value.includes("niet logisch");
}

function signalPriority(level: PurchaseSignal["level"]) {
  if (level === "check-required") {
    return 0;
  }

  if (level === "attention") {
    return 1;
  }

  return 2;
}
