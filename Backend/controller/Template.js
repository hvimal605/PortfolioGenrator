const Template = require("../models/Template");

exports.createNewTemplate = async (req, res) => {
    try {
        const {
            name,
            description,
            previewUrl,
            supportedColors = [],
            layoutType = "Single Page",
            fields
        } = req.body;

        // Validate required fields
        if (!name || !description || !previewUrl) {
            return res.status(400).json({
                success: false,
                message: "Name, description, and preview URL are required.",
            });
        }

        if (!fields || !Array.isArray(fields) || fields.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Fields array is required and must contain at least one field.",
            });
        }

        // Validate layoutType
        const validLayoutTypes = ["Single Page", "Multi Page", "Dark Theme", "Light Theme", "Minimal"];
        if (!validLayoutTypes.includes(layoutType)) {
            return res.status(400).json({
                success: false,
                message: `Invalid layout type. Supported values are: ${validLayoutTypes.join(", ")}.`,
            });
        }

        // Create new template
        const newTemplate = new Template({
            name,
            description,
            previewUrl,
            supportedColors,
            layoutType,
            fields,
        });

        const savedTemplate = await newTemplate.save();

        // Success response
        return res.status(201).json({
            success: true,
            message: "Template created successfully.",
            template: savedTemplate,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
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

