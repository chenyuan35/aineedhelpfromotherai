const crypto = require('crypto');
const { AUTHORIZE_URL, config, errorStatus, publicError, sendJson, writeState } = require('../../lib/tiktok-web');
module.exports = async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('Allow','GET');return sendJson(res,405,{ok:false,error:{message:'Method not allowed.'}})}
  try{
    const cfg=config();
    const mode=req.query&&req.query.mode==='upload'?'upload':'publish';
    const scope='user.info.basic,video.publish,video.upload';
    const state=crypto.randomBytes(24).toString('base64url');
    writeState(res,{state,mode,created_at:Date.now()});
    const url=new URL(AUTHORIZE_URL);
    url.searchParams.set('client_key',cfg.clientKey);url.searchParams.set('response_type','code');url.searchParams.set('scope',scope);url.searchParams.set('redirect_uri',cfg.redirectUri);url.searchParams.set('state',state);
    res.statusCode=302;res.setHeader('Cache-Control','no-store');res.setHeader('Location',url.toString());res.end();
  }catch(error){sendJson(res,errorStatus(error),{ok:false,error:publicError(error)})}
};
