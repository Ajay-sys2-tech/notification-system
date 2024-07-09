import express from 'express';
import {validationResult} from 'express-validator';
import { loginUser } from '../services/user.js';
import { userDetailsValidator } from '../middlewares/validators.js';
import { io } from '../index.js';

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        // const errors = validationResult(req);

        // if (!errors.isEmpty()) {
        //     return res.status(422).json({errors: errors.array()});
        // }
    
        const { email, password } = req.body;
        const loggedInUser = await loginUser({ email, password});

        if(loggedInUser.error){
            return res.status(400).json({error: loggedInUser.error});
        }else{            
            // io.on('connection', (socket) => {
            //     console.log('a user connected');

            //     socket.on('disconnect', () => {
            //         console.log('User disconnected:', socket.id);
            //     });
            // });
            return res.status(200).json(loggedInUser);
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({error: 'Unexpected error'});
    }
});

export default router;
