const Template = require("../models/Template");

// exports.createNewTemplate = async (req, res) => {
//     try {
//         const {
//             name,
//             description,
//             previewUrl,
//             supportedColors = [],
//             layoutType = "Single Page",
//             fields
//         } = req.body;

//         // Validate required fields
//         if (!name || !description || !previewUrl) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Name, description, and preview URL are required.",
//             });
//         }

//         if (!fields || !Array.isArray(fields) || fields.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Fields array is required and must contain at least one field.",
//             });
//         }

//         // Validate layoutType
//         const validLayoutTypes = ["Single Page", "Multi Page", "Dark Theme", "Light Theme", "Minimal"];
//         if (!validLayoutTypes.includes(layoutType)) {
//             return res.status(400).json({
//                 success: false,
//                 message: `Invalid layout type. Supported values are: ${validLayoutTypes.join(", ")}.`,
//             });
//         }

//         // Create new template
//         const newTemplate = new Template({
//             name,
//             description,
//             previewUrl,
//             supportedColors,
//             layoutType,
//             fields,
//         });

//         const savedTemplate = await newTemplate.save();

//         // Success response
//         return res.status(201).json({
//             success: true,
//             message: "Template created successfully.",
//             template: savedTemplate,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to create template. Please try again later.",
//         });
//     }
// };

const unzipper = require("unzipper");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const { uploadImageToCloudinary } = require("../utils/imageUploadToCloudinary");




//  Upload extracted files to Cloudinary
async function uploadExtractedFiles(tempDir, cloudinaryFolder) {
  const uploadedUrls = [];
  const files = fs.readdirSync(tempDir);

  for (const file of files) {
    const filePath = path.join(tempDir, file);
    if (fs.lstatSync(filePath).isFile()) {
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: "auto",
        folder: cloudinaryFolder,
      });
      uploadedUrls.push(result.secure_url);
    }
  }

  return uploadedUrls;
}

// Create a new template with uploaded ZIP file logic
exports.createNewTemplate = async (req, res) => {
  try {
    const {
      name,
      description,
      previewUrl,
      supportedColors = [],
      layoutType = "Single Page",
      CreatedBy,
      
    } = req.body;

    if (!req.files || !req.files.previewImg) {
      return res.status(400).json({
          success: false,
          message: "Template Preview  Image Required!"
      });
  }
    const { previewImg } = req.files;
    // Validate required fields
    if (!name || !description || !previewUrl) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and preview URL are required.",
      });
    }

    

    // Validate layoutType
    const validLayoutTypes = [
      "Single Page",
      "Multi Page",
      "Dark Theme",
      "Light Theme",
      "Minimal",
    ];
    if (!validLayoutTypes.includes(layoutType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid layout type. Supported values are: ${validLayoutTypes.join(
          ", "
        )}.`,
      });
    }

    // Check if a file is uploaded
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: "No ZIP file uploaded.",
      });
    }

    // Create temporary directory to extract ZIP contents
    const tempDir = path.join(__dirname, "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    // Get the uploaded file
    const uploadedFile = req.files.file;
    const zipFilePath = path.join(tempDir, "uploaded.zip");

    // Save the uploaded ZIP file to disk
    uploadedFile.mv(zipFilePath, async (err) => {
      if (err) {
        console.error("Error saving file:", err);
        return res.status(500).json({
          success: false,
          message: "Error saving ZIP file.",
        });
      }

      // Extract the ZIP contents
      fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: tempDir }))
        .promise()
        .then(async () => {
          const cloudinaryFolder = process.env.FOLDER_NAME_ZIP_FILE; 

          // Upload extracted files to Cloudinary
          const uploadedUrls = await uploadExtractedFiles(
            tempDir,
            cloudinaryFolder
          );

          // Clean up temporary files
          fs.rmSync(tempDir, { recursive: true, force: true });

          // Use the first uploaded URL as the template link
          const templateLink = uploadedUrls[0];
        
          const image = await uploadImageToCloudinary(
                      previewImg,
                      process.env.FOLDER_NAME,
                      1000,
                      10001
                  ); 
          // Create new template
          const newTemplate = new Template({
            name,
            description,
            previewUrl,
            supportedColors,
            layoutType,
            TemplateLink: templateLink,
            previewImage:image.secure_url,
            CreatedBy
          });

          const savedTemplate = await newTemplate.save();

          // Success response
          return res.status(201).json({
            success: true,
            message: "Template created successfully.",
            template: savedTemplate,
          });
        })
        .catch((error) => {
          console.error("Error extracting ZIP file:", error);
          res.status(500).json({
            success: false,
            message: "Error extracting ZIP file.",
          });
        });
    });
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create template. Please try again later.",
    });
  }
};


exports.getAllTemplates = async (req, res) => {
    try {
        const templates = await Template.find();
        return res.status(200).json({
            success: true,
            message: "Templates fetched successfully.",
            templates,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch templates.",
        });
    }
};


exports.getTemplateById = async (req, res) => {
    try {
        const { templateid } = req.body;
        const template = await Template.findById(templateid);

        if (!template) {
            return res.status(404).json({
                success: false,
                message: "Template not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Template fetched successfully.",
            template,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch template.",
        });
    }
};

exports.deleteTemplate = async (req, res) => {
    try {
        const { templateid } = req.body;
        if (!templateid) {
            return res.status(404).json({
                success: false,
                message: "Template id required.",
            });
        }

        const deletedTemplate = await Template.findByIdAndDelete(templateid);

        if (!deletedTemplate) {
            return res.status(404).json({
                success: false,
                message: "Template not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Template deleted successfully.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete template.",
        });
    }
};

exports.toggleTemplateStatus = async (req, res) => {
    try {
        const { templateId } = req.body;

        const template = await Template.findById(templateId);

        if (!template) {
            return res.status(404).json({
                success: false,
                message: "Template not found.",
            });
        }

        template.isActive = !template.isActive;
        await template.save();

        return res.status(200).json({
            success: true,
            message: `Template is now ${template.isActive ? "active" : "inactive"}.`,
            template,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to toggle template status.",
        });
    }
};

exports.updateTemplate = async (req, res) => {
    try {
        const { templateId } = req.body;
        const updates = req.body;

        const updatedTemplate = await Template.findByIdAndUpdate(templateId, updates, { new: true });

        if (!updatedTemplate) {
            return res.status(404).json({
                success: false,
                message: "Template not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Template updated successfully.",
            template: updatedTemplate,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update template.",
        });
    }
};

