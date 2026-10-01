import { one, query } from '../config/db.js';
export async function listInternships(req, res) { const s = String(req.query.search ?? req.query.q ?? '').trim(); const type = String(req.query.type ?? '').trim(); let sql = 'SELECT * FROM internships WHERE status=\'PUBLISHED\''; const p = []; if (s) {
    sql += ' AND (title LIKE ? OR company_name LIKE ? OR location LIKE ? OR description LIKE ?)';
    p.push(`%${s}%`, `%${s}%`, `%${s}%`, `%${s}%`);
} sql += ' ORDER BY created_at DESC'; const rows = await query(sql, p); res.json({ success: true, data: rows.map(x => ({ ...x, companyName: x.company_name, contactEmail: x.contact_email, registrationFee: Number(x.registration_fee || 0), paymentNote: x.payment_note })) }); }
export async function getInternship(req, res) { const x = await one('SELECT * FROM internships WHERE id=? AND status=\'PUBLISHED\'', [Number(req.params.id)]); if (!x)
    return res.status(404).json({ success: false, message: 'Internship not found' }); res.json({ success: true, data: { ...x, companyName: x.company_name, registrationFee: Number(x.registration_fee || 0), paymentNote: x.payment_note } }); }
//# sourceMappingURL=internship.controller.js.map