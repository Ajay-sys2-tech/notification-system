import {create, findAll, findById as findNotificationById, updateRead } from '../repository/notification.js';
import { findById } from '../repository/user.js';
import { io } from '../index.js';

export const createNotification = async ( notification) => {
    try {
        const userId = notification.userId;
        const userExists = await findById( userId );
        if(!userExists){
            return {
                error: "User does not exist"
            }
        }
        else{
            const newNotification = await create(notification);
            const userEmail = userExists.email;
            const topic = 'notification';
            io.to(userEmail).emit(topic,  { message: newNotification.message, id: newNotification._id });
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


export const getNotifications = async ( userId, page, limit ) => {
    try {
        const userExists = await findById( userId );
        if(!userExists){
            return {
                error: "User does not exist"
            }
        }
        else{
            const notifications = await findAll( userId, page, limit );
            return notifications;
        }
    } catch (error) {
        throw error;
    }
};

export const markAsRead = async ( notificationId ) => {
    try {
        const result = await updateRead( notificationId );
        if(!result){
            return ({ error: "Notification not found", status: 404});
        }
        else{
            return ({message: "Marked as read", status: 200});
        }
    } catch (error) {
        throw error;
    }
}
