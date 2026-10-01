import { query } from '../config/db.js';
export function health(_req, res) { res.json({ success: true, service: 'build-future-tourism-api', message: 'Build Future Tourism API is running', timestamp: new Date().toISOString() }); }
export async function databaseHealth(_req, res) { try {
    await query('SELECT 1');
    res.json({ success: true, database: 'connected', timestamp: new Date().toISOString() });
}
catch {
    res.status(503).json({ success: false, database: 'unavailable' });
} }
//# sourceMappingURL=health.controller.js.map