import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
export const authenticate = async (req,res,next) => { try { const token=req.headers.authorization?.split(' ')[1]; if(!token) return res.status(401).json({message:'Authentication required'}); const decoded=jwt.verify(token,process.env.JWT_SECRET); const user=await prisma.user.findUnique({where:{id:decoded.id}}); if(!user?.active) return res.status(401).json({message:'Session is no longer valid'}); req.user=user; next(); } catch { res.status(401).json({message:'Invalid or expired session'}); } };
export const authorize = (...roles) => (req,res,next) => roles.includes(req.user.role) ? next() : res.status(403).json({message:'Insufficient permission'});
