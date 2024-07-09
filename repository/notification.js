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


export const findAll = async ( userId, page, itemsPerPage ) => {
    try {
        const recordsToSkip = (page-1) * itemsPerPage;
        const totalRecords = await Notification.countDocuments({});
        const notifications = await Notification.find({ userId: userId }).skip(recordsToSkip).limit(itemsPerPage);
        
        return {
            notifications,
            totalRecords: totalRecords,
            totalPages: Math.ceil(totalRecords/itemsPerPage),
            recordsInCurrentPage: notifications.length,
            page: page
        };
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

export const updateRead = async ( notificationId ) => {
    try {
        const updatedNotification = Notification.findOneAndUpdate(
            { id: notificationId },
            { $set: { read: true } }, 
            { new: true } 
        );

        return updatedNotification;

    } catch (error) {
        throw error;
    }
}

