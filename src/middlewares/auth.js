const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

//authorization
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id:decoded._id})

        if(!user)
            throw new Error();

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send({message:'You are not authenticated !!!'});
    }
}

module.exports = auth;
