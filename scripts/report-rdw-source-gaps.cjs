/* eslint-disable @typescript-eslint/no-require-imports */
/* Reproducible, read-only aggregate coverage audit. No number plates or owners. */
const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");
const {catalogTaxonomyV2} = require("../src/data/catalog-taxonomy-v2.ts");
const {sourcedTuningProfiles} = require("../src/data/tuning-profiles/index.ts");
const {
  matchSourcedProfile, sourceMake, sourceModelFamily
} = require("../src/lib/sourced-tuning-match.ts");
const {nominalDisplacementMatches} = require("../src/data/catalog-matching.ts");
const fleet = require("../data/research/nl-fleet-model-priority.json");

const auditDate = "2026-10-08";
const yearFloor = 1990;
const yearCeiling = 2026;

function digest(relativePath) {
  return crypto.createHash("sha256")
    .update(fs.readFileSync(path.resolve(__dirname, "..", relativePath)))
    .digest("hex");
}
function sourceEnd(profile) {
  return profile.yearTo ?? Number(profile.retrievedAt.slice(0, 4));
}
function matchesFamily(make, model, source) {
  const normalizedMake = sourceMake(make);
  const normalizedModel = sourceModelFamily(normalizedMake, model);
  return [source.modelFamily, ...(source.aliases ?? [])]
    .map(value => sourceModelFamily(normalizedMake, value))
    .some(value => normalizedModel === value || normalizedModel.startsWith(value + " "));
}
function matchesDisplacement(cc, source) {
  if (!Number.isFinite(cc) || cc <= 0 || !source.displacementCc) return false;
  return source.displacementPrecision === "exact"
    ? Math.abs(cc - source.displacementCc) <= 2
    : nominalDisplacementMatches(cc, source.displacementCc);
}
function compactTaxonomyModel(row) {
  const model = row.brand === "BMW" && /^[1-8]$/.test(row.model)
    ? row.model + " series"
    : row.model;
  return model + " " + row.engine;
}
function byValueDescending(a, b, property) {
  return b[property] - a[property] || a.make.localeCompare(b.make);
}

function auditRdwSourceGaps() {
  const sourceByMake = new Map();
  for (const source of sourcedTuningProfiles) {
    const make = sourceMake(source.brand);
    const current = sourceByMake.get(make) ?? [];
    current.push(source);
    sourceByMake.set(make, current);
  }

  const brands = new Map(), sourceIds = new Set();
  const taxonomy = {
    all: catalogTaxonomyV2.length,
    petrolDiesel: 0,
    otherFuel: 0,
    candidateSomeYear: 0,
    candidateEveryCheckedYear: 0,
    noCandidate: 0,
    ambiguousWithoutCandidate: 0,
    testedYearApplications: 0,
    candidateYearApplications: 0,
    distinctCandidateSources: 0,
    // Sequential diagnostics: first failed filter, NOT the sole underlying cause.
    firstMissingFilter: {
      noManufacturerProfile: 0,
      noMatchingFuel: 0,
      noCloseFactoryPower: 0,
      noCloseDisplacement: 0,
      noOverlappingSourceYear: 0,
      noMatchingModelFamily: 0,
      generationBadgeOrAmbiguity: 0,
      invalidYearWindow: 0
    },
    byBrand: []
  };

  for (const row of catalogTaxonomyV2) {
    if (row.fuel !== "Petrol" && row.fuel !== "Diesel") {
      taxonomy.otherFuel++;
      continue;
    }
    taxonomy.petrolDiesel++;
    const start = Math.max(yearFloor, row.yearFrom);
    const end = Math.min(yearCeiling, row.yearTo);
    const b = brands.get(row.brand) ?? {
      make: row.brand, iceConfigurations: 0,
      candidateConfigurations: 0, noCandidateConfigurations: 0, ambiguousConfigurations: 0
    };
    b.iceConfigurations++;
    let matchingYears = 0, ambiguous = false;
    if (end >= start) {
      for (let year = start; year <= end; year++) {
        taxonomy.testedYearApplications++;
        const match = matchSourcedProfile({
          make: row.brand,
          model: compactTaxonomyModel(row),
          fuel: row.fuel,
          displacementCc: row.displacementCc,
          powerHp: row.stockPowerHp,
          firstRegistrationYear: year,
          type: row.generation
        }, sourcedTuningProfiles);
        if (match.profile) {
          matchingYears++;
          taxonomy.candidateYearApplications++;
          sourceIds.add(match.profile.id);
        }
        if (match.reasonCodes?.includes("MULTIPLE_SOURCED_ENGINE_CONFIGURATIONS")) {
          ambiguous = true;
        }
      }
    }
    if (matchingYears) {
      taxonomy.candidateSomeYear++;
      b.candidateConfigurations++;
      if (matchingYears === end - start + 1) taxonomy.candidateEveryCheckedYear++;
    } else {
      taxonomy.noCandidate++;
      b.noCandidateConfigurations++;
      // Track which successive filter first eliminates ALL rows, without
      // accidentally treating weak similarities as accepted tuning output.
      const matchingMake = sourceByMake.get(sourceMake(row.brand)) ?? [];
      const matchingFuel = matchingMake.filter(p => p.fuel === row.fuel);
      const matchingPower = matchingFuel.filter(p =>
        Math.abs(p.stockPowerHp - row.stockPowerHp) <= 3);
      const matchingDisplacement = matchingPower.filter(p =>
        matchesDisplacement(row.displacementCc, p));
      const matchingYear = matchingDisplacement.filter(p =>
        start <= sourceEnd(p) && end >= p.yearFrom);
      const matchingModel = matchingYear.filter(p =>
        matchesFamily(row.brand, compactTaxonomyModel(row), p));
      const failure = end < start ? "invalidYearWindow"
        : !matchingMake.length ? "noManufacturerProfile"
        : !matchingFuel.length ? "noMatchingFuel"
        : !matchingPower.length ? "noCloseFactoryPower"
        : !matchingDisplacement.length ? "noCloseDisplacement"
        : !matchingYear.length ? "noOverlappingSourceYear"
        : !matchingModel.length ? "noMatchingModelFamily"
        : "generationBadgeOrAmbiguity";
      taxonomy.firstMissingFilter[failure]++;
      if (ambiguous) {
        taxonomy.ambiguousWithoutCandidate++;
        b.ambiguousConfigurations++;
      }
    }
    brands.set(row.brand, b);
  }
  taxonomy.distinctCandidateSources = sourceIds.size;
  taxonomy.byBrand = [...brands.values()].sort((a, b) =>
    b.iceConfigurations - a.iceConfigurations || a.make.localeCompare(b.make));

  const fleetStats = {
    selectedGroups: fleet.groups.length,
    registrationsInSelectedGroups: fleet.selection.vehiclesInSelectedGroups,
    reportedRdwPopulation: fleet.population.vehicles,
    groupsWithPossibleModelSource: 0,
    registrationsInGroupsWithPossibleModelSource: 0,
    groupsWithoutPossibleModelSource: 0,
    registrationsInGroupsWithoutPossibleModelSource: 0,
    byMake: [],
    largestGroupsWithoutFamilySource: []
  };
  const fleetBrands = new Map(), missing = [];
  for (const group of fleet.groups) {
    const sources = sourceByMake.get(sourceMake(group.make)) ?? [];
    // This is intentionally *less strict* than a tuning match. The RDW
    // grouping has no joined factory horsepower, fuel, ECU or gearbox.
    const potential = sources.some(source =>
      matchesFamily(group.make, group.model, source) &&
      matchesDisplacement(group.displacementCc, source) &&
      (group.yearBandFrom ?? 0) <= sourceEnd(source) &&
      (group.yearBandTo ?? 9999) >= source.yearFrom);
    const brand = fleetBrands.get(group.make) ?? {
      make: group.make, groups: 0, registrations: 0,
      potentialFamilySourceGroups: 0, registrationsInPotentialGroups: 0
    };
    brand.groups++;
    brand.registrations += group.vehicles;
    if (potential) {
      fleetStats.groupsWithPossibleModelSource++;
      fleetStats.registrationsInGroupsWithPossibleModelSource += group.vehicles;
      brand.potentialFamilySourceGroups++;
      brand.registrationsInPotentialGroups += group.vehicles;
    } else {
      fleetStats.groupsWithoutPossibleModelSource++;
      fleetStats.registrationsInGroupsWithoutPossibleModelSource += group.vehicles;
      missing.push({
        make: group.make, model: group.model,
        displacementCc: group.displacementCc,
        admissionYearBand: [group.yearBandFrom, group.yearBandTo],
        registrations: group.vehicles
      });
    }
    fleetBrands.set(group.make, brand);
  }
  fleetStats.byMake = [...fleetBrands.values()].sort((a, b) =>
    byValueDescending(a, b, "registrations")).slice(0, 25);
  fleetStats.largestGroupsWithoutFamilySource = missing
    .sort((a, b) => b.registrations - a.registrations || a.make.localeCompare(b.make))
    .slice(0, 25);

  return {
    reportVersion: "rdw-source-audit-v1",
    auditDate,
    inputs: {
      taxonomySha256: digest("src/data/catalog-taxonomy-v2.json"),
      sourceProfilesSha256: digest("src/data/tuning-profiles/profiles.json"),
      rdwFleetGroupsSha256: digest("data/research/nl-fleet-model-priority.json")
    },
    publicStage3Allowed: false,
    sourceProfiles: sourcedTuningProfiles.length,
    taxonomy,
    rdwFleetPossibleFamilySource: fleetStats,
    limitations: [
      "Rows in the 4,592-option selector are supplier taxonomy observations, not unique RDW registrations, VINs or approved tuning outputs.",
      "A taxonomy source candidate matches tested make/model/fuel/nominal displacement/stock hp/generation/year; original torque, actual engine code, ECU and hardware still need verification.",
      "The 5,000 selected RDW aggregate groups omit a joined fuel and factory-power breakdown. The group-level source presence test only checks make/model family/displacement/year and is deliberately a loose POSSIBLE source indicator, never numeric tuning availability.",
      "Aggregated group sizes include naturally aspirated, hybrid, electric and possibly untunable variants. Do not use cohort counts as eligible tuning customers or a full-fleet Stage 1 percentage.",
      "First admission year is not necessarily the factory model year or engine generation. Unknown/mixed fuel and short historical publication dates require manual source review.",
      "The selected 5,000 RDW groups do not include every RDW registration; no individual registration number, VIN or owner record was read or retained."
    ]
  };
}

if (require.main === module) {
  const report = auditRdwSourceGaps();
  if (process.argv.includes("--summary")) {
    console.log(JSON.stringify({
      sourceProfiles: report.sourceProfiles,
      taxonomy: {
        all: report.taxonomy.all,
        petrolDiesel: report.taxonomy.petrolDiesel,
        otherFuel: report.taxonomy.otherFuel,
        candidateSomeYear: report.taxonomy.candidateSomeYear,
        candidateEveryCheckedYear: report.taxonomy.candidateEveryCheckedYear,
        noCandidate: report.taxonomy.noCandidate,
        firstMissingFilter: report.taxonomy.firstMissingFilter,
        ambiguousWithoutCandidate: report.taxonomy.ambiguousWithoutCandidate,
        testedYearApplications: report.taxonomy.testedYearApplications,
        candidateYearApplications: report.taxonomy.candidateYearApplications
      },
      fleet: {
        selectedGroups: report.rdwFleetPossibleFamilySource.selectedGroups,
        registrationsInSelectedGroups: report.rdwFleetPossibleFamilySource.registrationsInSelectedGroups,
        groupsWithPossibleModelSource: report.rdwFleetPossibleFamilySource.groupsWithPossibleModelSource,
        registrationsInGroupsWithPossibleModelSource: report.rdwFleetPossibleFamilySource.registrationsInGroupsWithPossibleModelSource,
        groupsWithoutPossibleModelSource: report.rdwFleetPossibleFamilySource.groupsWithoutPossibleModelSource,
        registrationsInGroupsWithoutPossibleModelSource: report.rdwFleetPossibleFamilySource.registrationsInGroupsWithoutPossibleModelSource
      }
    }, null, 2));
  } else {
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  }
}
module.exports = {auditRdwSourceGaps};