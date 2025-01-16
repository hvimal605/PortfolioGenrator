const Portfolio = require("../models/Portfolio");
const softwareApplication = require("../models/softwareApplication");
const { uploadImageToCloudinary } = require("../utils/imageUploadToCloudinary");
const cloudinary = require("cloudinary")




exports.addNewApplication = async (req, res) => {
    try {
        if (!req.files || !req.files.svg) {
            return res.status(400).json({
                success: false,
                message: "SVG is required!"
            });
        }

        const { svg } = req.files;
        const { name, portfolioId } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required!"
            });
        }

        const image = await uploadImageToCloudinary(
            svg,
            process.env.FOLDER_NAME,
            1000,
            1000
        );

        const softwareApplicationRes = await softwareApplication.create({
            name,
            svg: {
                public_id: image.public_id,
                url: image.secure_url,
            },
        });

        const portfolio = await Portfolio.findByIdAndUpdate(
            portfolioId,
            { $push: { softwareApplications: softwareApplicationRes._id } },
            { new: true }
        );


        res.status(201).json({
            success: true,
            message: "New Software Application Added!",
            softwareApplicationRes,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while adding a new application'
        });
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        const { applicationId , portfolioId } = req.body;
        let softwareApplicationRes = await softwareApplication.findById(applicationId);
        if (!softwareApplicationRes) {
            return res.status(400).json({
                success: false,
                message: "aleredy delete or not exist"
            });
        }
        const softwareApplicationSvgId = softwareApplicationRes.svg.public_id;
        await cloudinary.uploader.destroy(softwareApplicationSvgId);
        await softwareApplicationRes.deleteOne();

        const portfolio = await Portfolio.findByIdAndUpdate(
            portfolioId,
            { $pull: { softwareApplications: applicationId } },
            { new: true }
        );


        res.status(200).json({
            success: true,
            message: "Software Application Deleted!",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while delteing application'
        });

    }
}


exports.getAllSoftwareApplication = async (req, res) => {
    try {
        const softwareApplicationsRes = await softwareApplication.find();
        res.status(200).json({
            success: true,
            softwareApplicationsRes,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while getall application'
        });

    }
}