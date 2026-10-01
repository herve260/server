import { ZodError } from 'zod';
import multer from 'multer';
import { HttpError } from '../utils/http-error.js';
export function errorHandler(error, _req, res, _next) {
    if (error instanceof ZodError) {
        res.status(400).json({ success: false, message: 'Validation failed', errors: error.issues });
        return;
    }
    if (error instanceof multer.MulterError) {
        res.status(400).json({ success: false, message: error.code === 'LIMIT_FILE_SIZE' ? 'Uploaded file is too large.' : 'Upload failed.' });
        return;
    }
    if (error instanceof HttpError) {
        res.status(error.statusCode).json({ success: false, message: error.message, details: error.details });
        return;
    }
    const code = error?.code;
    if (code === 'ER_DUP_ENTRY') {
        res.status(409).json({ success: false, message: 'A record with the same unique value already exists' });
        return;
    }
    if (code === 'ER_NO_REFERENCED_ROW_2') {
        res.status(400).json({ success: false, message: 'The referenced record does not exist' });
        return;
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
}
//# sourceMappingURL=error.middleware.js.map