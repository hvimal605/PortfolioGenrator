const Portfolio = require("../models/Portfolio");
const Template = require("../models/Template");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploadToCloudinary");

// exports.createPortfolio = async (req, res) => {
//   try {
//     const { templateId } = req.body;
//     const userId = req.user.id;

//     if (!userId || !templateId) {
//       return res.status(400).json({
//         success: false,
//         message: "All required fields must be provided.",
//       });
//     }

//     // Check if the provided templateId exists
//     const templateIdExist = await Template.findById(templateId);
//     if (!templateIdExist) {
//       return res.status(400).json({
//         success: false,
//         message: "Template not found."
//       });
//     }

//     // Create the portfolio with default values
//     const portfolio = await Portfolio.create({
//       userId,
//       templateId,
//       deployLink: "", // Default deploy link
//       profileImage: "", // Default profile image
//       skills: [],
//       resume: "", // Default resume
//       contactDetails: {
//         phone: "",
//         email: "", // Default email
//         address: "",
//       },
//       socialLinks: {
//         linkedIn: "",
//         github: "",
//         twitter: "",
//         personalWebsite: "",
//       },
//       projects: [],
//       softwareApplications: [],
//       timeline: [],
//     });

//     res.status(201).json({
//       success: true,
//       message: "Portfolio created successfully!",
//       portfolio,
//     });
//   } catch (error) {
//     console.error("Error creating portfolio:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating portfolio.",
//     });
//   }
// };




// exports.addPortfolioDetails = async (req, res) => {
//   try {
//     // Validate file uploads
//     // if (!req.files || Object.keys(req.files).length === 0) {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "Profile image and resume are required!",
//     //   });
//     // }

//     const avatar = req.files.avatar;
//     if(!avatar ){
//       return res.status(400).json({
//         success: false,
//         message: "Please provide avatar",
//       });
//     }
    
//     const resume = req.files.resume;
//     if(!resume ){
//       return res.status(400).json({
//         success: false,
//         message: "Please provide resume",
//       });
//     }
//     // Validate required fields from body
//     const { portfolioId,FirstName,LastName, phone, email, address, linkedIn, github, twitter, personalWebsite } = req.body;

//     if (!portfolioId || !email || !phone || !address) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required details: portfolioId, email, phone, and address.",
//       });
//     }

//     // Upload profile image to Cloudinary
//     const profileImageUpload = await uploadImageToCloudinary(
//       avatar,
//       process.env.FOLDER_NAME,
//       1000,
//       1000
//     );

//     // Upload resume to Cloudinary
//     const resumeUpload = await uploadImageToCloudinary(
//       resume,
//       process.env.FOLDER_NAME
//     );

//     const updatedPortfolio = await Portfolio.findByIdAndUpdate(
//       portfolioId,
//       {
//         profileImage: profileImageUpload.secure_url,
//         resume: resumeUpload.secure_url,
//         FirstName:FirstName,
//         LastName:LastName,
//         contactDetails: {
//           phone,
//           email,
//           address,
//         },
//         socialLinks: {
//           linkedIn,
//           github,
//           twitter,
//           personalWebsite,
//         },
//       },
//       { new: true }
//     );

//     if (!updatedPortfolio) {
//       return res.status(404).json({
//         success: false,
//         message: "Portfolio not found!",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Portfolio details updated successfully!",
//       portfolio: updatedPortfolio,
//     });
//   } catch (error) {
//     console.error("Error in updatePortfolioDetails:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error. Please try again later.",
//     });
//   }
// };

const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 4);

const generateUniqueSlug = async (FirstName) => {
  let slug;
  let isUnique = false;

  while (!isUnique) {
    const baseSlug = FirstName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    slug = `${baseSlug}-${nanoid()}`;

    // Check if slug already exists in the database
    const existingPortfolio = await Portfolio.findOne({ slug });
    if (!existingPortfolio) {
      isUnique = true; // Exit loop if slug is unique
    }
  }

  return slug;
};

exports.createPortfolio = async (req, res) => {
  try {
    const { templateId, FirstName, LastName, phone, email, address, linkedIn, github, twitter, personalWebsite } = req.body;
    const userId = req.user.id;
    
    if (!userId || !templateId || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    // Check if template exists
    const templateExists = await Template.findById(templateId);
    if (!templateExists) {
      return res.status(400).json({
        success: false,
        message: "Template not found."
      });
    }

    // Validate file uploads
    const avatar = req.files?.avatar;
    const resume = req.files?.resume;
    if (!avatar || !resume) {
      return res.status(400).json({
        success: false,
        message: "Profile image and resume are required!",
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

    // **Generate a Unique Slug**
    if (!FirstName) {
      return res.status(400).json({ success: false, message: "FirstName is required to generate slug." });
    }
    const slug = await generateUniqueSlug(FirstName);

    // Create the portfolio
    const portfolio = await Portfolio.create({
      userId,
      templateId,
      deployLink: "",
      profileImage: profileImageUpload.secure_url,
      skills: [],
      resume: resumeUpload.secure_url,
      FirstName,
      LastName,
      contactDetails: { phone, email, address },
      socialLinks: { linkedIn, github, twitter, personalWebsite },
      projects: [],
      softwareApplications: [],
      timeline: [],
      slug, // 🔥 Set the unique slug before saving
    });

    // Push portfolio to user portfolio array
    await User.findByIdAndUpdate(userId, { $push: { portfolios: portfolio._id } });

    res.status(201).json({
      success: true,
      message: "Portfolio created successfully!",
      portfolio,
    });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    res.status(500).json({
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

exports.getPortfolioBySlug = async (req, res) => {
  try {
    const { slug } = req.body; // Get slug from URL params

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    // Find portfolio by slug
    const portfolio = await Portfolio.findOne({ slug })
      .populate("userId", "email") // Populate user details if needed
      .populate("templateId") // Populate template details
      .populate("skills") // Populate skills if necessary
      .populate("projects") // Populate projects
      .populate("softwareApplications") // Populate software apps
      .populate("timeline"); // Populate timeline

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    console.error("Error fetching portfolio by slug:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

