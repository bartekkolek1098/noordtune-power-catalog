/* eslint-disable @typescript-eslint/no-require-imports */
// Public factual research only. Raw responses are cached outside tracked data.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const cacheRoot = path.resolve(process.env.TUNING_RESEARCH_CACHE || ".git/tuning-dataset-v1/http-cache");
const hash = text => crypto.createHash("sha256").update(text).digest("hex");
const userAgent = "NoordTuneResearch/1.0 (public tuning facts; paced cached requests)";
function read(file) { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : undefined; }
function save(file, value) { fs.writeFileSync(file, JSON.stringify(value)); }
function group(host) { return host.includes("br-performance.") ? "br-performance" : host.endsWith("shiftech.eu") ? "shiftech.eu" : host.endsWith("vtech.pl") ? "vtech.pl" : host.replace(/^www\./, ""); }

function robotsAllowed(robots, url) {
  const groups = [];
  let current = {agents: [], rules: []};
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const match = line.match(/^([\w-]+)\s*:\s*(.*)$/);
    if (!match) continue;
    const [, field, value] = match;
    if (field.toLowerCase() === "user-agent") {
      if (current.rules.length) { groups.push(current); current = {agents: [], rules: []}; }
      current.agents.push(value.toLowerCase());
    } else if (/^(?:allow|disallow)$/i.test(field) && value) current.rules.push({allow: /^allow$/i.test(field), value});
  }
  groups.push(current);
  const specific = groups.filter(item => item.agents.some(agent => agent !== "*" && userAgent.toLowerCase().includes(agent)));
  const applicable = specific.length ? specific : groups.filter(item => item.agents.includes("*"));
  const target = new URL(url).pathname + new URL(url).search;
  const matches = applicable.flatMap(item => item.rules).filter(rule => {
    const pattern = rule.value.split("*").map(part => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*").replace(/\\\$$/, "$");
    return new RegExp(`^${pattern}`).test(target);
  }).sort((a, b) => b.value.length - a.value.length || Number(b.allow) - Number(a.allow));
  return matches[0]?.allow ?? true;
}

async function acquire(lock) {
  const start = Date.now();
  while (true) {
    try { fs.closeSync(fs.openSync(lock, "wx")); return; }
    catch (error) {
      if (error.code !== "EEXIST") throw error;
      try { if (Date.now() - fs.statSync(lock).mtimeMs > 120000) fs.unlinkSync(lock); }
      catch (race) { if (race.code !== "ENOENT") throw race; }
      if (Date.now() - start > 90000) throw new Error("Research host queue timeout; retry later without bypassing pacing");
      await sleep(400);
    }
  }
}

async function fetchPage(url, options = {}) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.username || parsed.password) throw new Error("Only public HTTPS URLs are supported");
  fs.mkdirSync(cacheRoot, {recursive: true});
  // JSON requests are restricted to public search data used by the ordinary UI.
  // Any public search key belongs in transient headers, never tracked manifests.
  const method = options.method ?? "GET";
  if (!["GET", "POST"].includes(method)) throw new Error("Only read-only page/search research is supported");
  if (method === "POST" && options.publicSearch !== true) throw new Error("POST requires an explicitly public read-only search endpoint");
  const body = options.body === undefined ? undefined : JSON.stringify(options.body);
  const cacheFile = path.join(cacheRoot, `${hash(url + (method === "GET" ? "" : `\n${method}\n${body}`))}.json`);
  const fresh = value => value && !options.refresh && (options.maxAgeMs === undefined || Date.now() - Date.parse(value.retrievedAt) <= options.maxAgeMs);
  const cached = read(cacheFile);
  if (cached?.status === "blocked" || fresh(cached)) return {...cached, cached: true, cacheFile};
  const hostGroup = group(parsed.hostname);
  const blockedFile = path.join(cacheRoot, `${hostGroup}.blocked.json`);
  const priorBlock = read(blockedFile);
  if (priorBlock) return {url, status: "blocked", httpStatus: priorBlock.httpStatus, reason: "Provider access block recorded; no further automated requests", retrievedAt: priorBlock.retrievedAt};
  const lock = path.join(cacheRoot, `${hostGroup}.lock`);
  await acquire(lock);
  try {
    const laterCache = read(cacheFile);
    if (laterCache?.status === "blocked" || fresh(laterCache)) return {...laterCache, cached: true, cacheFile};
    if (read(blockedFile)) return {url, status: "blocked", reason: "Provider blocked while request queued", retrievedAt: new Date().toISOString()};
    const lastFile = path.join(cacheRoot, `${hostGroup}.last.json`);
    async function request(target, requestOptions = {}) {
      const last = read(lastFile)?.at ?? 0;
      await sleep(Math.max(0, 2000 - (Date.now() - last)));
      save(lastFile, {at: Date.now()});
      const response = await fetch(target, {...requestOptions, headers: {"User-Agent": userAgent, ...(requestOptions.headers ?? {})}, redirect: "manual", signal: AbortSignal.timeout(25000)});
      const body = await response.text();
      const result = {url: target, status: response.ok ? "retrieved" : "unavailable", httpStatus: response.status, retrievedAt: new Date().toISOString(), contentSha256: hash(body), body, location: response.headers.get("location")};
      if ([401, 403, 429].includes(response.status) || /<title>[^<]*(?:access denied|just a moment|captcha|verify you are human)/i.test(body)) {
        result.status = "blocked";
        save(blockedFile, {url: target, httpStatus: response.status, retrievedAt: result.retrievedAt});
      }
      return result;
    }
    const robotsFile = path.join(cacheRoot, `${parsed.hostname}.robots.json`);
    let robots = read(robotsFile);
    if (!robots || (robots.status !== "blocked" && Date.now() - Date.parse(robots.retrievedAt) > 7 * 86400000)) { robots = await request(`${parsed.origin}/robots.txt`); save(robotsFile, robots); }
    if (robots.status === "blocked" || (robots.httpStatus !== 404 && robots.httpStatus !== 200)) {
      const result = {url, status: "unavailable", reason: "Robots policy unavailable or access restricted", retrievedAt: new Date().toISOString()};
      save(cacheFile, result); return {...result, cacheFile};
    }
    if (robots.httpStatus === 200 && !robotsAllowed(robots.body, url)) {
      const result = {url, status: "blocked", reason: "Disallowed by robots.txt", retrievedAt: new Date().toISOString()};
      save(cacheFile, result); return {...result, cacheFile};
    }
    const result = await request(url, {method, body, headers: {...(body ? {"Content-Type": "application/json"} : {}), ...(options.headers ?? {})}});
    if (cached?.contentSha256 && cached.contentSha256 !== result.contentSha256) {
      // Historical raw evidence stays private, including when a refresh fails.
      const history = path.join(cacheRoot, "history");
      fs.mkdirSync(history, {recursive: true});
      save(path.join(history, `${path.basename(cacheFile, ".json")}-${cached.contentSha256}.json`), cached);
    }
    save(cacheFile, result);
    return {...result, cacheFile};
  } catch (error) {
    const result = {url, status: "unavailable", reason: String(error), retrievedAt: new Date().toISOString()};
    save(cacheFile, result); return {...result, cacheFile};
  } finally { fs.unlinkSync(lock); }
}

module.exports = {fetchPage, robotsAllowed};
if (require.main === module) {
  fetchPage(process.argv[2]).then(({body, ...result}) => console.log(JSON.stringify({...result, bodyBytes: body ? Buffer.byteLength(body) : 0}, null, 2)));
}
