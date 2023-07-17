const jwt = require('jsonwebtoken');
const User = require('../models/User');

const Authentication = async (req, res, next) => {
    try {
        const token = await req.headers.get('Authorization').replace('Bearer ', '');
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id });
        if (!user) {
            return res.send(403).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (e) {
        res.status(401).json({ message: "Please Authenticate" });
    }
}