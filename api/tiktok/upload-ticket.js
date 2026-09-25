const { UPLOAD_DRAFT_URL, TikTokError, buildChunkPlan, ensureAccessToken, errorStatus, publicError, sendJson, splitScopes, tiktokJson } = require('../../lib/tiktok-web');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { ok: false, error: { message: 'Method not allowed.' } });
  }
  try {
    if (!req.query || req.query.confirm !== '1') {
      throw new TikTokError('Explicit upload confirmation is required.', { source: 'server', code: 'upload_confirmation_required', httpStatus: 400 });
    }
    const fileSize = Number(req.query.file_size);
    const { accessToken, session } = await ensureAccessToken(req, res);
    const scopes = splitScopes(session.scope);
    if (!scopes.includes('video.upload')) {
      throw new TikTokError('The connected TikTok account did not grant video.upload.', { source: 'server', code: 'missing_video_upload_scope', httpStatus: 403 });
    }
    const { chunkSize, totalChunkCount } = buildChunkPlan(fileSize);
    const tiktok = await tiktokJson(UPLOAD_DRAFT_URL, accessToken, {
      source_info: { source: 'FILE_UPLOAD', video_size: fileSize, chunk_size: chunkSize, total_chunk_count: totalChunkCount }
    });
    return sendJson(res, 200, {
      ok: true,
      mode: 'upload',
      publish_id: tiktok.data && tiktok.data.publish_id,
      upload_url: tiktok.data && tiktok.data.upload_url,
      chunk_size: chunkSize,
      total_chunk_count: totalChunkCount,
      expires_note: 'Use this TikTok upload URL immediately; it is short-lived.'
    });
  } catch (error) {
    return sendJson(res, errorStatus(error), { ok: false, error: publicError(error) });
  }
};
