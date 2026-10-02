import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { one, query } from '../config/db.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/http-error.js';
import { getClientIp, hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
const schema = z.object({ name: z.string().trim().min(2).max(150).optional(), email: z.email(), phone: z.string().trim().max(30).optional(), password: z.string().min(8).max(100) });
const pub = (u) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, language: u.language, status: u.status, createdAt: u.created_at ?? u.createdAt });
function cookie(res, t) { res.cookie(env.COOKIE_NAME, t, { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax', path: '/api/auth', maxAge: 7 * 86400000 }); }
async function tokens(user, req, res) { const accessToken = signAccessToken(user.id, user.role); const { token } = signRefreshToken(user.id); const p = verifyRefreshToken(token); await query('INSERT INTO refresh_tokens (token_hash,user_id,expires_at,user_agent,ip_address) VALUES (?,?,?,?,?)', [hashToken(token), user.id, new Date(p.exp * 1000), req.get('user-agent')?.slice(0, 500) ?? null, getClientIp(req)?.slice(0, 64)]); cookie(res, token); return accessToken; }
export async function register(req, res) { const d = schema.parse(req.body); if (!d.name)
    throw new HttpError(400, 'Name is required for registration'); const email = d.email.toLowerCase(); if (await one('SELECT id FROM users WHERE email=?', [email]))
    throw new HttpError(409, 'An account with this email already exists'); const hash = await bcrypt.hash(d.password, 12); const r = await query('INSERT INTO users (name,email,phone,password_hash,role,status) VALUES (?,?,?,?,\'STUDENT\',\'ACTIVE\')', [d.name, email, d.phone ?? null, hash]); const user = await one('SELECT * FROM users WHERE id=?', [Number(r.insertId)]); const accessToken = await tokens(user, req, res); res.status(201).json({ success: true, message: 'Registration successful', data: { user: pub(user), accessToken } }); }
export async function login(req, res) { const d = schema.pick({ email: true, password: true }).parse(req.body); const user = await one('SELECT * FROM users WHERE email=?', [d.email.toLowerCase()]); if (!user || !(await bcrypt.compare(d.password, user.password_hash)))
    throw new HttpError(401, 'Invalid email or password'); if (user.status !== 'ACTIVE')
    throw new HttpError(403, 'This account is not active'); const accessToken = await tokens(user, req, res); res.json({ success: true, message: 'Login successful', data: { user: pub(user), accessToken } }); }
export async function refresh(req, res) { const t = req.cookies?.[env.COOKIE_NAME]; if (!t)
    throw new HttpError(401, 'Refresh token missing'); try {
    const p = verifyRefreshToken(t);
    const row = await one('SELECT rt.id refresh_id,rt.expires_at,rt.revoked_at,u.* FROM refresh_tokens rt JOIN users u ON u.id=rt.user_id WHERE rt.token_hash=?', [hashToken(t)]);
    if (!row || row.revoked_at || new Date(row.expires_at) <= new Date() || row.status !== 'ACTIVE' || String(row.id) !== String(p.sub))
        throw new Error();
    await query('UPDATE refresh_tokens SET revoked_at=NOW() WHERE id=?', [row.refresh_id]);
    const accessToken = await tokens(row, req, res);
    res.json({ success: true, message: 'Token refreshed', data: { accessToken, user: pub(row) } });
}
catch {
    res.clearCookie(env.COOKIE_NAME, { path: '/api/auth' });
    throw new HttpError(401, 'Invalid or expired refresh token');
} }
export async function logout(req, res) { const t = req.cookies?.[env.COOKIE_NAME]; if (t)
    await query('UPDATE refresh_tokens SET revoked_at=NOW() WHERE token_hash=? AND revoked_at IS NULL', [hashToken(t)]); res.clearCookie(env.COOKIE_NAME, { path: '/api/auth' }); res.json({ success: true, message: 'Logged out successfully' }); }
export async function me(req, res) { const u = await one('SELECT id,name,email,phone,role,language,status,created_at FROM users WHERE id=?', [req.user.id]); if (!u)
    throw new HttpError(404, 'User not found'); res.json({ success: true, data: pub(u) }); }
//# sourceMappingURL=auth.controller.js.map