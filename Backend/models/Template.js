const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
  },
  description: {
    type: String,
    required: true, 
  },
  previewUrl: {
    type: String, 
    required: true,
  },
  // previewImage:{
  //   type: String, 
  //   required: true,

  // },
  supportedColors: {
    type: [String], 
    default: [],
  },
  layoutType: {
    type: String, 
    enum: ["Single Page", "Multi Page", "Dark Theme", "Light Theme", "Minimal"],
    default: "Single Page",
  },
  TemplateLink:{
    type: String, 
    required: true,
  },
  isActive: {
    type: Boolean, 
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Template", TemplateSchema);
