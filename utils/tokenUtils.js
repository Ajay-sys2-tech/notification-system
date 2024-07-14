import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const createUserToken = async (user, isAdmin=false) => {
    try{
        const token = jwt.sign({
            id: user._id,
            email: user.email,
            role: isAdmin ?  'admin' : 'subscriber'

        }, process.env.JWT_SECRET);
        
        console.log(user, token);
        return token;
    }catch(error){
        console.log(error);
        throw error;
    }
};