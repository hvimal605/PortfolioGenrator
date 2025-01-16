const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        enum: ['Admin', 'User'],
        required: true,
    },
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Portfolio",
        
    },
    deployLink: {
        type: String,
        
    },
    selectedTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template",
       
    },
    image:{
        type:String,
        required:true,

    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model("User", UserSchema);
