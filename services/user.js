import bcrypt from 'bcryptjs';
import {create, find, update } from '../repository/user.js';
import { socketExporter as socket  } from '../socket/index.js';
import { joinRoom } from '../socket/socketHandler.js';


export const createUser = async ( user ) => {
    try {

        const existingUser = await findUser(user.email);
        if(existingUser){
            console.log(existingUser);
            return {
                data: "",
                message: "",
                error: "User already exists"
            };
        }

        else{
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            const newUser = await create(user);
            return newUser;
        }
    } catch (error) {
        throw error;
    }
}

export const findUser = async ( userEmailToFind ) => {
    try {
        const existingUser = await find(userEmailToFind);
        return existingUser;
    } catch (error) {
        throw error;   
    }
}


export const updateUser = async ( userEmailToUpdate, userFieldsToUpdate ) => {
    try {
        const updatedUser = await update( userEmailToUpdate, userFieldsToUpdate );
        return updatedUser; 
    } catch (error) {
        throw error;
    }
}

export const loginUser = async ( userDetails ) => {
    try {
        const userExists = await findUser(userDetails.email);

        if(!userExists){
            return {
                error: "User does not exists"
            };
        }

        else{
            const isPasswordValid = await bcrypt.compare(userDetails.password, userExists.password);
            if (!isPasswordValid) {
              return ({ error: 'Invalid email or password'});
            }
            
            await joinRoom(socket, {email: userExists.email} )
            return userExists;
        }
    } catch (error) {
        console.error('Error in loginUser:', error);
        throw error;
    }
}