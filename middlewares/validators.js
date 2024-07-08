import { check, body, validationResult } from 'express-validator';


export const userDetailsValidator = [
    body('username', 'Invalid, should not be Empty').not().isEmpty(),
    body('email', 'Invalid, should not be Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
];

