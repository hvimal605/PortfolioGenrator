const Portfolio = require("../models/Portfolio");
const Template = require("../models/Template");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploadToCloudinary");
const getClientIp = require('request-ip'); 
const moment = require("moment");

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
const Visitor = require("../models/Visitor");
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

    const avatar = req.files?.avatar;
    const resume = req.files?.resume;
    if (!avatar || !resume) {
      return res.status(400).json({
        success: false,
        message: "Profile image and resume are required!",
      });
    }

    const profileImageUpload = await uploadImageToCloudinary(
      avatar,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    const resumeUpload = await uploadImageToCloudinary(
      resume,
      process.env.FOLDER_NAME
    );

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
      slug, 
    });

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

exports.updatePortfolioDetails = async (req, res) => {
  try {
    const {
      portfolioId,
      FirstName,
      LastName,
      phone,
      email,
      address,
      linkedIn,
      github,
      twitter,
      personalWebsite,
    } = req.body;

    if (!portfolioId) {
      return res.status(400).json({
        success: false,
        message: "Portfolio ID is required.",
      });
    }

    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found.",
      });
    }

    // Handle optional file uploads
    const avatar = req.files?.avatar;
    const resume = req.files?.resume;

    let profileImageUrl = portfolio.profileImage;
    let resumeUrl = portfolio.resume;

    if (avatar) {
      const profileImageUpload = await uploadImageToCloudinary(
        avatar,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      profileImageUrl = profileImageUpload.secure_url;
    }

    if (resume) {
      const resumeUpload = await uploadImageToCloudinary(
        resume,
        process.env.FOLDER_NAME
      );
      resumeUrl = resumeUpload.secure_url;
    }

    // Update portfolio fields
    portfolio.FirstName = FirstName || portfolio.FirstName;
    portfolio.LastName = LastName || portfolio.LastName;
    portfolio.profileImage = profileImageUrl;
    portfolio.resume = resumeUrl;
    portfolio.contactDetails = {
      phone: phone || portfolio.contactDetails.phone,
      email: email || portfolio.contactDetails.email,
      address: address || portfolio.contactDetails.address,
    };
    portfolio.socialLinks = {
      linkedIn: linkedIn || portfolio.socialLinks.linkedIn,
      github: github || portfolio.socialLinks.github,
      twitter: twitter || portfolio.socialLinks.twitter,
      personalWebsite: personalWebsite || portfolio.socialLinks.personalWebsite,
    };

    await portfolio.save();

    res.status(200).json({
      success: true,
      message: "Portfolio updated successfully!",
      portfolio,
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);
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



exports.getPortfoliosForUser = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not logged in.",
      });
    }

    // Fetch portfolios of the logged-in user
    const portfolios = await Portfolio.find({ userId });

    const total = portfolios.length;

    // Prepare output with essential info (add templateId too!)
    const portfolioList = portfolios.map((p) => ({
      portfolioId: p._id,
      createdAt: p.createdAt,
      templateId: p.templateId, // include this
      ...(p.deployLink && { deployLink: p.deployLink }), // include only if exists
    }));

    const completed = portfolioList.filter((p) => p.deployLink).length;
    const pending = total - completed;

    res.status(200).json({
      success: true,
      message: "Portfolios successfully fetched.",
      userId,
      totalPortfolios: total,
      completed,
      pending,
      portfolios: portfolioList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};





// exports.trackVisitofPortfolio = async (req, res) => {
//   try {
//     const { slug } = req.body; 
//      if(!slug){
//       return res.status(400).json({ success: false, message: "slug is required " });
//      }
//     const ip = getClientIp.getClientIp(req);

//     const portfolio = await Portfolio.findOne({ slug });

//     if (!portfolio) {
//       return res.status(404).json({ success: false, message: "Portfolio not found" });
//     }

//     const alreadyVisited = portfolio.visitors.some(visitor => visitor.ip === ip);

//     // Always increase totalVisitors
//     portfolio.totalVisitors += 1;

//     // If new IP, increase uniqueVisitors
//     if (!alreadyVisited) {
//       portfolio.uniqueVisitors += 1;
//       portfolio.visitors.push({ ip });
//     }

//     await portfolio.save();

//     res.status(200).json({ success: true, message: "Visit tracked" });
//   } catch (error) {
//     console.error("Track Visit Error:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };



exports.trackVisitofPortfolio = async (req, res) => {
  const { slug } = req.body;
  const ip = req.ip;

  try {
    const portfolio = await Portfolio.findOne({ slug });
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    // Check if IP is already counted for unique visitors
    const alreadyVisited = await Visitor.findOne({
      portfolioId: portfolio._id,
      ip
    });

    // Always record the visit
    await Visitor.create({ portfolioId: portfolio._id, ip });

    // If new IP, update unique count
    if (!alreadyVisited) {
      portfolio.uniqueVisitors += 1;
    }

    portfolio.totalVisitors += 1;
    await portfolio.save();

    res.status(200).json({ success: true, message: "Visit tracked" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};





exports.getVisitorStats = async (req, res) => {
  try {
    const { portfolioId } = req.body;

    // 1. Validate Portfolio
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }

    // 2. Fetch all visitors
    const visitors = await Visitor.find({ portfolioId });

    // 3. Total & Unique
    const totalVisitors = visitors.length;
    const uniqueIPs = new Set(visitors.map(v => v.ip));
    const uniqueVisitors = uniqueIPs.size;

    // 4. Weekly Stats (last 7 days)
    const oneWeekAgo = moment().subtract(7, "days").toDate();
    const last7Days = visitors.filter(visitor => new Date(visitor.timestamp) >= oneWeekAgo);

    // 5. Daily Grouped Stats (for charting)
    const dailyStats = {};

    visitors.forEach(visitor => {
      const dateKey = moment(visitor.timestamp).format("YYYY-MM-DD");
      if (!dailyStats[dateKey]) dailyStats[dateKey] = 0;
      dailyStats[dateKey]++;
    });

    res.status(200).json({
      success: true,
      message: "Visitor stats fetched successfully.",
      totalVisitors,
      uniqueVisitors,
      last7DaysCount: last7Days.length,
      dailyBreakdown: dailyStats 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getallstats=  async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ accountType: "User" });
    const totalDevelopers = await User.countDocuments({ accountType: "Developer" });
    const totalTemplates = await Template.countDocuments();
    const deployedPortfolios = await Portfolio.countDocuments({
      deployLink: { $exists: true, $ne: null, $ne: "" },
    });
    

    return res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        totalUsers,
        totalDevelopers,
        totalTemplates,
        deployedPortfolios,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

exports.getMonthlyUserDeveloperPortfolioStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // Monthly User count (accountType: User)
    const monthlyUsers = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
          accountType: "User",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Monthly Developer count (accountType: Developer)
    const monthlyDevelopers = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
          accountType: "Developer",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Monthly fully-created portfolios (having deployLink)
    const monthlyPortfolios = await Portfolio.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
          deployLink: { $exists: true, $ne: null, $ne: "" },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Combine all in a single response
    const result = Array.from({ length: 12 }, (_, i) => {
      const monthIndex = i + 1;

      const userEntry = monthlyUsers.find((u) => u._id === monthIndex);
      const devEntry = monthlyDevelopers.find((d) => d._id === monthIndex);
      const portfolioEntry = monthlyPortfolios.find((p) => p._id === monthIndex);

      return {
        month: new Date(currentYear, i).toLocaleString("default", { month: "short" }),
        users: userEntry ? userEntry.count : 0,
        developers: devEntry ? devEntry.count : 0,
        portfolios: portfolioEntry ? portfolioEntry.count : 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Monthly stats fetched successfully",
      data: result,
    });
  } catch (err) {
    console.error("MONTHLY_STATS_FETCH_ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch monthly stats",
    });
  }
};


