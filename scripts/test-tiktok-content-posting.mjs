import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const required = [
  'frontend/tiktok-publish/index.html', 'frontend/bin/register-tiktok-publish.mjs',
  'api/tiktok/auth.js', 'api/tiktok/callback.js', 'api/tiktok/publish.js',
  'api/tiktok/status.js', 'lib/tiktok-web.js',
];
for (const path of required) assert.ok(existsSync(path), `Missing ${path}`);
const page = readFileSync('frontend/tiktok-publish/index.html', 'utf8');
const shared = readFileSync('lib/tiktok-web.js', 'utf8');
const auth = readFileSync('api/tiktok/auth.js', 'utf8');
const publish = readFileSync('api/tiktok/publish.js', 'utf8');
const build = readFileSync('frontend/bin/build.mjs', 'utf8');
for (const marker of ['TIKTOK_CLIENT_KEY','TIKTOK_CLIENT_SECRET','TIKTOK_REDIRECT_URI','aes-256-gcm','https://www.tiktok.com/v2/auth/authorize/','https://open.tiktokapis.com/v2/oauth/token/','/v2/user/info/','creator_info/query','publish/video/init','status/fetch']) assert.ok(shared.includes(marker), `Shared module missing ${marker}`);
assert.ok(auth.includes('user.info.basic,video.publish,video.upload'), 'OAuth scopes changed');
for (const marker of ['video.publish','video.upload','FILE_UPLOAD','privacy_level_options','max_video_post_duration_sec','brand_content_toggle','brand_organic_toggle','is_aigc','DIRECT_POST_URL']) assert.ok(publish.includes(marker), `Publish handler missing ${marker}`);
assert.ok(build.includes('register-tiktok-publish.mjs') && build.includes("'tiktok-publish'"), 'Build registration missing');

const calls = [];
const status = {ok:true,configured:true,connected:true,open_id:'fixture-creator',can_upload_draft:true,user:{display_name:'Fixture Creator'},creator:{creator_nickname:'Fixture Creator',privacy_level_options:['PUBLIC_TO_EVERYONE','SELF_ONLY'],max_video_post_duration_sec:120,comment_disabled:true,duet_disabled:false,stitch_disabled:false}};
let nextInit = {ok:true,publish_id:'fixture-publish-1',upload_url:'https://upload.invalid/signed?secret=fixture-signed-secret',chunk_size:1,total_chunk_count:1,tiktok:{data:{publish_id:'fixture-publish-1',upload_url:'https://upload.invalid/signed?secret=fixture-signed-secret'}}};
let delayInit=false,delayedInitResolve=null;
let nextStatus = {ok:true,publish_id:'fixture-publish-1',tiktok:{data:{publish_id:'fixture-publish-1',status:'PUBLISH_COMPLETE',log_id:'fixture-log'}}};
const dom = new JSDOM(page, {url:'https://aineedhelpfromotherai.com/tiktok-publish/',runScripts:'outside-only',pretendToBeVisual:true});
const {window}=dom;
window.fetch=async (url,options={})=>{
  const path=String(url); calls.push({url:path,options});
  if(path.startsWith('/api/tiktok/status?publish_id=')) return response(nextStatus);
  if(path==='/api/tiktok/status') return response(status,status.httpStatus||200);
  if(path==='/api/tiktok/publish') return delayInit?await new Promise(resolve=>{delayedInitResolve=resolve}):response(nextInit,nextInit.http_status||200);
  if(path.startsWith('https://upload.invalid/')) return response({},200,'');
  throw new Error(`Unexpected fixture request ${path}`);
};
window.URL.createObjectURL=()=> 'blob:fixture-video'; window.URL.revokeObjectURL=()=>{};
const nativeTimeout=window.setTimeout.bind(window); window.setTimeout=(fn)=>nativeTimeout(fn,0);
window.eval([...window.document.scripts].find(s=>s.textContent.includes('loadStatus();')).textContent);
const $=id=>window.document.getElementById(id);
const tick=()=>new Promise(resolve=>nativeTimeout(resolve,0));
const change=id=>{$(id).dispatchEvent(new window.Event('change',{bubbles:true}))};
await tick(); await tick();

assert.equal($('connection-label').textContent,'TikTok connected');
assert.equal($('allow-comment').checked,false); assert.equal($('allow-duet').checked,false); assert.equal($('allow-stitch').checked,false);
assert.equal($('allow-comment').disabled,true,'Creator-disabled interaction must be visibly disabled');
assert.equal($('connect-button').tagName,'BUTTON','Connect control must not expose the OAuth endpoint as a crawlable anchor');
assert.equal($('connect-button').getAttribute('href'),null,'Connect control must not publish /api/tiktok/auth as an href');

// Policy links and declaration reset are tested against official URLs from official-1.txt.
$('commercial-toggle').checked=true; change('commercial-toggle');
assert.equal($('your-brand').checked,false); assert.equal($('branded-content').checked,false);
assert.equal($('your-brand').disabled,false);
assert.match($('commercial-note').textContent,/Choose at least one/);
$('your-brand').checked=true; change('your-brand');
assert.match($('commercial-note').textContent,/Your video will be labeled as 'Promotional content'/);
$('consent').checked=true; change('consent');
$('branded-content').checked=true; change('branded-content');
assert.match($('commercial-note').textContent,/Your video will be labeled as 'Paid partnership'/);
assert.doesNotMatch($('commercial-note').textContent,/Promotional content/);
assert.ok([...$('consent-text').querySelectorAll('a')].some(a=>a.href==='https://www.tiktok.com/legal/page/global/bc-policy/en'));
assert.ok([...$('consent-text').querySelectorAll('a')].some(a=>a.href==='https://www.tiktok.com/legal/page/global/music-usage-confirmation/en'));
assert.equal($('consent').checked,false,'Disclosure changes must invalidate stale consent');
$('commercial-toggle').checked=false; change('commercial-toggle');
assert.equal($('consent').checked,false);
$('commercial-toggle').checked=true;change('commercial-toggle');
$('privacy').value='SELF_ONLY';change('privacy');
$('branded-content').checked=true;change('branded-content');
assert.equal($('privacy').value,'SELF_ONLY','Preserve manually selected privacy');
assert.equal($('branded-content').disabled,true,'Explain and prevent branded + SELF_ONLY conflict');
assert.ok($('branded-content').title.length>0);
assert.ok($('privacy').title.length>0,'Privacy control must explain the branded-content conflict on hover');
assert.ok($('branded-content').parentElement.title.length>0,'Branded-content label must explain the conflict on hover');
assert.ok($('commercial-note').textContent.includes('Only me')&&$('commercial-note').textContent.includes('Branded content'),'Visible note must explain the current privacy conflict');
$('branded-content').checked=false;$('privacy').value='PUBLIC_TO_EVERYONE';change('privacy');
$('branded-content').checked=true;change('branded-content');
assert.equal($('privacy').value,'PUBLIC_TO_EVERYONE');
assert.equal([...$('privacy').options].find(o=>o.value==='SELF_ONLY').disabled,true,'Do not allow changing branded post to SELF_ONLY');
assert.ok([...$('privacy').options].find(o=>o.value==='SELF_ONLY').title.length>0);

// Creator refresh must replace available options/max and error responses retain codes despite connected:false.
status.creator.max_video_post_duration_sec=60;
$('refresh-button').click();await tick();await tick();
assert.equal($('privacy').options.length,3);
status.httpStatus=502;status.error={code:null,body:{error:{code:'spam_risk_too_many_posts',message:'Too many posts'}}};
$('refresh-button').click();await tick();await tick();
assert.match($('result-label').textContent,/temporarily limiting creator posts/i,'Nested creator quota errors should retain the friendly status message');
assert.match($('result-raw').textContent,/spam_risk_too_many_posts/);
delete status.httpStatus;delete status.error;

// Complete a fixture post to exercise the actual page script's upload, receipt, redaction and resume flow.
$('commercial-toggle').checked=false;change('commercial-toggle');
$('privacy').value='SELF_ONLY';change('privacy');
$('consent').checked=true;change('consent');
const file=new window.File(['x'], 'clip.mp4',{type:'video/mp4'});
Object.defineProperty($('video-file'),'files',{configurable:true,value:[file]});$('video-file').dispatchEvent(new window.Event('change',{bubbles:true}));
Object.defineProperty($('video-preview'),'duration',{configurable:true,value:5});$('video-preview').onloadedmetadata();$('consent').checked=true;change('consent');
$('title').value='Fixture title';$('title').dispatchEvent(new window.Event('input',{bubbles:true}));
assert.equal($('consent').checked,false,'Changing post material must require fresh policy consent');
$('consent').checked=true;change('consent');
$('description').value='Fixture details';$('description').dispatchEvent(new window.Event('input',{bubbles:true}));
assert.equal($('consent').checked,false,'Changing caption material must require fresh policy consent');
$('consent').checked=true;change('consent');
$('aigc').checked=true;change('aigc');
assert.equal($('consent').checked,false,'Changing the material disclosure must require fresh policy consent');
$('consent').checked=true;change('consent');
assert.equal($('publish-button').disabled,false,'Valid consent, privacy, file and connected status should enable posting');
$('publish-button').click();await tick();await tick();await tick();await tick();
assert.ok(calls.some(c=>c.url==='https://upload.invalid/signed?secret=fixture-signed-secret'),'Signed URL should reach the upload function in memory');
const displayed=$('result-raw').textContent;
assert.ok(!displayed.includes('fixture-signed-secret'),'Never render signed upload URLs');
assert.ok(displayed.includes('fixture-publish-1')&&displayed.includes('PUBLISH_COMPLETE')&&displayed.includes('fixture-log'));
assert.ok(!window.sessionStorage.getItem('tiktok-publish-receipt')?.includes('signed'));
assert.ok($('track-button'),'Pending task needs an explicit continue-tracking control');

// The selected file is immutable for one in-flight publish, even if a change event races init.
delayInit=true;$('publish-button').click();await tick();
assert.equal($('video-file').disabled,true,'Video selection must be disabled while publish initialization is pending');
const replacement=new window.File(['y'],'replacement.mp4',{type:'video/mp4'});
Object.defineProperty($('video-file'),'files',{configurable:true,value:[replacement]});$('video-file').dispatchEvent(new window.Event('change',{bubbles:true}));
delayedInitResolve(response({ok:true,publish_id:'race-publish',upload_url:'https://upload.invalid/race',chunk_size:2,total_chunk_count:1}));
await tick();await tick();await tick();await tick();await new Promise(resolve=>nativeTimeout(resolve,20));
delayInit=false;
const racePayload=JSON.parse(calls.find(c=>c.url==='/api/tiktok/publish').options.body);
assert.equal(racePayload.file_name,'clip.mp4');
const raceUpload=calls.find(c=>c.url==='https://upload.invalid/race');
assert.equal(raceUpload.options.body[Object.getOwnPropertySymbols(raceUpload.options.body)[0]]._buffer.toString(),'x','Chunk upload must use the exact file selected for preview and consent');
assert.equal($('video-file').disabled,false,'File selection must re-enable after the publish reaches a terminal result');
Object.defineProperty($('video-file'),'files',{configurable:true,value:[file]});$('video-file').dispatchEvent(new window.Event('change',{bubbles:true}));
Object.defineProperty($('video-preview'),'duration',{configurable:true,value:5});$('video-preview').onloadedmetadata();$('consent').checked=true;change('consent');

// Creator quota failures and lost transport outcomes keep their code/receipt and cannot cause a blind re-init.
nextInit={ok:false,error:{code:null,body:{error:{code:'spam_risk_too_many_posts',message:'Too many posts'}}},http_status:502};
$('publish-button').click();await tick();await tick();
assert.match($('progress-label').textContent,/later|retry/i);
assert.ok(!$('result-raw').textContent.includes('fixture-refresh'));
assert.ok(!$('result-raw').textContent.includes('https://secret.invalid'));

// A creator identity change resets creator-scoped privacy, consent, and interactions.
const identity=new JSDOM(page,{url:'https://aineedhelpfromotherai.com/tiktok-publish/',runScripts:'outside-only'});
let identityLoads=0;identity.window.fetch=async url=>{if(String(url)==='/api/tiktok/status'){identityLoads++;return response({...status,open_id:identityLoads<3?'creator-a':'creator-b',creator:{...status.creator,comment_disabled:false}})}throw new Error(`Unexpected identity fixture request ${url}`)};
identity.window.eval([...identity.window.document.scripts].find(s=>s.textContent.includes('loadStatus();')).textContent);
await tick();await tick();
const identityDoc=identity.window.document;
identityDoc.getElementById('privacy').value='PUBLIC_TO_EVERYONE';identityDoc.getElementById('privacy').dispatchEvent(new identity.window.Event('change',{bubbles:true}));
identityDoc.getElementById('consent').checked=true;identityDoc.getElementById('consent').dispatchEvent(new identity.window.Event('change',{bubbles:true}));
identityDoc.getElementById('allow-comment').checked=true;
identityDoc.getElementById('refresh-button').click();await tick();await tick();
assert.equal(identityDoc.getElementById('privacy').value,'PUBLIC_TO_EVERYONE','A same-creator refresh should preserve a still-valid privacy selection');
assert.equal(identityDoc.getElementById('consent').checked,true,'A same-creator refresh should not invalidate consent');
assert.equal(identityDoc.getElementById('allow-comment').checked,true,'A same-creator refresh should preserve valid interaction choices');
identityDoc.getElementById('refresh-button').click();await tick();await tick();
assert.equal(identityDoc.getElementById('privacy').value,'','A different creator must not inherit the previous creator privacy choice');
assert.equal(identityDoc.getElementById('consent').checked,false,'A different creator must require fresh consent');
assert.equal(identityDoc.getElementById('allow-comment').checked,false,'Creator-scoped interaction choices must reset after account switching');
identity.window.close();

// Restored receipts must remain tied to their original creator and never be queried on another account.
const restored=new JSDOM(page,{url:'https://aineedhelpfromotherai.com/tiktok-publish/',runScripts:'outside-only'});
restored.window.sessionStorage.setItem('tiktok-publish-receipt',JSON.stringify({publish_id:'same-task-7',mode:'publish',state:'pending',creator_id:'creator-original'}));
let switchedAccountStatusCalls=0;
restored.window.fetch=async url=>{if(String(url)==='/api/tiktok/status')return response({...status,open_id:'different-creator'});if(String(url).includes('publish_id=')){switchedAccountStatusCalls++;return response(nextStatus)}throw new Error(`Unexpected restored fixture request ${url}`)};
restored.window.eval([...restored.window.document.scripts].find(s=>s.textContent.includes('loadStatus();')).textContent);
await new Promise(resolve=>nativeTimeout(resolve,0));await new Promise(resolve=>nativeTimeout(resolve,0));
const resumedButton=restored.window.document.getElementById('track-button');
assert.equal(resumedButton.disabled,true,'A saved TikTok task must not be queried from a different creator account');
resumedButton.click();await new Promise(resolve=>nativeTimeout(resolve,0));
assert.equal(switchedAccountStatusCalls,0,'Do not query someone else’s creator-scoped task');
assert.match(restored.window.document.getElementById('result-label').textContent,/unknown or does not match/i);
restored.window.close();

const missingReceiptIdentity=new JSDOM(page,{url:'https://aineedhelpfromotherai.com/tiktok-publish/',runScripts:'outside-only'});
missingReceiptIdentity.window.sessionStorage.setItem('tiktok-publish-receipt',JSON.stringify({publish_id:'unknown-owner-task',mode:'publish',state:'pending'}));
const missingReceiptCalls=[];
missingReceiptIdentity.window.fetch=async (url,options={})=>{missingReceiptCalls.push({url:String(url),method:options.method||'GET'});if(String(url)==='/api/tiktok/status')return response({...status,open_id:'known-current-creator'});if(String(url).includes('publish_id='))return response(nextStatus);if(String(url)==='/api/tiktok/publish')return response(nextInit);throw new Error(`Unexpected missing-receipt fixture request ${url}`)};
missingReceiptIdentity.window.eval([...missingReceiptIdentity.window.document.scripts].find(s=>s.textContent.includes('loadStatus();')).textContent);
await new Promise(resolve=>nativeTimeout(resolve,0));await new Promise(resolve=>nativeTimeout(resolve,0));
const missingReceiptTrack=missingReceiptIdentity.window.document.getElementById('track-button');
assert.equal(missingReceiptTrack.disabled,true,'A receipt without creator identity must fail closed');
missingReceiptTrack.click();await new Promise(resolve=>nativeTimeout(resolve,0));
assert.ok(!missingReceiptCalls.some(call=>call.url.startsWith('/api/tiktok/status?publish_id=')),'Do not query a receipt without a bound creator');
assert.ok(!missingReceiptCalls.some(call=>call.url==='/api/tiktok/publish'||call.method==='PUT'),'Blocked receipt must not initialize or upload');
assert.equal(JSON.parse(missingReceiptIdentity.window.sessionStorage.getItem('tiktok-publish-receipt')).creator_id,undefined,'Do not bind an unknown receipt to the current creator');
missingReceiptIdentity.window.close();

const disconnectedReceipt=new JSDOM(page,{url:'https://aineedhelpfromotherai.com/tiktok-publish/',runScripts:'outside-only'});
disconnectedReceipt.window.sessionStorage.setItem('tiktok-publish-receipt',JSON.stringify({publish_id:'disconnected-task',mode:'publish',state:'pending',creator_id:'known-creator'}));
const disconnectedCalls=[];
disconnectedReceipt.window.fetch=async url=>{disconnectedCalls.push(String(url));if(String(url)==='/api/tiktok/status')return response({...status,connected:false,open_id:'known-creator'});throw new Error(`Unexpected disconnected fixture request ${url}`)};
disconnectedReceipt.window.eval([...disconnectedReceipt.window.document.scripts].find(s=>s.textContent.includes('loadStatus();')).textContent);
await new Promise(resolve=>nativeTimeout(resolve,0));await new Promise(resolve=>nativeTimeout(resolve,0));
const disconnectedTrack=disconnectedReceipt.window.document.getElementById('track-button');
assert.equal(disconnectedTrack.disabled,true,'A disconnected account cannot track a pending task');
disconnectedTrack.click();await new Promise(resolve=>nativeTimeout(resolve,0));
assert.ok(!disconnectedCalls.some(url=>url.startsWith('/api/tiktok/status?publish_id=')),'Disconnected account must not query the pending task');
assert.ok(!disconnectedCalls.includes('/api/tiktok/publish'),'Disconnected account must not initialize a publish');
disconnectedReceipt.window.close();

const missingCurrentIdentity=new JSDOM(page,{url:'https://aineedhelpfromotherai.com/tiktok-publish/',runScripts:'outside-only'});
missingCurrentIdentity.window.sessionStorage.setItem('tiktok-publish-receipt',JSON.stringify({publish_id:'unknown-current-task',mode:'publish',state:'pending',creator_id:'bound-creator'}));
const missingCurrentCalls=[];
missingCurrentIdentity.window.fetch=async url=>{missingCurrentCalls.push(String(url));if(String(url)==='/api/tiktok/status')return response({...status,open_id:null});if(String(url).includes('publish_id='))return response(nextStatus);if(String(url)==='/api/tiktok/publish')return response(nextInit);throw new Error(`Unexpected missing-current fixture request ${url}`)};
missingCurrentIdentity.window.eval([...missingCurrentIdentity.window.document.scripts].find(s=>s.textContent.includes('loadStatus();')).textContent);
await new Promise(resolve=>nativeTimeout(resolve,0));await new Promise(resolve=>nativeTimeout(resolve,0));
const missingCurrentTrack=missingCurrentIdentity.window.document.getElementById('track-button');
assert.equal(missingCurrentTrack.disabled,true,'A missing current creator identity must fail closed');
missingCurrentTrack.click();await new Promise(resolve=>nativeTimeout(resolve,0));
assert.ok(!missingCurrentCalls.some(url=>url.startsWith('/api/tiktok/status?publish_id=')),'Do not query when current creator identity is unknown');
assert.ok(!missingCurrentCalls.includes('/api/tiktok/publish'),'Blocked receipt must not initialize a new publish');
missingCurrentIdentity.window.close();

const sameCreator=new JSDOM(page,{url:'https://aineedhelpfromotherai.com/tiktok-publish/',runScripts:'outside-only'});
sameCreator.window.sessionStorage.setItem('tiktok-publish-receipt',JSON.stringify({publish_id:'same-task-8',mode:'upload',state:'pending',creator_id:'original-creator'}));
const sameTaskCalls=[];
sameCreator.window.fetch=async url=>{sameTaskCalls.push(String(url));if(String(url)==='/api/tiktok/status')return response({...status,open_id:'original-creator'});if(String(url)==='/api/tiktok/status?publish_id=same-task-8')return response({ok:true,publish_id:'same-task-8',tiktok:{data:{publish_id:'same-task-8',status:'SEND_TO_USER_INBOX',log_id:'fixture-inbox-log'}}});throw new Error(`Unexpected same-creator fixture request ${url}`)};
sameCreator.window.eval([...sameCreator.window.document.scripts].find(s=>s.textContent.includes('loadStatus();')).textContent);
await new Promise(resolve=>nativeTimeout(resolve,0));await new Promise(resolve=>nativeTimeout(resolve,0));
sameCreator.window.document.getElementById('track-button').click();await new Promise(resolve=>nativeTimeout(resolve,0));await new Promise(resolve=>nativeTimeout(resolve,0));
assert.ok(sameTaskCalls.includes('/api/tiktok/status?publish_id=same-task-8'),'Reload must resume the same publish ID');
assert.ok(!sameTaskCalls.includes('/api/tiktok/publish'),'Restored tasks must never initialize a new publish');
assert.match(sameCreator.window.document.getElementById('result-label').textContent,/draft, not a published post/i);
assert.equal(sameCreator.window.sessionStorage.getItem('tiktok-publish-receipt'),null,'A terminal inbox outcome is no longer pending');
sameCreator.window.close();

console.log('TikTok Content Posting page-script regression: PASS (fixture-backed HTTP/media only)');

dom.window.close();
function response(body,status=200,text){return {ok:status>=200&&status<300,status,json:async()=>body,text:async()=>text??''};}
