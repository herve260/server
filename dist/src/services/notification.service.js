import nodemailer from 'nodemailer';
import { query, one } from '../config/db.js';
import { env } from '../config/env.js';
export async function createNotification(userId, title, message, type = 'GENERAL') { const r = await one('INSERT INTO notifications (user_id,title,message,type) VALUES (?,?,?,?)', [userId, title, message, type]); return { id: r?.insertId, userId, title, message, type }; }
export async function sendOptionalEmail(to, subject, text) { if (!to || !env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD || !env.EMAIL_FROM)
    return false; try {
    const t = nodemailer.createTransport({ host: env.SMTP_HOST, port: env.SMTP_PORT, secure: env.SMTP_PORT === 465, auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } });
    await t.sendMail({ from: env.EMAIL_FROM, to, subject, text });
    return true;
}
catch (e) {
    console.warn('Optional email failed', e);
    return false;
} }
export async function listUserNotifications(userId) { return query('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 50', [userId]); }
//# sourceMappingURL=notification.service.js.map