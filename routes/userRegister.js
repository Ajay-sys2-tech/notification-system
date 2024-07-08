import express from 'express';
import {validationResult} from 'express-validator';
import { createUser, findUser, updateUser } from '../services/user.js';
import { userDetailsValidator } from '../middlewares/validators.js';

const router = express.Router();

router.post("/", userDetailsValidator, async (req, res) => {
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
        res.status(400).json({error: 'Unexpected error'});
    }
});

export default router;