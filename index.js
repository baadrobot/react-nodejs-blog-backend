import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';
import {registerValidation, loginValidation, postCreateValidation} from './validations.js';
import {handleValidationErrors, checkAuth} from './utils/index.js';
import {UserController, PostController} from './controllers/index.js'


mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('DB ok!'))
    .catch((err) => console.log('DB error', err));

const app = express();

// images storage
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if(!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());

// express needs to understand that it have to look for static file in localstorage
// if there is an "uploads" in request
app.use('/uploads', express.static('uploads'));

// user authorisation
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
// user registration
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
// user info
app.get('/auth/me', checkAuth, UserController.getMe)
// image upload
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/tags', PostController.getLastTags);

// requests for posts managing
app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);


app.listen(proccess.env.PORT || 4444, (err) => {
    if(err) {
        return console.log(err);
    }

    console.log('Server OK!');
});