import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, 'secret123', 
        {
            expiresIn: '30d',
        });

        // decomposition to remove passwordHash out of data, because we don't need it in Database
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Could not register',
        })
    }
};

export const login = async (req, res) => {
    try {
        // check user already exist in our db
        const user = await UserModel.findOne({email: req.body.email});
        if(!user) {
            return res.status(404).json({
                message: 'User is not found',
            });
        }

        // check if user entered password matches with password in our DB
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if(!isValidPass) {
            return res.status(404).json({
                message: 'Login or password incorrect',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123', 
            {
                expiresIn: '30d',
            },
        );

        // decomposition to remove passwordHash out of data, because we don't need it in Database
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token,
        });        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Could not login',
        })
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if(!user) {
            return res.status(404).json({
                message: 'User is not found',
            })
        }

        // decomposition to remove passwordHash out of data, because we don't need it in Database
        const {passwordHash, ...userData} = user._doc;
        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'No access',
        })
    }
};