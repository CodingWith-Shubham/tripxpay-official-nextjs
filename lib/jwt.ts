import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret';

// ✅ Accept any object type
export function signJWT<T extends object>(payload: T, expiresIn: string = '1h'): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// ✅ Return decoded payload as type T or null
export function verifyJWT<T extends object>(token: string): T | null {
  try {
    return jwt.verify(token, SECRET_KEY) as T;
  } catch (err) {
    return null;
  }
}
