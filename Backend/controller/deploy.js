

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Portfolio = require('../models/Portfolio'); // Assuming your portfolio model is in the models folder
const archiver = require('archiver');
const { default: mongoose } = require('mongoose');

// Route to create a new site on Netlify
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
                    Authorization: `Bearer nfp_eGf28Jk71gvDZeXzYg2fPkB9RmUigFeZe961`, // Replace with your Netlify access token
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
        const { portfolioId } = req.body;
        if (!portfolioId) {
            return res.status(404).send('portfolioId mandatory');
        }

        if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
            return res.status(400).send('Invalid portfolioId');
        }

        const portfolioData = await Portfolio.findById(portfolioId)
            .populate("skills")
            .populate("projects")
            .populate("softwareApplications")
            .populate("timeline")
            .lean();

        if (!portfolioData) {
            return res.status(404).send('Portfolio data not found');
        }

        const htmlContent = generateHTML(portfolioData);

        const publicDir = path.join(__dirname, 'public');
        const filePath = path.join(publicDir, 'index.html');
        fs.mkdirSync(publicDir, { recursive: true });

        fs.writeFileSync(filePath, htmlContent);
        console.log('HTML file generated!');

        const zipPath = path.join(publicDir, 'portfolio.zip');
        const zip = archiver('zip', { zlib: { level: 9 } });
        const output = fs.createWriteStream(zipPath);

        zip.pipe(output);
        zip.directory(publicDir, false);
        zip.finalize();

        await new Promise((resolve, reject) => {
            output.on('close', resolve);
            output.on('error', reject);
        });
        console.log('ZIP file created!');

        const siteId = await deployToNetlify(zipPath);

        // Cleanup: delete ZIP file and public folder
        fs.unlinkSync(zipPath); // Delete the ZIP file
        console.log('ZIP file deleted!');

        fs.rmdirSync(publicDir, { recursive: true }); // Delete the public folder
        console.log('Public folder deleted!');

        res.json({
            message: 'Portfolio deployed successfully!',
            deployLink: `https://${siteId}.netlify.app`,
        });
    } catch (error) {
        console.error('Error generating and deploying portfolio:', error);
        res.status(500).send('Error generating and deploying portfolio');
    }
};



// Function to generate HTML from portfolio data
function generateHTML(portfolioData) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Portfolio</title>
      <style>
        body { font-family: Arial, sans-serif; }
        .profile { text-align: center; }
        .profile img { width: 150px; border-radius: 50%; }
        .skills ul, .projects ul { list-style-type: none; padding: 0; }
      </style>
    </head>
    <body>
      <div class="profile">
        <img src="${portfolioData.profileImage}" alt="Profile Image">
        <h1>${portfolioData.userId} Portfolio</h1>
      </div>
      
      <div class="skills">
        <h2>Skills</h2>
        <ul>
          ${portfolioData.skills.map(skill => `<li>${skill}</li>`).join('')}
        </ul>
      </div>

      <div class="projects">
        <h2>Projects</h2>
        <ul>
          ${portfolioData.projects.map(project => `<li>${project}</li>`).join('')}
        </ul>
      </div>

      <div class="contact">
        <h2>Contact</h2>
        <p>Email: ${portfolioData.contactDetails.email}</p>
        <p>Phone: ${portfolioData.contactDetails.phone}</p>
      </div>

      <div class="social-links">
        <h2>Social Links</h2>
        <p><a href="${portfolioData.socialLinks.linkedIn}">LinkedIn</a></p>
        <p><a href="${portfolioData.socialLinks.github}">GitHub</a></p>
        <p><a href="${portfolioData.socialLinks.twitter}">Twitter</a></p>
      </div>
    </body>
    </html>
  `;
}

// Function to deploy the ZIP file to Netlify
async function deployToNetlify(zipPath) {
    const zipFile = fs.createReadStream(zipPath);

    // Send the ZIP file to Netlify using their API
    const response = await axios.post(
        `https://api.netlify.com/api/v1/sites/${process.env.NETLIFY_SITE_ID}/deploys`,
        zipFile,
        {
            headers: {
                'Authorization': `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`,
                'Content-Type': 'application/zip',
            },
        }
    );

    return response.data.site_id;
}
