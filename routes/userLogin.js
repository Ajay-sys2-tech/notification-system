import express from 'express';
import {validationResult} from 'express-validator';
import { loginUser } from '../services/user.js';
import { userLoginValidator } from '../middlewares/validators.js';
import { io } from '../index.js';
import { createUserToken } from '../utils/tokenUtils.js';
const router = express.Router();

/**
 * @swagger
 * /:
 *   post:
 *     summary: User Login
 *     description: Logs in a user with their email and password, returning a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       400:
 *         description: Bad request, invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid email or password"
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
router.post("/", userLoginValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        const { email, password } = req.body;
        const loggedInUser = await loginUser({ email, password});
        let token ;
        if(loggedInUser.error){
            return res.status(400).json({error: loggedInUser.error});
        }else{            
            if(email === 'admin@gmail.com'){
                token = await createUserToken(loggedInUser, true);
            }else{
                token = await createUserToken(loggedInUser);
            }
            return res.status(200).json({token: token});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Unexpected error'});
    }
});

export default router;
