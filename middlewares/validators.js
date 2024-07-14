import { check, body, validationResult } from 'express-validator';


export const userRegisterValidator = [
    body('username', 'Invalid, should not be Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'The minimum password length is 5 characters').isLength({min: 5}),
];


export const userLoginValidator = [
    body('email', 'Invalid email').isEmail(),
    body('password', 'The minimum password length is 5 characters').isLength({min: 5}),
];


export const messageValidator = [
    body('userId', 'Invalid, should not be Empty').not().isEmpty(),
    body('message', 'Invalid, should be more than 2 characters long').isLength({min: 2}),
];

