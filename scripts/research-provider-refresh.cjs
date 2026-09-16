/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require('node:fs'),path=require('node:path');
const {fetchPage}=require('./research-fetch.cjs');
function option(name,fallback){const index=process.argv.indexOf(name);return index>=0?process.argv[index+1]:fallback;}
async function run(provider,adapter={}){
  const sources=JSON.parse(fs.readFileSync('data/research/source-pages.json','utf8')).filter(source=>source.provider===provider);
  const limit=Number(option('--limit',sources.length)),maxAgeMs=Number(option('--max-age-days',30))*86400000;
  if(!Number.isInteger(limit)||limit<0||!Number.isFinite(maxAgeMs)||maxAgeMs<0)throw Error('Invalid refresh limit/expiry');
  const rows=[];
  for(const source of sources.slice(0,limit)){
    const response=await fetchPage(source.url,{refresh:process.argv.includes('--refresh'),maxAgeMs});
    let candidate,reason;
    if(response.status==='retrieved'&&adapter.extract){
      const scope=source.identity??source.unresolvedIdentity;
      try {candidate=adapter.extract(response,{...scope,years:scope?.yearFrom?Array.from({length:(scope.yearTo??new Date().getUTCFullYear())-scope.yearFrom+1},(_,i)=>scope.yearFrom+i):[],supportingUrls:source.supportingUrls});}
      catch(error){reason=error.message;}
    }
    const facts=value=>({identity:value?.identity??value?.unresolvedIdentity,stages:value?.stages,packages:value?.packages});
    const usable=Boolean(candidate?.identity||candidate?.packages?.length);
    rows.push({sourceId:source.id,url:source.url,provider,retrievedAt:response.retrievedAt,cached:response.cached??false,status:response.status,
      previousHash:source.contentSha256,candidateHash:response.contentSha256,hashChanged:source.contentSha256!==response.contentSha256,
      factComparison:usable?(JSON.stringify(facts(source))===JSON.stringify(facts(candidate))?'unchanged':'review-required'):'not-comparable',
      reason:reason??(!usable?'Actual factual table not available through this response. Retrieve a permitted rendered public page before reviewing facts.':undefined),
      ...(usable?{previousFacts:facts(source),candidateFacts:facts(candidate)}:{}),automaticPromotion:false});
    if(response.status==='blocked'&&response.reason!=='Disallowed by robots.txt')break;
  }
  const directory=path.resolve('.git/nl-fleet-v2/refresh');fs.mkdirSync(directory,{recursive:true});
  const file=path.join(directory,provider+'.json');
  fs.writeFileSync(file,JSON.stringify({provider,createdAt:new Date().toISOString(),acceptedDatasetModified:false,
    policy:'Candidate hashes/facts only. Review scope, independent source identity, old/new consensus and tests before editing research batches. No build/promotion is executed.',rows},null,2));
  console.log(JSON.stringify({provider,checked:rows.length,hashChanges:rows.filter(row=>row.hashChanged).length,factReview:rows.filter(row=>row.factComparison==='review-required').length,output:file,acceptedDatasetModified:false}));
}
module.exports={run};
