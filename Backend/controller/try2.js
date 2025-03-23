const { v4: uuidv4 } = require("uuid"); // Import UUID package
const axios = require("axios");
const fs = require("fs");
const path = require("path");

exports.createSite = async (req, res) => {
    try {
        // Generate a unique name for the site using the current timestamp
        const uniqueName = `my-new-site-${Date.now()}`;

        const response = await axios.post(
            "https://api.netlify.com/api/v1/sites",
            {
                name: uniqueName,  // Use the unique site name
                // custom_domain: "www.example.com", // Optional: Set a custom domain (if needed)
                // password: "yourpassword", // Optional: Password protect the site (if needed)
                // force_ssl: true, // Optional: Force SSL (set to true if you want SSL enabled)
                processing_settings: {
                    html: { pretty_urls: true }, // Optional: Enable pretty URLs
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`, // Replace with your Netlify access token
                },
            }
        );

        console.log("Site created successfully:", response.data);

        // Send the site data as a response to the client
        res.status(200).json({
            success: true,
            message: "Site created successfully",
            data: response.data, // Site information returned by Netlify API
        });
    } catch (error) {
        console.error("Error creating site:", error.response ? error.response.data : error.message);

        // Send an error response if the creation fails
        res.status(500).json({
            success: false,
            message: "Error creating site",
            error: error.response ? error.response.data : error.message,
            stack: error.stack, // Optionally include the error stack for more detailed debugging
        });
    }
};


exports.deployPortfolio = async (req, res) => {
    try {
        const { deploy } = req.body; // Get folder name from request body
        if (!deploy) {
            return res.status(400).json({ message: "Deployment folder name is required." });
        }

        const distFolderPath = path.join(__dirname, "..", "templates", deploy); // Dynamically set folder path
        if (!fs.existsSync(distFolderPath)) {
            return res.status(404).json({ message: `Folder '${deploy}' does not exist.` });
        }

        // Create a unique filename using Date.now() + UUID
        const zipFileName = `${Date.now()}-${uuidv4()}.zip`;
        const zipPath = path.join(__dirname, zipFileName);
        
        const archiver = require("archiver");
        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        archive.pipe(output);
        archive.directory(distFolderPath, false);
        await archive.finalize();

        // Upload the ZIP file to Netlify
        const response = await axios.post(
            `https://api.netlify.com/api/v1/sites/${process.env.NETLIFY_SITE_ID}/deploys`,
            fs.createReadStream(zipPath),
            {
                headers: {
                    Authorization: `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`,
                    "Content-Type": "application/zip",
                },
            }
        );

        // Cleanup local ZIP file
        fs.unlinkSync(zipPath);

        return res.status(200).json({
            message: "Portfolio  deployed successfully!",
          
            deployLink: `https://${response.data.site_id}.netlify.app`
        });
    } catch (error) {
        console.error("Error deploying to Netlify:", error);
        return res.status(500).json({ message: "Deployment failed", error });
    }
};
