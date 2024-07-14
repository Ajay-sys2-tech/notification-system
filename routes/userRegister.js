import express from 'express';
import {validationResult} from 'express-validator';
import { createUser, findUser, updateUser } from '../services/user.js';
import { userRegisterValidator } from '../middlewares/validators.js';

const router = express.Router();

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: User Registration
 *     description: Registers a new user with username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: securepassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *       400:
 *         description: Bad request, user already exists or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User already exists
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
 *                         example: "email"
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

router.post("/", userRegisterValidator, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
    
        const { username, email, password } = req.body;
        const newUser = await createUser({username, email, password});

        if(newUser.error){
            return res.status(400).json({error: newUser.error});
        }else{ 
            return res.status(201).json(newUser);
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Unexpected error'});
    }
});

export default router;