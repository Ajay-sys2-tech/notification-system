import express from 'express';
import {validationResult} from 'express-validator';
import { messageValidator } from '../middlewares/validators.js';
import { verifyUser, verifAdmin } from '../middlewares/userAuth.js';
import { createNotification, getNotification, getNotifications, markAsRead  } from '../services/notification.js';
import { io } from '../index.js';

const router = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a Notification
 *     description: Creates a new notification for a specified user.
 *     security:
 *       - bearerAuth: []  # Assuming you have some form of authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d5ec49f8d3b27c9c0fbc2f"
 *               message:
 *                 type: string
 *                 example: "This is a notification message."
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notification:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "60d5ec49f8d3b27c9c0fbc2f"
 *                     message:
 *                       type: string
 *                       example: "This is a notification message."
 *                 message:
 *                   type: string
 *                   example: "Notification created successfully"
 *       400:
 *         description: Bad request, error creating notification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error creating notification"
 *       422:
 *         description: Unprocessable entity due to validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         example: "userId"
 *                       location:
 *                         type: string
 *                         example: "body"
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unexpected error"
 */
router.post("/", verifAdmin, messageValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

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

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get a Notification by ID
 *     description: Retrieves a specific notification using its ID.
 *     security:
 *       - bearerAuth: []  # Assuming authentication is required
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the notification to retrieve
 *         schema:
 *           type: string
 *           example: "60d5ec49f8d3b27c9c0fbc2f"
 *     responses:
 *       200:
 *         description: Notification retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notification:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d5ec49f8d3b27c9c0fbc2f"
 *                     userId:
 *                       type: string
 *                       example: "60d5ec49f8d3b27c9c0fbc2f"
 *                     message:
 *                       type: string
 *                       example: "This is a notification message."
 *       404:
 *         description: Notification not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Notification not found"
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unexpected error"
 */

router.get("/:id", verifyUser, async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await getNotification( id );
        if(notification.error){
            return res.status(404).json(notification.error);
        }
        else{
            return res.status(200).json({notification : notification});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Unexpected error'});
    }
});

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get Notifications
 *     description: Retrieves a list of notifications for the authenticated user, with pagination support.
 *     security:
 *       - bearerAuth: []  # Assuming authentication is required
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number for pagination
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: The number of notifications to return per page
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "60d5ec49f8d3b27c9c0fbc2f"
 *                       userId:
 *                         type: string
 *                         example: "60d5ec49f8d3b27c9c0fbc2f"
 *                       message:
 *                         type: string
 *                         example: "This is a notification message."
 *                       read:
 *                         type: boolean
 *                         example: false
 *                 totalRecords:
 *                   type: integer
 *                   example: 100
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *                 recordsInCurrentPage:
 *                   type: integer
 *                   example: 10
 *                 page:
 *                   type: integer
 *                   example: 1
 *        404:
 *         description: User does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User does not exist"
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unexpected error"
 */
router.get("/", verifyUser, async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const userId = req.user.id;
        const notifications = await getNotifications( userId, page, limit );
        if(notifications.error){
            return res.status(notifications.status).json({error: notifications.error});
        }
        else{
            return res.status(200).json(notifications);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Unexpected error'});
    }
});


/**
 * @swagger
 * /api/notifications/{id}:
 *   put:
 *     summary: Mark Notification as Read
 *     description: Marks a specific notification as read by its ID.
 *     security:
 *       - bearerAuth: []  # Assuming authentication is required
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the notification to mark as read
 *         schema:
 *           type: string
 *           example: "60d5ec49f8d3b27c9c0fbc2f"
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification marked as read successfully"
 *       404:
 *         description: Notification not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Notification not found"
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unexpected error"
 */
router.put("/:id", verifyUser, async (req, res) => {
    try {
        const {id} = req.params;
        const updatedNotification = await markAsRead( id );
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

