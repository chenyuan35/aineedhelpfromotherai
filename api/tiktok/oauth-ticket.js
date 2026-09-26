const crypto = require('crypto');
const { TikTokError, ensureAccessToken, errorStatus, publicError, sendJson } = require('../../lib/tiktok-web');

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtvD8Z4/G10Vwiy/aQbMq
uRECokWEoLN/146o+RxornEhdv1uR5785hDjuozivV1cu0kOz+ZmBVolfZiqqPPJ
B7linfPf4mYv+QrYqV6VPQ2p/AQca4wp5UzzKsEXMMTf7PwHrmKP5sfYIy0iwYEs
ewQGmnlEDyaysf09gAOdDMdGtt/IpxhpGUBcM28U/L7mQEc80Poe/17Svw7aN6FA
P/HfDdOnEq8eAPAOwgOQJclHCqy0RsqSoY/3bglvsKWVjYqD/e2PtOBdzUMGrAy0
sqZZ0eWQwRv3bufn/K2iYLJJpun/oGEjzqPM0wgDtxNzJw0txYgk4gEuDzmGU8V3
LQIDAQAB
-----END PUBLIC KEY-----`;

function encryptBundle(payload) {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(Buffer.from(JSON.stringify(payload), 'utf8')), cipher.final()]);
  const tag = cipher.getAuthTag();
  const ek = crypto.publicEncrypt({ key: PUBLIC_KEY, oaepHash: 'sha256' }, key);
  return Buffer.from(JSON.stringify({
    ek: ek.toString('base64'), iv: iv.toString('base64'),
    tag: tag.toString('base64'), ct: ciphertext.toString('base64')
  }), 'utf8').toString('base64');
}
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { ok: false, error: { message: 'Method not allowed.' } });
  }
  try {
    if (!req.query || req.query.confirm !== '1') {
      throw new TikTokError('Explicit OAuth export confirmation is required.', { source: 'server', code: 'oauth_export_confirmation_required', httpStatus: 400 });
    }
    const { accessToken, session } = await ensureAccessToken(req, res);
    if (!session.refresh_token) {
      throw new TikTokError('Connected TikTok session has no refresh token.', { source: 'server', code: 'tiktok_refresh_unavailable', httpStatus: 401 });
    }
    const bundle_b64 = encryptBundle({
      access_token: accessToken,
      refresh_token: session.refresh_token,
      open_id: session.open_id || null,
      scope: session.scope || '',
      expires_at: session.expires_at || null,
      refresh_expires_at: session.refresh_expires_at || null,
      connected_at: session.connected_at || Date.now()
    });
    return sendJson(res, 200, { ok: true, bundle_b64, target: 'VM-12-166-ubuntu', note: 'Encrypted for the production VPS only.' });
  } catch (error) {
    return sendJson(res, errorStatus(error), { ok: false, error: publicError(error) });
  }
};
