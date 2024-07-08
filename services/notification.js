import {create, findAll, findById as findNotificationById } from '../repository/notification.js';
import { findById } from '../repository/user.js';

export const createNotification = async ( notification) => {
    try {
        console.log(notification);
        const userId = notification.userId;
        const userExists = await findById( userId );
        if(!userExists){
            return {
                error: "User does not exist"
            }
        }

        else{
            const newNotification = await create(notification);
            return newNotification;
        }

    } catch (error) {
        throw error;
    }
};

export const getNotification = async ( notificationId ) => {
    try {
        const notification = await findNotificationById( notificationId );
        if(!notification){
            return {
                error: "Invalid notification id"
            }
        }

        else {
            return notification;
        }
    } catch (error) {
        throw error;   
    }
}


export const getNotifications = async ( userId ) => {
    try {
        const userExists = await findById( userId );
        console.log("services", userExists);
        if(!userExists){
            return {
                error: "User does not exist"
            }
        }
        else{
            const notifications = await findAll( userId );
            return notifications;
        }
    } catch (error) {
        throw error;
    }
}
