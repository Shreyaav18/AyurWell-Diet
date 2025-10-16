import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';


const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';


export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET
  ); 
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

