import {body} from 'express-validator';

export const loginValidation = [
    body('email', 'Email format is incorrect').isEmail(),
    body('password', 'Password should contain atleast 5 symbols').isLength({min: 5}),
];

export const registerValidation = [
    body('email', 'Email format is incorrect').isEmail(),
    body('password', 'Password should contain atleast 5 symbols').isLength({min: 5}),
    body('fullName', 'Write a name').isLength({min: 3}),
    body('avatarUrl', 'Avatar link is incorrect').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Write articles header').isLength({min: 3}).isString(),
    body('text', 'Write articles text').isLength({min: 5}).isString(),
    body('tags', 'Tags format is incorrect').optional().isString(),
    body('imageUrl', 'Incorrect link to image').optional().isString(),
];