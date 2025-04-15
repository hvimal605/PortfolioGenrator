import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { AiOutlineDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import {
  deleteSkill,
  updateSkill,
} from "../../../../services/operations/PortfolioApi";

export const Skills = ({ skills }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [localSkills, setLocalSkills] = useState([]);
  const [editedSkills, setEditedSkills] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const { portfolio } = useSelector((state) => state.portfolio);
  const portfolioId = portfolio._id;

  useEffect(() => {
    setLocalSkills(skills);
    setEditedSkills(
      skills.map((skill) => ({
        ...skill,
        newProficiency: skill.proficiency,
        newSvgFile: null,
        previewSvgUrl: skill.svg?.url || null,
      }))
    );
  }, [skills]);

  const handleProficiencyChange = (index, value) => {
    const updated = [...editedSkills];
    updated[index].newProficiency = value;
    setEditedSkills(updated);
  };

  const handleSvgChange = (index, file) => {
    const updated = [...editedSkills];
    updated[index].newSvgFile = file;
    updated[index].previewSvgUrl = URL.createObjectURL(file);
    setEditedSkills(updated);
  };

  const handleDelete = async (index, id) => {
    try {
      setLoadingIndex(index);
      const success = await deleteSkill({ skillId: id, portfolioId, token });
      if (success) {
        const updatedSkills = [...localSkills];
        updatedSkills.splice(index, 1);
        setLocalSkills(updatedSkills);

        const updatedEdited = [...editedSkills];
        updatedEdited.splice(index, 1);
        setEditedSkills(updatedEdited);
        toast.success("Skill deleted");
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill");
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleUpdate = async (index) => {
    const skill = editedSkills[index];

    // Validation
    if (
      skill.newProficiency < 0 ||
      skill.newProficiency > 100 ||
      isNaN(skill.newProficiency)
    ) {
      toast.error("Proficiency must be a number between 0 and 100");
      return;
    }

    const isUnchanged =
      skill.newProficiency === localSkills[index].proficiency &&
      !skill.newSvgFile;

    if (isUnchanged) {
      toast("No changes to update");
      return;
    }

    const formData = new FormData();
    formData.append("skillId", skill._id);
    formData.append("portfolioId", portfolioId);
    formData.append("proficiency", skill.newProficiency || 0);
    if (skill.newSvgFile) {
      formData.append("svg", skill.newSvgFile);
    }

    try {
      setLoadingIndex(index);
      const response = await updateSkill(formData, token);

      if (response?.success) {
        const updatedSkills = [...localSkills];
        updatedSkills[index].proficiency = skill.newProficiency;
        if (skill.newSvgFile) {
          updatedSkills[index].svg = {
            url: skill.previewSvgUrl,
          };
        }

        setLocalSkills(updatedSkills);

        setIsEditMode(false);
      }
    } catch (error) {
      console.error("Error updating skill:", error);
      toast.error("Failed to update skill");
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="w-full bg-black text-white p-6 rounded-xl shadow-lg border-2 border-gray-700 mt-5">
      <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-700">
        <h2 className="text-2xl font-semibold">Skill Proficiency</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? "Done" : "Manage Skills"}
        </button>
      </div>

      <div className="p-2 rounded-lg  grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {localSkills.map((skill, index) => {
          const edited = editedSkills[index];
          const isUnchanged =
            edited?.newProficiency === skill.proficiency && !edited?.newSvgFile;

          return (
            <div
              key={index}
              className="flex flex-col items-center relative group bg-[#1e293b] rounded-xl p-4 hover:scale-105 transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl"
            >
              {/* Circular Progressbar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 relative">
                <CircularProgressbar
                  value={isEditMode ? edited?.newProficiency || 0 : skill.proficiency}
                  text={`${isEditMode ? edited?.newProficiency || 0 : skill.proficiency
                    }%`}
                  styles={buildStyles({
                    textColor: "#fff",
                    pathColor: "#34d399", // Mint Green
                    trailColor: "#374151", // Dark Gray
                  })}
                />
              </div>

              {/* Skill Title */}
              <span className="mt-2 text-lg font-semibold text-center text-gray-100">
                {skill.title}
              </span>

              {isEditMode ? (
                <>
                  {/* Proficiency Input */}
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="mt-2 w-20 text-black text-sm rounded-lg px-3 py-1 bg-gray-200"
                    value={edited?.newProficiency || ""}
                    onChange={(e) => handleProficiencyChange(index, e.target.value)}
                  />

                  {/* File Input for SVG */}
                  {/* File Input for SVG */}
                  <label
                    htmlFor={`file-input-${index}`}
                    className="mt-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-all"
                  >
                    {edited?.newSvgFile ? 'Change Image' : 'Choose Image'}
                  </label>
                  <input
                    id={`file-input-${index}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleSvgChange(index, e.target.files[0])}
                  />

                  {/* SVG Preview */}
                  {edited?.previewSvgUrl && (
                    <img
                      src={edited.previewSvgUrl}
                      alt="Preview"
                      className="w-12 h-12 mt-2 object-contain rounded-lg border-2 border-gray-600"
                    />
                  )}

                  {/* Update Button */}
                  <button
                    onClick={() => handleUpdate(index)}
                    className="mt-3 text-xs bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg disabled:opacity-50 transition-all"
                    disabled={loadingIndex === index || isUnchanged}
                  >
                    {loadingIndex === index ? "Updating..." : "Update"}
                  </button>
                </>
              ) : (
                skill.svg?.url && (
                  <img
                    src={skill.svg.url}
                    alt={skill.title}
                    className="w-28 h-28 mt-2 object-contain rounded-xl border-2 border-gray-700 shadow-md"
                  />
                )
              )}

              {/* Delete Button */}
              {isEditMode && (
                <button
                  onClick={() => handleDelete(index, skill._id)}
                  disabled={loadingIndex === index}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-gray-800 p-2 rounded-full shadow-xl transition-all disabled:opacity-50"
                >
                  <AiOutlineDelete size={20} />
                </button>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
