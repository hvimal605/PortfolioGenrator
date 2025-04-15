import { useEffect, useState } from "react";
import {
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { IoIosLink } from "react-icons/io";
import { useSelector } from "react-redux";
import { updatePortfolioDetails } from "../../../../services/operations/PortfolioApi";

export const PersonalportfolioData = ({ portfolioData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...portfolioData });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    setFormData({ ...portfolioData });
  }, [portfolioData]);

  const { portfolio } = useSelector((state) => state.portfolio);
  const portfolioId = portfolio._id;
  const { token } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("contactDetails")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contactDetails: {
          ...prev.contactDetails,
          [key]: value,
        },
      }));
    } else if (name.includes("socialLinks")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "profileImage") {
      setProfileImageFile(files[0]);
      setFormData((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(files[0]),
      }));
    }
    if (name === "resume") {
      setResumeFile(files[0]);
      setFormData((prev) => ({
        ...prev,
        resume: URL.createObjectURL(files[0]),
      }));
    }
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append("portfolioId", portfolioId);

      form.append("FirstName", formData.FirstName);
      form.append("LastName", formData.LastName);
      form.append("contactDetails.phone", formData.contactDetails.phone);
      form.append("contactDetails.email", formData.contactDetails.email);
      form.append("contactDetails.address", formData.contactDetails.address || "");
      form.append("socialLinks.linkedIn", formData.socialLinks.linkedIn || "");
      form.append("socialLinks.github", formData.socialLinks.github || "");
      form.append("socialLinks.twitter", formData.socialLinks.twitter || "");
      form.append("socialLinks.personalWebsite", formData.socialLinks.personalWebsite || "");

      if (profileImageFile) form.append("avatar", profileImageFile);
      if (resumeFile) form.append("resume", resumeFile);

      const response = await updatePortfolioDetails(form, token);

      if (response?.success) {
        setFormData(response.updatedPortfolio || formData);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating portfolio details:", error);
    }
  };

  return (
    <div className="mt-6 bg-black p-6 sm:p-8 rounded-xl text-white shadow-lg border border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-700 pb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-200">Personal Details</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="mt-3 sm:mt-0 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          {isEditing ? "Cancel" : "Manage Personal Details"}
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 items-center mt-6">
        <div className="flex flex-col items-center sm:items-start gap-3">
          <img
            src={formData.profileImage}
            alt="Profile"
            className="w-36 h-36 sm:w-44 sm:h-44 object-cover border-4 border-gray-600 shadow-md rounded-full"
          />


          {isEditing && (
            <div className="flex items-center gap-3 mt-4 border-amber-300  border p-2 rounded-xl">
              <label
                htmlFor="profileImage"
                className="flex items-center gap-2 text-white font-medium cursor-pointer"
              >
                <FaCamera className="text-gray-300 text-2xl" /> {/* Camera icon for profile image */}
                <span>Upload Profile Image</span>
              </label>
              <input
                type="file"
                accept="image/*"
                name="profileImage"
                onChange={handleFileChange}
                id="profileImage"
                className="hidden " // Hides the default input
              />
            </div>
          )}


        </div>

        <div className="text-center sm:text-left space-y-2">
          {isEditing ? (
            <>
              <input
                type="text"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleChange}
                placeholder="First Name"
                className="border p-2 rounded w-full focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="border p-2 rounded w-full focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="contactDetails.email"
                value={formData.contactDetails.email}
                onChange={handleChange}
                placeholder="Email"
                className="border p-2 rounded w-full focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="contactDetails.phone"
                value={formData.contactDetails.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="border p-2 rounded w-full focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Moved the file input for resume here */}

            </>
          ) : (
            <>
              <p className="text-lg"><strong className="text-gray-400">Name:</strong> {formData.FirstName} {formData.LastName}</p>
              <p className="text-lg"><strong className="text-gray-400">Email:</strong>
                <a href={`mailto:${formData.contactDetails.email}`} className="text-blue-400 hover:underline ml-1">{formData.contactDetails.email}</a>
              </p>
              <p className="text-lg"><strong className="text-gray-400">Phone:</strong>
                <a href={`tel:${formData.contactDetails.phone}`} className="text-blue-400 hover:underline ml-1">{formData.contactDetails.phone}</a>
              </p>
              <p className="text-lg"><strong className="text-gray-400">Resume:</strong>
                <a href={formData.resume} download className="text-blue-400 hover:underline ml-1">Download</a>
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 justify-center sm:justify-start">
          <img
            src={formData.resume}
            alt="Resume Preview"
            className="w-36 sm:w-44 border border-gray-700 rounded-lg shadow-md"
          />
          {isEditing && (
            <div className="flex items-center gap-3 mt-4 border-amber-300   p-2 rounded-xl">
              <label
                htmlFor="resume"
                className="flex items-center gap-2 text-white font-medium cursor-pointer"
              >
                <CiImageOn className="text-gray-300 text-2xl" />
                <span>Upload Resume</span>
              </label>
              <input
                type="file"
                accept="image/*"
                name="resume"
                onChange={handleFileChange}
                id="resume"
                className="hidden" // Hides the default input
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4 text-lg w-full">
        {["linkedIn", "github", "twitter", "personalWebsite"].map((key) => {
          const icons = {
            linkedIn: <FaLinkedin className="text-blue-500" />,
            github: <FaGithub className="text-gray-200" />,
            twitter: <FaTwitter className="text-blue-300" />,
            personalWebsite: <IoIosLink className="text-pink-500" />,
          };

          return isEditing ? (
            <div key={key} className="flex items-center gap-2 w-full sm:w-1/2">
              <span>{icons[key]}</span>
              <input
                name={`socialLinks.${key}`}
                value={formData.socialLinks?.[key] || ""}
                onChange={handleChange}
                placeholder={`${key} URL`}
                className="border p-2 rounded w-full focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            formData.socialLinks?.[key] && (
              <a
                key={key}
                href={formData.socialLinks[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                {icons[key]}
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </a>
            )
          );
        })}
      </div>

      {isEditing && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};
