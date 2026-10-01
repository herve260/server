import { z } from 'zod';
import { query } from '../config/db.js';
export async function listTrainingRegistrations(_req, res) { res.json({ success: true, data: await query('SELECT r.*,t.title,t.provider,u.name user_name,u.email user_email,u.phone user_phone FROM training_registrations r JOIN training_programs t ON t.id=r.training_id JOIN users u ON u.id=r.user_id ORDER BY r.registered_at DESC') }); }
export async function updateTrainingRegistrationStatus(req, res) { const s = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).parse(req.body.status); await query('UPDATE training_registrations SET status=? WHERE id=?', [s, Number(req.params.id)]); res.json({ success: true }); }
//# sourceMappingURL=admin-training-registration.controller.js.map