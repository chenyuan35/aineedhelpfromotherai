const { clearCookie, config, publicError, readState, safeReturnPath, tokenRequest, writeSession } = require('../../lib/tiktok-web');
function redirect(res,query){const target=new URL(safeReturnPath(),'https://aineedhelpfromotherai.com');Object.entries(query||{}).forEach(([k,v])=>target.searchParams.set(k,v));res.statusCode=302;res.setHeader('Cache-Control','no-store');res.setHeader('Location',`${target.pathname}${target.search}`);res.end()}
module.exports=async function handler(req,res){
  if(req.method!=='GET'){res.statusCode=405;res.setHeader('Allow','GET');return res.end('Method not allowed')}
  const stateRecord=readState(req);const returnedState=req.query&&req.query.state;
  if(!stateRecord||!returnedState||stateRecord.state!==returnedState){writeSession(res,{last_error:{source:'server',code:'oauth_state_mismatch',message:'TikTok OAuth state validation failed.'}});clearCookie(res,'__Host-tiktok_state');return redirect(res,{oauth:'failed'})}
  try{
    if(req.query&&req.query.error){writeSession(res,{last_error:{source:'tiktok',code:req.query.error,message:req.query.error_description||'TikTok authorization was not completed.'}});clearCookie(res,'__Host-tiktok_state');return redirect(res,{oauth:'failed'})}
    const code=req.query&&req.query.code;if(!code)throw new Error('TikTok callback did not include an authorization code.');
    const cfg=config();const token=await tokenRequest({client_key:cfg.clientKey,client_secret:cfg.clientSecret,code:String(code),grant_type:'authorization_code',redirect_uri:cfg.redirectUri});
    writeSession(res,{access_token:token.access_token,refresh_token:token.refresh_token||null,open_id:token.open_id||null,scope:token.scope||'',expires_at:Date.now()+Number(token.expires_in||0)*1000,refresh_expires_at:token.refresh_expires_in?Date.now()+Number(token.refresh_expires_in)*1000:null,connected_at:Date.now(),last_error:null});
    clearCookie(res,'__Host-tiktok_state');return redirect(res,{connected:'1'});
  }catch(error){writeSession(res,{last_error:publicError(error)});clearCookie(res,'__Host-tiktok_state');return redirect(res,{oauth:'failed'})}
};
