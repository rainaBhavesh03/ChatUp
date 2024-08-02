const express = require("express");
const router = express.Router();
const {registerUser,authUser, getUsers} = require("../controllers/userControllers");
const protect = require("../middleware/authMiddleware");



router.route("/").post(registerUser);
router.post("/login", authUser);
router.get('/',protect,getUsers);

module.exports = router;