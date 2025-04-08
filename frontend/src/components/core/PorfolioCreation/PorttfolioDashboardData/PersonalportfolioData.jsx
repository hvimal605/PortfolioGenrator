import { FaLinkedin, FaFacebook, FaInstagram, FaTwitter ,FaGithub} from "react-icons/fa";
import { IoIosLink } from "react-icons/io";


export const PersonalportfolioData = ({ portfolioData }) => (
  <div className="mt-6 bg-black p-6 sm:p-8 rounded-xl text-white shadow-lg border border-gray-700">
    {/* Title & Manage portfolioData Button */}
    <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-700 pb-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-200">Personal portfolioData</h2>
      <button className="mt-3 sm:mt-0 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">
        Manage portfolioData
      </button>
    </div>

    {/* Profile Section */}
    <div className="grid sm:grid-cols-3 gap-6 items-center mt-6">
      {/* Profile Picture */}
      <div className="flex justify-center sm:justify-start">
        <img
          src={portfolioData.profileImage}
          alt="Profile"
          className="w-36 h-36 sm:w-44 sm:h-44 object-cover border-4 border-gray-600 shadow-md rounded-full"
        />
      </div>

      {/* portfolioData Section */}
      <div className="text-center sm:text-left space-y-2">
        <p className="text-lg">
          <strong className="text-gray-400">Name:</strong> {portfolioData.FirstName} {portfolioData.LastName}
        </p>
        <p className="text-lg">
          <strong className="text-gray-400">Email:</strong>
          <a href={`mailto:${portfolioData.contactDetails.email}`} className="text-blue-400 hover:underline ml-1">{portfolioData.contactDetails.email}</a>
        </p>
        <p className="text-lg">
          <strong className="text-gray-400">Phone:</strong>
          <a href={`tel:${portfolioData.contactDetails.phone}`} className="text-blue-400 hover:underline ml-1">{portfolioData.contactDetails.phone}</a>
        </p>
        <p className="text-lg">
          <strong className="text-gray-400">Resume:</strong>
          <a href={portfolioData.resume} download className="text-blue-400 hover:underline ml-1">Download</a>
        </p>
      </div>

      {/* Resume Preview */}
      <div className="flex justify-center sm:justify-start">
        <img
          src={portfolioData.resume}
          alt="Resume Preview"
          className="w-36 sm:w-44 border border-gray-700 rounded-lg shadow-md"
        />
      </div>
    </div>

    {/* Social Links */}
    <div className="mt-6">
      <h3 className="text-xl  sm:text-start text-center font-semibold text-gray-200 border-b border-gray-700 pb-2">Social Links</h3>
      <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4 text-xl">
        {portfolioData.socialLinks.linkedIn
          && (
            <a href={portfolioData.socialLinks.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500 hover:underline">
              <FaLinkedin /> LinkedIn
            </a>
          )}
        {portfolioData.socialLinks.github && (
          <a href={portfolioData.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500 hover:underline">
            <FaGithub /> Github
          </a>
        )}
        
        {portfolioData.socialLinks.twitter && (
          <a href={portfolioData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-300 hover:underline">
            <FaTwitter /> Twitter
          </a>
        )}
        {portfolioData.socialLinks.personalWebsite && (
          <a href={portfolioData.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-pink-500 hover:underline">
            <IoIosLink />Website
          </a>
        )}
      </div>
    </div>
  </div>
);