import { query } from '../config/db.js';
import { HttpError } from '../utils/http-error.js';
export async function listNotifications(req, res) { res.json({ success: true, data: await query('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 50', [req.user.id]) }); }
export async function markNotificationRead(req, res) { const r = await query('UPDATE notifications SET read_at=NOW() WHERE id=? AND user_id=?', [Number(req.params.id), req.user.id]); if (!r)
    throw new HttpError(404, 'Notification not found'); res.json({ success: true, message: 'Notification marked as read' }); }
//# sourceMappingURL=notification.controller.js.map