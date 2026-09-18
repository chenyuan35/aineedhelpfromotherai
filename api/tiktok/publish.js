const {DIRECT_POST_URL,UPLOAD_DRAFT_URL,TikTokError,buildChunkPlan,creatorInfo,ensureAccessToken,errorStatus,jsonBody,publicError,sendJson,splitScopes,tiktokJson}=require('../../lib/tiktok-web');
const ALLOWED_TYPES=new Set(['video/mp4','video/quicktime']);const ALLOWED_EXTENSIONS=new Set(['mp4','mov']);
function extensionOf(name){const value=String(name||'');const i=value.lastIndexOf('.');return i<0?'':value.slice(i+1).toLowerCase()}
function normalizeCaption(title,description){return[title,description].map(v=>String(v||'').trim()).filter(Boolean).join('\n\n').slice(0,2200)}
module.exports=async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return sendJson(res,405,{ok:false,error:{message:'Method not allowed.'}})}
  try{
    const body=jsonBody(req);const mode=body.mode==='upload'?'upload':'publish';const fileName=String(body.file_name||'').trim();const fileType=String(body.file_type||'').toLowerCase();const fileSize=Number(body.file_size);const extension=extensionOf(fileName);
    if(!fileName||!ALLOWED_EXTENSIONS.has(extension)||!ALLOWED_TYPES.has(fileType))throw new TikTokError('Choose an MP4 or MOV video before publishing.',{source:'server',code:'unsupported_video',httpStatus:400});
    const {accessToken,session}=await ensureAccessToken(req,res);const scopes=splitScopes(session.scope);const {chunkSize,totalChunkCount}=buildChunkPlan(fileSize);
    if(mode==='upload'){
      if(!scopes.includes('video.upload'))throw new TikTokError('The connected TikTok account did not grant video.upload.',{source:'server',code:'missing_video_upload_scope',httpStatus:403});
      const tiktok=await tiktokJson(UPLOAD_DRAFT_URL,accessToken,{source_info:{source:'FILE_UPLOAD',video_size:fileSize,chunk_size:chunkSize,total_chunk_count:totalChunkCount}});
      return sendJson(res,200,{ok:true,mode,publish_id:tiktok.data&&tiktok.data.publish_id,upload_url:tiktok.data&&tiktok.data.upload_url,chunk_size:chunkSize,total_chunk_count:totalChunkCount,tiktok});
    }
    if(!scopes.includes('video.publish'))throw new TikTokError('The connected TikTok account did not grant video.publish.',{source:'server',code:'missing_video_publish_scope',httpStatus:403});
    if(body.consent!==true)throw new TikTokError('Explicit user consent is required before posting to TikTok.',{source:'server',code:'publish_consent_required',httpStatus:400});
    const creator=await creatorInfo(accessToken);const privacy=String(body.privacy_level||'').trim();const privacyOptions=Array.isArray(creator.privacy_level_options)?creator.privacy_level_options:[];
    if(!privacy||!privacyOptions.includes(privacy))throw new TikTokError('Choose one of the privacy options returned by TikTok for this account.',{source:'server',code:'invalid_privacy_level',httpStatus:400});
    const allowComment=body.allow_comment===true&&creator.comment_disabled!==true;const allowDuet=body.allow_duet===true&&creator.duet_disabled!==true;const allowStitch=body.allow_stitch===true&&creator.stitch_disabled!==true;const caption=normalizeCaption(body.title,body.description);
    const tiktok=await tiktokJson(DIRECT_POST_URL,accessToken,{post_info:{title:caption,privacy_level:privacy,disable_comment:!allowComment,disable_duet:!allowDuet,disable_stitch:!allowStitch,video_cover_timestamp_ms:1000,brand_content_toggle:false,brand_organic_toggle:false,is_aigc:false},source_info:{source:'FILE_UPLOAD',video_size:fileSize,chunk_size:chunkSize,total_chunk_count:totalChunkCount}});
    return sendJson(res,200,{ok:true,mode,publish_id:tiktok.data&&tiktok.data.publish_id,upload_url:tiktok.data&&tiktok.data.upload_url,chunk_size:chunkSize,total_chunk_count:totalChunkCount,tiktok});
  }catch(error){return sendJson(res,errorStatus(error),{ok:false,error:publicError(error)})}
};
