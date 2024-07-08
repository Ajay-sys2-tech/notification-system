import express from 'express';
import {validationResult} from 'express-validator';
import { userDetailsValidator } from '../middlewares/validators.js';
import { createNotification, getNotification, getNotifications  } from '../services/notification.js';

const router = express.Router();

//to create a new notification for a user, push a message to the queue
router.post("/", async (req, res) => {
    try {
        const userId = "668c2d13054733ec1db2efed";
        const { message } = req.body;
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
        res.status(400).json({error: 'Unexpected error'});
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
        res.status(400).json({error: 'Unexpected error'});
    }
});

// get the list of all notifications for the authenticated user
router.get("/", async (req, res) => {
    try {
        const userId = "668c2d13054733ec1db2efed";
        const notifications = await getNotifications( userId );
        return res.status(200).json({notifications : notifications});
    } catch (error) {
        console.log(error);
        res.status(400).json({error: 'Unexpected error'});
    }
});


//mark a notification as read
router.put("/:id", (req, res) => {

});

export default router;

