const { v4: uuidv4 } = require("uuid"); // Import UUID package
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https"); // To handle downloading files over HTTPS

exports.deployPortfolio = async (req, res) => {
    try {
        const { deploy } = req.body; // Get Cloudinary ZIP file URL from request body
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
