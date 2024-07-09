import express from 'express';
import {validationResult} from 'express-validator';
import { userDetailsValidator } from '../middlewares/validators.js';
import { createNotification, getNotification, getNotifications, markAsRead  } from '../services/notification.js';
import { io } from '../index.js';

const router = express.Router();
let count = false;

//to create a new notification for a user, push a message to the queue
router.post("/", async (req, res) => {
    try {
        const { userId, message } = req.body;
        const newNotification = await createNotification( { userId, message } );

        if(newNotification.error){
            return res.status(400).json({error: newNotification.error});
        }else{
            return res.status(201).json({
                notification: newNotification,
                message: "Notification created succesfully"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Unexpected error'});
    }
});

// get details of a specific notification
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await getNotification( id );
        return res.status(200).json({notification : notification});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Unexpected error'});
    }
});

// get the list of all notifications for the authenticated user
router.get("/", async (req, res) => {
    try {
        const  page = parseInt(req.query.page);
        const  limit = parseInt(req.query.limit);
        const userId = "668d2cb75acc36b1ec5e7218";
        const notifications = await getNotifications( userId, page, limit );
        return res.status(200).json(notifications);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Unexpected error'});
    }
});


//mark a notification as read
router.put("/:id", async (req, res) => {
    try {
        console.log("update");
        const id = req.params;
        const updatedNotification = await markAsRead( id );
        console.log(id, updatedNotification);
        if(updatedNotification.error){
            return res.status(updatedNotification.status).json({ error: updatedNotification.error});
        }
        else{
            return res.status(200).json({ message: updatedNotification.message});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Unexpected error'});
    }
});

export default router;

