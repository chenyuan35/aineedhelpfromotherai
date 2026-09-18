const { config,creatorInfo,ensureAccessToken,errorStatus,publicError,publishStatus,readSession,sendJson,splitScopes }=require('../../lib/tiktok-web');
module.exports=async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('Allow','GET');return sendJson(res,405,{ok:false,error:{message:'Method not allowed.'}})}
  try{config()}catch(error){return sendJson(res,errorStatus(error),{ok:false,configured:false,connected:false,error:publicError(error)})}
  const existing=readSession(req);if(!existing||!existing.access_token)return sendJson(res,200,{ok:true,configured:true,connected:false,last_error:existing&&existing.last_error?existing.last_error:null});
  try{
    const {accessToken,session}=await ensureAccessToken(req,res);const scopes=splitScopes(session.scope);const publishId=req.query&&req.query.publish_id;
    if(publishId){const result=await publishStatus(accessToken,publishId);return sendJson(res,200,{ok:true,configured:true,connected:true,publish_id:publishId,tiktok:result})}
    let creator=null;if(scopes.includes('video.publish')&&(!req.query||req.query.creator!=='0'))creator=await creatorInfo(accessToken);
    return sendJson(res,200,{ok:true,configured:true,connected:true,open_id:session.open_id||null,scopes,can_direct_post:scopes.includes('video.publish'),can_upload_draft:scopes.includes('video.upload'),expires_at:session.expires_at||null,creator,last_error:session.last_error||null});
  }catch(error){return sendJson(res,errorStatus(error),{ok:false,configured:true,connected:false,error:publicError(error)})}
};
