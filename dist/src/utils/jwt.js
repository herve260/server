import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export function signAccessToken(userId, role) {
    return jwt.sign({ sub: String(userId), role, type: "access" }, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN
    });
}
export function signRefreshToken(userId) {
    const jti = crypto.randomUUID();
    const token = jwt.sign({ sub: String(userId), jti, type: "refresh" }, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN
    });
    return { token, jti };
}
export function verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
}
export function verifyRefreshToken(token) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
}
export function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}
export function getClientIp(req) {
    return req.ip ?? req.socket.remoteAddress ?? null;
}
//# sourceMappingURL=jwt.js.map