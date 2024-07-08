import User from '../models/User.js';

export const create = async (user) => {
    try {
        const newUser = await User.create(user);
        return newUser;
    } catch (error) {
        throw error;
    }
}


export const find = async ( emailToFind ) => {
    try {
        const existingUser = await User.findOne( {email: emailToFind} );
        return existingUser;
    } catch (error) {
        throw error;
    }
}


export const findById = async ( idToFind ) => {
    try {
        const existingUser = await User.findById( idToFind );
        return existingUser;
    } catch (error) {
        throw error;
    }
}

export const update = async ( userEmailToUpdate, userFieldsToUpdate ) => {
    try {
        const updatedUser = await User.updateOne({email: userEmailToUpdate}, userFieldsToUpdate);
        return updatedUser;
    } catch (error) {
        throw error;
    }
}