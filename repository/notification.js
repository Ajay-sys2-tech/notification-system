import Notification from '../models/Notification.js';
import User from '../models/User.js'
// import { findById } from './user.js';

export const create = async ( notification ) => {
    try {
        const newNotification =  await Notification.create(notification);
        return newNotification;
    } catch (error) {
        throw error;
    }
};


export const findAll = async ( userId ) => {
    try {
        const notifications = await Notification.find({ userId: userId });
        return notifications;
    } catch (error) {
        throw error;
    }
}

export const findById = async ( notificationId ) => {
    try {
        const notification = await Notification.findById( notificationId );
        console.log(notification);
        return notification;
    } catch (error) {
        throw error;
    }
}

