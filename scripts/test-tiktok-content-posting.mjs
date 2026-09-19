import { readFileSync, existsSync } from 'fs';

const required = [
  'frontend/tiktok-publish/index.html',
  'frontend/bin/register-tiktok-publish.mjs',
  'api/tiktok/auth.js',
  'api/tiktok/callback.js',
  'api/tiktok/publish.js',
  'api/tiktok/status.js',
  'lib/tiktok-web.js',
];
for (const path of required) if (!existsSync(path)) throw new Error(`Missing ${path}`);
const page = readFileSync('frontend/tiktok-publish/index.html', 'utf8');
for (const marker of ['Connect TikTok','Post to TikTok','video-file','video-preview','commercial-toggle','branded-content','aigc','Music Usage Confirmation','result-raw','/api/tiktok/auth','/api/tiktok/publish','/api/tiktok/status']) if (!page.includes(marker)) throw new Error(`Page missing marker: ${marker}`);
const shared = readFileSync('lib/tiktok-web.js', 'utf8');
for (const marker of ['TIKTOK_CLIENT_KEY','TIKTOK_CLIENT_SECRET','TIKTOK_REDIRECT_URI','aes-256-gcm','https://www.tiktok.com/v2/auth/authorize/','https://open.tiktokapis.com/v2/oauth/token/','/v2/user/info/','creator_info/query','publish/video/init','status/fetch']) if (!shared.includes(marker)) throw new Error(`Shared TikTok module missing: ${marker}`);
const auth = readFileSync('api/tiktok/auth.js', 'utf8');
if (!auth.includes('user.info.basic,video.publish,video.upload')) throw new Error('OAuth must request every selected TikTok review scope');
const publish = readFileSync('api/tiktok/publish.js', 'utf8');
for (const marker of ['video.publish','video.upload','FILE_UPLOAD','privacy_level_options','max_video_post_duration_sec','brand_content_toggle','brand_organic_toggle','is_aigc','DIRECT_POST_URL']) if (!publish.includes(marker)) throw new Error(`Publish handler missing: ${marker}`);
const build = readFileSync('frontend/bin/build.mjs', 'utf8');
if (!build.includes('register-tiktok-publish.mjs') || !build.includes("'tiktok-publish'")) throw new Error('Build does not register/copy TikTok page');
const env = readFileSync('.env.example', 'utf8');
for (const key of ['TIKTOK_CLIENT_KEY=','TIKTOK_CLIENT_SECRET=','TIKTOK_REDIRECT_URI=https://aineedhelpfromotherai.com/api/tiktok/callback/']) if (!env.includes(key)) throw new Error(`Env example missing: ${key}`);
console.log('TikTok Content Posting contract: PASS');
