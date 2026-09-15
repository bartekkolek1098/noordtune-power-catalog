/* eslint-disable @typescript-eslint/no-require-imports */
// Read-only public configurator facts. The ordinary page publishes its public
// search configuration; its key is never written to tracked files or output.
const {fetchPage} = require('./research-fetch.cjs');
async function searchEngines(filter, limit = 100) {
  const page = await fetchPage('https://www.shiftech.eu/en/chiptuning/car/volkswagen/golf/2017-vii-mkii/diesel');
  if (page.status !== 'retrieved') return {response: page, hits: []};
  const match = page.body.match(/window\.unanimConfig\s*=\s*(\{[^<]*?\})\s*<\/script>/s);
  if (!match) throw new Error('Public configurator configuration absent');
  const config = JSON.parse(match[1]);
  const url = `${config.meilisearchHost}/indexes/${config.meilisearchEnv}engines/search`;
  const body = {q: '', filter, limit};
  const response = await fetchPage(url, {method: 'POST', publicSearch: true,
    headers: {Authorization: `Bearer ${config.meilisearchApiKey}`}, body});
  const result = response.status === 'retrieved' ? JSON.parse(response.body) : {};
  return {response, request: {url, method: 'POST', body}, hits: result.hits ?? [], totalHits: result.estimatedTotalHits};
}
module.exports = {searchEngines};
if (require.main === module) searchEngines(process.argv[2], Number(process.argv[3] || 100)).then(({response, ...result}) => console.log(JSON.stringify({...result, response: {...response, body: undefined}}, null, 2)));
