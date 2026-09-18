/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require('node:assert/strict');
const {ownerQaInputs,sanitizeOwnerQa}=require('./owner-qa-inputs.cjs');
assert.deepEqual(ownerQaInputs({}),[]);
assert.throws(()=>ownerQaInputs({NOORDTUNE_OWNER_QA_PLATES:'QA0001'}));
const inputs=ownerQaInputs({NOORDTUNE_OWNER_QA_PLATES:'QA0001,QA0002,QA0003,QA0004'});
assert.deepEqual(inputs.map(p=>p.id),['OWNER-A','OWNER-B','OWNER-C','OWNER-D']);
const cleaned=sanitizeOwnerQa({plate:'QA0001',nested:{kenteken:'QA0002',id:'qa-00-03'},message:'qa0001 QA%2D00%2D04'},inputs);
assert.deepEqual(cleaned,{nested:{id:'OWNER-C'},message:'OWNER-A OWNER-D'});
console.log('Optional owner secret input and nested report/error sanitization PASS.');
