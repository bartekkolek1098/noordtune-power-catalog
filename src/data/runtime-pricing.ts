/** Client-safe commercial facts attached only to a successfully resolved runtime profile.
 * This marker describes estimate resolution, not verified ECU, hardware or tuning support.
 * It is a DTO contract, not a security token or final quote authorization.
 */
export type RuntimeCommercialIdentity = {
  status: "resolved-compatible" | "resolved-generic";
  make: string;
  model: string;
  fuel: "Petrol" | "Diesel";
  registeredPowerHp: number;
  displacementCc?: number | null;
  firstAdmissionYear?: number;
  cylinders?: number | null;
  workScope?: "ordinary" | "custom";
};

export type RuntimePricingCategory = "classic-standard-diesel" | "contemporary-standard" | "higher-complexity";
export type RuntimePricingClassification = {
  category: RuntimePricingCategory;
  ruleId: string;
  reason: string;
};

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
function makeKey(value: string) {
  const make = normalize(value);
  return ({vw: "volkswagen", mercedes: "mercedes benz"} as Record<string, string>)[make] ?? make;
}

// These are commercial scope lists, not ECU support or lock evidence.
const classicMainstreamFamilies: Record<string, RegExp> = {
  volkswagen: /\b(?:golf|polo|passat|bora|jetta)\b/,
  ford: /\b(?:focus|fiesta|mondeo|fusion)\b/,
  opel: /\b(?:astra|corsa|vectra|zafira|meriva)\b/,
  vauxhall: /\b(?:astra|corsa|vectra|zafira|meriva)\b/,
  renault: /\b(?:clio|megane|scenic|laguna|modus)\b/,
  peugeot: /\b(?:206|207|306|307|308|406|407)\b/,
  citroen: /\b(?:c2|c3|c4|c5|xsara|berlingo)\b/,
  skoda: /\b(?:fabia|octavia|superb|roomster)\b/,
  seat: /\b(?:ibiza|leon|toledo|altea|cordoba)\b/,
  toyota: /\b(?:yaris|corolla|auris|avensis)\b/,
  honda: /\b(?:civic|accord)\b/
};
const performanceFamily = /\b(?:amg|cupra|vrs|gti|gtd|type r|rs\d?|st|gt[234]?|gtr|nismo|m[1-8]|m\d{3}[id]|[1-8]m)\b|\b(?:golf|polo|scirocco)\s+r\b/;
const premiumMakes = new Set(["land rover", "range rover", "jaguar", "porsche", "bentley", "aston martin", "maserati", "ferrari", "lamborghini", "mclaren", "rolls royce"]);
const premiumFamilies: Record<string, RegExp> = {
  bmw: /\b(?:x[3-7]|[5-8]\s*(?:series|serie|er)|[5-8]\d{2}[ide]|z[348])\b/,
  audi: /\b(?:a[6-8]|q[5-8]|s[3-8]|rs[3-8]|r8)\b/,
  "mercedes benz": /\b(?:e|s|cl|cls|gl|gle|gls|g)\s?(?:class|klasse|\d{2,3})\b/,
  volvo: /\b(?:xc90|s90|v90)\b/
};
const commercialFamilies: Record<string, RegExp> = {
  ford: /\btransit\s+custom\b|\btransit\b(?!\s+(?:connect|courier)\b)/,
  "mercedes benz": /\b(?:sprinter|vito|viano)\b/,
  volkswagen: /\b(?:transporter|crafter|multivan)\b/,
  renault: /\b(?:trafic|master)\b/,
  opel: /\b(?:vivaro|movano)\b/,
  peugeot: /\b(?:expert|boxer)\b/,
  citroen: /\b(?:jumpy|jumper|dispatch|relay)\b/,
  toyota: /\bproace\b/,
  fiat: /\b(?:ducato|talento|scudo)\b/,
  iveco: /\bdaily\b/
};

export function classifyRuntimePricing(identity?: RuntimeCommercialIdentity): RuntimePricingClassification | undefined {
  if (!identity || !["resolved-compatible", "resolved-generic"].includes(identity.status)
    || typeof identity.make !== "string" || !identity.make.trim()
    || typeof identity.model !== "string" || !identity.model.trim()
    || !["Petrol", "Diesel"].includes(identity.fuel)
    || !Number.isFinite(identity.registeredPowerHp) || identity.registeredPowerHp <= 0
    || identity.workScope === "custom") return undefined;
  for (const value of [identity.displacementCc, identity.cylinders]) {
    if (value !== undefined && value !== null && (!Number.isFinite(value) || value <= 0)) return undefined;
  }
  if (identity.firstAdmissionYear !== undefined && (!Number.isInteger(identity.firstAdmissionYear)
    || identity.firstAdmissionYear < 1886 || identity.firstAdmissionYear > 9999)) return undefined;

  const make = makeKey(identity.make);
  const model = normalize(identity.model);
  const complexity = identity.registeredPowerHp >= 250 ? "registered-output-at-least-250pk"
    : (identity.displacementCc ?? 0) >= 2900 ? "displacement-at-least-2900cc"
    : (identity.cylinders ?? 0) >= 6 ? "at-least-six-cylinders"
    : performanceFamily.test(model) ? "explicit-performance-family"
    : premiumMakes.has(make) || premiumFamilies[make]?.test(model) ? "listed-premium-complexity-family"
    : commercialFamilies[make]?.test(model) ? "listed-commercial-vehicle-family"
    : undefined;
  if (complexity) return {category: "higher-complexity", ruleId: complexity,
    reason: "Draft higher-complexity software scope from registered output, engine size/cylinders or a listed model family; this does not identify ECU access."};

  const classic = identity.fuel === "Diesel" && identity.firstAdmissionYear !== undefined
    && identity.firstAdmissionYear <= 2010 && identity.registeredPowerHp <= 135
    && identity.displacementCc !== undefined && identity.displacementCc !== null && identity.displacementCc <= 2100
    && identity.cylinders !== undefined && identity.cylinders !== null && identity.cylinders <= 4
    && classicMainstreamFamilies[make]?.test(model);
  if (classic) return {category: "classic-standard-diesel", ruleId: "listed-classic-mainstream-diesel",
    reason: "Listed mainstream car family, diesel, first admission through 2010, at most 135 registered pk, 2100 cc and four cylinders. Age is one commercial factor, never ECU evidence."};

  return {category: "contemporary-standard", ruleId: "ordinary-resolved-ice-default",
    reason: "Resolved ordinary petrol/diesel vehicle without a more specific reviewed assignment, listed complexity rule or complete classic-diesel scope. Source provenance and unknown ECU do not change this category."};
}
