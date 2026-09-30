import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import type { Request } from "express";
import { env } from "../config/env.js";

export type AccessTokenPayload = {
  sub: string;
  role: string;
  type: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  jti: string;
  type: "refresh";
  exp?: number;
};

export function signAccessToken(userId: number, role: string) {
  return jwt.sign({ sub: String(userId), role, type: "access" }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  });
}

export function signRefreshToken(userId: number) {
  const jti = crypto.randomUUID();
  const token = jwt.sign({ sub: String(userId), jti, type: "refresh" }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  });
  return { token, jti };
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getClientIp(req: Request) {
  return req.ip ?? req.socket.remoteAddress ?? null;
}
