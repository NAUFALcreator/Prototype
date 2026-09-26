import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const COOKIE_NAME = "ck_session";

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

export function createToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export function setSessionCookie(res, token) {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    sameSite: "lax",
  });
}

export function clearSessionCookie(res) {
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export function getUserFromRequest(req) {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return null;
  return verifyToken(cookie);
}

export { COOKIE_NAME };
