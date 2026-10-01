import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
export async function saveCv(file) { const dir = path.resolve('uploads/cvs'); await fs.mkdir(dir, { recursive: true }); const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-'); const name = `${Date.now()}-${crypto.randomUUID()}-${safe}`; await fs.writeFile(path.join(dir, name), file.buffer); return { url: `/uploads/cvs/${name}` }; }
//# sourceMappingURL=cv.service.js.map