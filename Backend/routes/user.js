
const express = require("express")
const { sendOTP, signup, login, changePassword } = require("../controller/Auth")
const { auth } = require("../middlewares/auth")
const { googleSignup, googleLogin } = require("../controller/googleAuth")
const router = express.Router()





router.post("/sendotp", sendOTP)
router.post("/signup", signup)
router.post("/login", login)
router.post("/changePassword", auth , changePassword)
router.post("/google-signup",googleSignup)
router.post("/google-login",googleLogin)

module.exports = router