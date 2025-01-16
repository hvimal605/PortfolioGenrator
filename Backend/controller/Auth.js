const otpGenerrator = require('otp-generator')
const OTP = require("../models/otp");
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const mailSender = require('../utils/mailSender');
require("dotenv").config()

//sendOTP
exports.sendOTP = async (req, res) => {

    try {
        const { email } = req.body;

        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            })
        }
        var otp = otpGenerrator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        console.log("otp generated", otp);


        const result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerrator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            })
            result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp };

        //create an entry for otp
        const otpBody = await OTP.create(otpPayload)
        console.log(otpBody);

        //return response successful
        res.status(200).json({
            success: true,
            message: "OTP Sent Successfully",
            otp,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
};


exports.signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp,

        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp || !accountType) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match. Please try again.",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already registered",
            });
        }

        // Validate OTP
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (recentOtp.length === 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        } else if (otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }



        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);



        // Create user entry in the database
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
};


exports.login = async (req, res) => {
    try {
        //get data from req body
        const { email, password } = req.body;

        //validation data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required, please try again",

            })
        }
        //user check exist or not 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user is not registered , please signup first"
            })
        }
        //generate JWT ,after password matching
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h'
            })
            user.token = token;
            user.password = undefined;


            //create cookie and send response
            const Options = {
                expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, Options).status(200).json({
                success: true,
                token,
                user,
                message: 'logged in successfully',
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            })
        }



    }

    catch (error) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Login Faliure ,Please try again',
        })
    }

}

exports.changePassword = async (req, res) => {
    try {
        const userDetails = await User.findById(req.user.id)


        const { oldPassword, newPassword } = req.body


        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        )
        if (!isPasswordMatch) {
            return res
                .status(401)
                .json({ success: false, message: "The password is incorrect" })
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10)
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        )

        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Password for your account has been updated",

                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`

            )
            console.log("Email sent successfully:", emailResponse.response)
        } catch (error) {

            console.error("Error occurred while sending email:", error)
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            })
        }

        return res
            .status(200)
            .json({ success: true, message: "Password updated successfully" })
    } catch (error) {

        console.error("Error occurred while updating password:", error)
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        })
    }
}
