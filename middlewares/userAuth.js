import jwt from 'jsonwebtoken';
// import { getUserById } from '../repository/userRepo.js';
import 'dotenv/config';

export const verifyUser = async (req, res, next) => {
    const {authorization} = req.headers;
    const token = authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({error: 'Unauthenitcated'});
        return
    } 

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload) {
          req['user'] = {
            id: payload.id,
            email: payload.email,
            role: payload.role
          };
          next()
        } else {
            res.status(403).json({error: 'You are not authorized'});
        }
      } catch (err) {
        console.log('Error ', err)
        res.status(401).json({error: 'You are not authorized'});
      }
     
}


export const verifAdmin = async (req, res, next) => {
    const {authorization} = req.headers;
    const token = authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({error: 'Unauthenitcated'});
        return
    } 

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.role === 'admin') {
          req['user'] = {
            id: payload.id,
            email: payload.email,
            role: payload.role
          };
          next()
        } else {
            res.status(403).json({error: 'You are not authorized'});
        }
      } catch (err) {
        console.log('Error ', err)
        res.status(401).json({error: 'You are not authorized'});
      }
     
}