const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https"); 

const Portfolio = require("../models/Portfolio");

exports.deployPortfolio = async (req, res) => {
    try {
        const { deploy, PortfolioId } = req.body;

        if (!deploy) {
            return res.status(400).json({ message: "Cloudinary ZIP file URL is required." });
        }

        // Validate the URL protocol
        if (!deploy.startsWith('https://')) {
            return res.status(400).json({ message: "Invalid URL protocol. Please use https://" });
        }

        // Download the ZIP file from Cloudinary
        const zipFileName = `${Date.now()}-${uuidv4()}.zip`;
        const zipPath = path.join(__dirname, zipFileName);

        const fileStream = fs.createWriteStream(zipPath);
        https.get(deploy, (response) => {
            response.pipe(fileStream);

            fileStream.on('finish', async () => {
                console.log("ZIP file downloaded successfully.");

                // Upload the ZIP file to Netlify
                try {
                    const deployResponse = await axios.post(
                        `https://api.netlify.com/api/v1/sites/${process.env.NETLIFY_SITE_ID}/deploys`,
                        fs.createReadStream(zipPath),
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`,
                                "Content-Type": "application/zip",
                            },
                        }
                    );

                    // Clean up local ZIP file after deployment
                    fs.unlinkSync(zipPath);

                    const PortfolioIdUpdate = await Portfolio.findByIdAndUpdate(PortfolioId,

                        {deployLink:`https://${deployResponse.data.site_id}.netlify.app`},
                        {new:true}
                    )

                    return res.status(200).json({
                        message: "Portfolio deployed successfully!",
                        deployLink: `https://${deployResponse.data.site_id}.netlify.app`,
                    });
                } catch (uploadError) {
                    console.error("Error uploading to Netlify:", uploadError);
                    return res.status(500).json({ message: "Error uploading to Netlify", error: uploadError });
                }
            });

            fileStream.on('error', (error) => {
                console.error("Error downloading ZIP file:", error);
                res.status(500).json({ message: "Error downloading ZIP file", error });
            });
        });

    } catch (error) {
        console.error("Error deploying to Netlify:", error);
        return res.status(500).json({ message: "Deployment failed", error });
    }
};


const NETLIFY_API_BASE = "https://api.netlify.com/api/v1/sites";
const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID;

exports.updatelink = async (req, res) => {
    const { newSubdomain } = req.body;

    if (!newSubdomain) {
        return res.status(400).json({ error: "New subdomain is required" });
    }

    try {
        const response = await axios.patch(
            `${NETLIFY_API_BASE}/${NETLIFY_SITE_ID}`,
            { name: newSubdomain }, // Update the site name (subdomain)
            {
                headers: {
                    Authorization: `Bearer ${NETLIFY_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json({
            message: "Subdomain updated successfully",
            newURL: `https://${newSubdomain}.netlify.app`,
            data: response.data,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to update subdomain",
            details: error.response?.data || error.message,
        });
    }
};