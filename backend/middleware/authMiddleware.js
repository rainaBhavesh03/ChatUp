const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


const protect = expressAsyncHandler(async (req, res,next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

        try {
            token = req.headers.authorization.split(" ")[1];

            const verified = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(verified.id).select("-password");
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token in tampered");
        }
    }
    if (!token) {
        res.status(401);
        res.send("Token not found, Cannot authorize");
    }

});

module.exports = protect;