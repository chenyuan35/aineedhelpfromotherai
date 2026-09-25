const { UPLOAD_DRAFT_URL, ensureAccessToken, sendJson, splitScopes, tiktokJson } = require('../../lib/tiktok-web');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { ok: false, error: { message: 'Method not allowed.' } });
  }
  try {
    const fileSize = Number(req.query && req.query.file_size);
    const confirm = String(req.query && req.query.confirm || '');
    if (confirm !== '1') return sendJson(res, 400, { ok: false, error: { message: 'Confirmation required.' } });
    if (!Number.isSafeInteger(fileSize) || fileSize <= 0) return sendJson(res, 400, { ok: false, error: { message: 'Invalid file size.' } });
    const { accessToken, session } = await ensureAccessToken(req, res);
    const scopes = splitScopes(session.scope);
    if (!scopes.includes('video.upload')) return sendJson(res, 403, { ok: false, error: { message: 'video.upload not granted.' } });
    const chunkSize = fileSize;
    const tiktok = await tiktokJson(UPLOAD_DRAFT_URL, accessToken, {
      source_info: { source: 'FILE_UPLOAD', video_size: fileSize, chunk_size: chunkSize, total_chunk_count: 1 }
    });
    return sendJson(res, 200, {
      ok: true,
      publish_id: tiktok.data && tiktok.data.publish_id,
      upload_url: tiktok.data && tiktok.data.upload_url,
      chunk_size: chunkSize,
      total_chunk_count: 1
    });
  } catch (error) {
    return sendJson(res, 500, { ok: false, error: { message: error && error.message ? error.message : String(error) } });
  }
};
