import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { HttpError } from '../utils/http-error.js';

const uploadDir = path.resolve('uploads');
const cvDir = path.join(uploadDir, 'cvs');
const destinationDir = path.join(uploadDir, 'destinations');
fs.mkdirSync(cvDir, { recursive: true });
fs.mkdirSync(destinationDir, { recursive: true });

const cvAllowed = new Set(['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
const imageAllowed = new Set(['image/jpeg','image/png','image/webp']);

export const cvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, cvAllowed.has(file.mimetype))
});

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, destinationDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  }
});

export const destinationImageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!imageAllowed.has(file.mimetype)) return cb(new HttpError(400, 'Images must be JPG, PNG, or WebP'));
    cb(null, true);
  }
});
