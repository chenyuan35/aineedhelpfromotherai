const crypto = require('crypto');

const AUTHORIZE_URL = 'https://www.tiktok.com/v2/auth/authorize/';
const TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';
const CREATOR_URL = 'https://open.tiktokapis.com/v2/post/publish/creator_info/query/';
const DIRECT_POST_URL = 'https://open.tiktokapis.com/v2/post/publish/video/init/';
const UPLOAD_DRAFT_URL = 'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/';
const STATUS_URL = 'https://open.tiktokapis.com/v2/post/publish/status/fetch/';
const USER_INFO_URL = 'https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name';
const SESSION_COOKIE = '__Host-tiktok_session';
const STATE_COOKIE = '__Host-tiktok_state';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;
const STATE_MAX_AGE = 10 * 60;
class TikTokError extends Error { constructor(message, details = {}) { super(message); this.name = 'TikTokError'; Object.assign(this, details); } }
function config() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI;
  const missing = [['TIKTOK_CLIENT_KEY',clientKey],['TIKTOK_CLIENT_SECRET',clientSecret],['TIKTOK_REDIRECT_URI',redirectUri]].filter(([,v])=>!v).map(([n])=>n);
  if (missing.length) throw new TikTokError('TikTok server configuration is incomplete.', { source:'server', code:'tiktok_config_missing', missing, httpStatus:503 });
  if (!/^https:\/\//i.test(redirectUri)) throw new TikTokError('TIKTOK_REDIRECT_URI must use HTTPS.', { source:'server', code:'tiktok_redirect_uri_invalid', httpStatus:503 });
  return { clientKey, clientSecret, redirectUri };
}
function encryptionKey(){ return crypto.createHash('sha256').update(config().clientSecret,'utf8').digest(); }
function seal(payload){ const iv=crypto.randomBytes(12); const cipher=crypto.createCipheriv('aes-256-gcm',encryptionKey(),iv); const plaintext=Buffer.from(JSON.stringify(payload),'utf8'); const ciphertext=Buffer.concat([cipher.update(plaintext),cipher.final()]); const tag=cipher.getAuthTag(); return [iv,tag,ciphertext].map(p=>p.toString('base64url')).join('.'); }
function unseal(value){ if(!value||typeof value!=='string') return null; try{ const [ivPart,tagPart,ciphertextPart]=value.split('.'); if(!ivPart||!tagPart||!ciphertextPart) return null; const decipher=crypto.createDecipheriv('aes-256-gcm',encryptionKey(),Buffer.from(ivPart,'base64url')); decipher.setAuthTag(Buffer.from(tagPart,'base64url')); const plaintext=Buffer.concat([decipher.update(Buffer.from(ciphertextPart,'base64url')),decipher.final()]); return JSON.parse(plaintext.toString('utf8')); }catch{return null;} }
function parseCookies(req){ const header=req.headers&&req.headers.cookie; if(!header) return {}; return header.split(';').reduce((out,pair)=>{const i=pair.indexOf('='); if(i<0)return out; const key=pair.slice(0,i).trim(); const value=pair.slice(i+1).trim(); try{out[key]=decodeURIComponent(value)}catch{out[key]=value} return out;},{}); }
function appendSetCookie(res,value){ const existing=res.getHeader('Set-Cookie'); if(!existing)res.setHeader('Set-Cookie',value); else if(Array.isArray(existing))res.setHeader('Set-Cookie',[...existing,value]); else res.setHeader('Set-Cookie',[existing,value]); }
function cookie(name,value,maxAge){ return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`; }
function clearCookie(res,name){ appendSetCookie(res,cookie(name,'',0)); }
function readSession(req){ return unseal(parseCookies(req)[SESSION_COOKIE]); }
function writeSession(res,session){ appendSetCookie(res,cookie(SESSION_COOKIE,seal(session),SESSION_MAX_AGE)); }
function readState(req){ return unseal(parseCookies(req)[STATE_COOKIE]); }
function writeState(res,state){ appendSetCookie(res,cookie(STATE_COOKIE,seal(state),STATE_MAX_AGE)); }
function splitScopes(scope){ if(!scope)return[]; if(Array.isArray(scope))return scope; return String(scope).split(/[\s,]+/).map(s=>s.trim()).filter(Boolean); }
async function readJsonResponse(response){ const raw=await response.text(); let body=null; if(raw){try{body=JSON.parse(raw)}catch{body={raw}}} return {raw,body}; }
async function tokenRequest(params){ const response=await fetch(TOKEN_URL,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(params).toString()}); const {raw,body}=await readJsonResponse(response); if(!response.ok||!body||body.error||!body.access_token) throw new TikTokError('TikTok OAuth token request failed.',{source:'tiktok',endpoint:TOKEN_URL,httpStatus:response.ok?502:response.status,body,raw}); return body; }
async function tiktokGetJson(url,accessToken){ const response=await fetch(url,{headers:{Authorization:`Bearer ${accessToken}`}}); const {raw,body}=await readJsonResponse(response); const apiCode=body&&body.error&&body.error.code; if(!response.ok||!body||(apiCode&&apiCode!=='ok')) throw new TikTokError('TikTok API request failed.',{source:'tiktok',endpoint:url,httpStatus:response.ok?502:response.status,body,raw}); return body; }
async function tiktokJson(url,accessToken,payload={}){ const response=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json; charset=UTF-8'},body:JSON.stringify(payload)}); const {raw,body}=await readJsonResponse(response); const apiCode=body&&body.error&&body.error.code; if(!response.ok||!body||(apiCode&&apiCode!=='ok')) throw new TikTokError('TikTok API request failed.',{source:'tiktok',endpoint:url,httpStatus:response.ok?502:response.status,body,raw}); return body; }
async function ensureAccessToken(req,res){ const cfg=config(); let session=readSession(req); if(!session||!session.access_token) throw new TikTokError('TikTok is not connected.',{source:'server',code:'tiktok_not_connected',httpStatus:401}); if((session.expires_at||0)>Date.now()+5*60*1000)return{accessToken:session.access_token,session}; if(!session.refresh_token) throw new TikTokError('TikTok access token expired and no refresh token is available.',{source:'server',code:'tiktok_refresh_unavailable',httpStatus:401}); const refreshed=await tokenRequest({client_key:cfg.clientKey,client_secret:cfg.clientSecret,grant_type:'refresh_token',refresh_token:session.refresh_token}); session={...session,access_token:refreshed.access_token,refresh_token:refreshed.refresh_token||session.refresh_token,open_id:refreshed.open_id||session.open_id,scope:refreshed.scope||session.scope,expires_at:Date.now()+Number(refreshed.expires_in||0)*1000,refresh_expires_at:refreshed.refresh_expires_in?Date.now()+Number(refreshed.refresh_expires_in)*1000:session.refresh_expires_at,last_error:null}; writeSession(res,session); return{accessToken:session.access_token,session}; }
async function userInfo(accessToken){ const result=await tiktokGetJson(USER_INFO_URL,accessToken); return result.data&&result.data.user||{}; }
async function creatorInfo(accessToken){ const result=await tiktokJson(CREATOR_URL,accessToken,{}); return result.data||{}; }
async function publishStatus(accessToken,publishId){ return tiktokJson(STATUS_URL,accessToken,{publish_id:publishId}); }
function jsonBody(req){ if(req.body&&typeof req.body==='object')return req.body; if(typeof req.body==='string'&&req.body){try{return JSON.parse(req.body)}catch{}} return{}; }
function publicError(error){ if(error instanceof TikTokError)return{source:error.source||'server',code:error.code||null,message:error.message,endpoint:error.endpoint||null,http_status:error.httpStatus||500,body:error.body||null,raw:error.raw||null,missing:error.missing||null}; return{source:'server',code:'internal_error',message:error&&error.message?error.message:String(error),http_status:500}; }
function errorStatus(error){ return Number(error&&error.httpStatus)||500; }
function sendJson(res,status,value){ res.statusCode=status; res.setHeader('Content-Type','application/json; charset=utf-8'); res.setHeader('Cache-Control','no-store'); res.end(JSON.stringify(value)); }
function buildChunkPlan(fileSize){ const size=Number(fileSize); if(!Number.isSafeInteger(size)||size<=0)throw new TikTokError('Invalid video file size.',{source:'server',code:'invalid_video_size',httpStatus:400}); const MB=1024*1024; let chunkSize; if(size<5*MB)chunkSize=size; else if(size<=64*MB)chunkSize=size; else chunkSize=32*MB; const totalChunkCount=Math.max(1,Math.floor(size/chunkSize)); return{chunkSize,totalChunkCount}; }
function safeReturnPath(){ return '/tiktok-publish/'; }
module.exports={AUTHORIZE_URL,DIRECT_POST_URL,UPLOAD_DRAFT_URL,SESSION_COOKIE,STATE_COOKIE,TikTokError,config,clearCookie,creatorInfo,ensureAccessToken,errorStatus,jsonBody,parseCookies,publicError,publishStatus,readSession,readState,safeReturnPath,sendJson,splitScopes,tokenRequest,writeSession,writeState,buildChunkPlan,tiktokJson,userInfo};
