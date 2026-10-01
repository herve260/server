import { verifyAccessToken } from "../utils/jwt.js";
import { HttpError } from "../utils/http-error.js";
export function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return next(new HttpError(401, "Authentication required"));
    }
    try {
        const token = header.slice(7);
        const payload = verifyAccessToken(token);
        if (payload.type !== "access")
            throw new Error("Invalid access token");
        req.user = { id: Number(payload.sub), role: payload.role };
        return next();
    }
    catch {
        return next(new HttpError(401, "Invalid or expired access token"));
    }
}
export function requireRoles(...roles) {
    return (req, _res, next) => {
        if (!req.user)
            return next(new HttpError(401, "Authentication required"));
        if (!roles.includes(req.user.role)) {
            return next(new HttpError(403, "You do not have permission to perform this action"));
        }
        return next();
    };
}
//# sourceMappingURL=auth.middleware.js.map