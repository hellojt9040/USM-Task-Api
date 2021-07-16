const express = require('express')
const userRouter = new express.Router()
const auth = require('../middlewares/auth')
const UserController = require('../controllers/user-controller')
const { check } = require('express-validator')

//  get users
userRouter.get('/api/users', auth, UserController.getUsers)

//  logging in
userRouter.post('/api/user/login', UserController.userLogin)

//  Signup
userRouter.post('/api/user/newUser', [
    check('password')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
        .isLength({ min: 8, max: 15 }),
        check('mobile')
        .isLength({ min: 10, max: 10 })
    ],
    UserController.userSignup)

//  Signup
userRouter.delete('/api/user/:id', auth, UserController.deleteUser)



module.exports = userRouter
