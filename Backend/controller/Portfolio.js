const Portfolio = require("../models/Portfolio");
const Template = require("../models/Template");
const { uploadImageToCloudinary } = require("../utils/imageUploadToCloudinary");

exports.createPortfolio = async (req, res) => {
  try {
    const { templateId } = req.body;
    const userId = req.user.id;

    if (!userId || !templateId) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    // Check if the provided templateId exists
    const templateIdExist = await Template.findById(templateId);
    if (!templateIdExist) {
      return res.status(400).json({
        success: false,
        message: "Template not found."
      });
    }

    // Create the portfolio with default values
    const portfolio = await Portfolio.create({
      userId,
      templateId,
      deployLink: "", // Default deploy link
      profileImage: "", // Default profile image
      skills: [],
      resume: "", // Default resume
      contactDetails: {
        phone: "",
        email: "", // Default email
        address: "",
      },
      socialLinks: {
        linkedIn: "",
        github: "",
        twitter: "",
        personalWebsite: "",
      },
      projects: [],
      softwareApplications: [],
      timeline: [],
    });

    res.status(201).json({
      success: true,
      message: "Portfolio created successfully!",
      portfolio,
    });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    res.status(500).json({
      success: false,
      message: "Error creating portfolio.",
    });
  }
};




exports.addPortfolioDetails = async (req, res) => {
  try {
    // Validate file uploads
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Profile image and resume are required!",
      });
    }

    const { avatar, resume } = req.files;

    // Validate required fields from body
    const { portfolioId, phone, email, address, linkedIn, github, twitter, personalWebsite } = req.body;

    if (!portfolioId || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required details: portfolioId, email, phone, and address.",
      });
    }

    // Upload profile image to Cloudinary
    const profileImageUpload = await uploadImageToCloudinary(
      avatar,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    // Upload resume to Cloudinary
    const resumeUpload = await uploadImageToCloudinary(
      resume,
      process.env.FOLDER_NAME
    );

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      portfolioId,
      {
        profileImage: profileImageUpload.secure_url,
        resume: resumeUpload.secure_url,
        contactDetails: {
          phone,
          email,
          address,
        },
        socialLinks: {
          linkedIn,
          github,
          twitter,
          personalWebsite,
        },
      },
      { new: true }
    );

    if (!updatedPortfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Portfolio details updated successfully!",
      portfolio: updatedPortfolio,
    });
  } catch (error) {
    console.error("Error in updatePortfolioDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};


exports.getPortfolioDetailsById = async (req, res) => {
  try {
    const { portfolioId } = req.body;

    const portfolio = await Portfolio.findById(portfolioId)
      .populate("skills")
      .populate("projects")
      .populate("softwareApplications")
      .populate("timeline");

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Portfolio details fetched successfully",
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching portfolio details",
      error: error.message,
    });
  }
};
