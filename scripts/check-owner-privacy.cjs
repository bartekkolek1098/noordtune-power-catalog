/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {ownerQaInputs}=require('./owner-qa-inputs.cjs');
const owners=ownerQaInputs();
assert.equal(owners.length,4,'Supply four local owner inputs to perform the release privacy gate.');
const patterns=owners.map(({plate})=>new RegExp(plate.split('').join('(?:[-\\s]|%2D|%20)*'),'gi'));
const has=value=>patterns.some(pattern=>{pattern.lastIndex=0;return pattern.test(value)});
const files=[...new Set(cp.execFileSync('git',['ls-files','-z','--cached','--others','--exclude-standard'],{encoding:'utf8'}).split('\0').filter(Boolean))].filter(f=>fs.existsSync(f));
const text=files.filter(f=>{const bytes=fs.readFileSync(f);return !bytes.includes(0)&&has(bytes.toString('utf8'))});
const filenames=files.filter(has);
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const built=walk('.next');const js=built.filter(f=>f.includes(`${path.sep}static${path.sep}`)&&f.endsWith('.js'));
const html=built.filter(f=>f.endsWith('.html'));
assert.ok(js.length&&html.length,'Run a production build first.');
const runtime=walk('src').filter(f=>/\.(ts|tsx)$/.test(f));
const runtimePrivacyViolations=runtime.filter(f=>{
  const s=fs.readFileSync(f,'utf8');
  return /\?kenteken=|searchParams\.get\(["']kenteken["']\)|localStorage|sessionStorage|document\.cookie/.test(s);
});
const report={scope:'Current tracked tree plus new commit candidates; earlier feature commits intentionally excluded. Known local inputs checked in compact, lowercase, hyphenated, spaced and URL-encoded forms.',aliases:owners.map(o=>o.id),filesScanned:files.length,trackedTextMatches:text.length,ownerFilenameMatches:filenames.length,browserJsFiles:js.length,browserJsMatches:js.filter(f=>has(fs.readFileSync(f,'utf8'))).length,staticHtmlFiles:html.length,staticHtmlMatches:html.filter(f=>has(fs.readFileSync(f,'utf8'))).length,runtimeTransportOrStorageViolations:runtimePrivacyViolations.length};
const index=process.argv.indexOf('--output');const output=index<0?'data/research/release-privacy-scan.json':process.argv[index+1];
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
for(const key of ['trackedTextMatches','ownerFilenameMatches','browserJsMatches','staticHtmlMatches','runtimeTransportOrStorageViolations'])assert.equal(report[key],0,key);
console.log(JSON.stringify(report));
