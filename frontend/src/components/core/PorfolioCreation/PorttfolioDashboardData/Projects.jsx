import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { deleteProject, updateProject } from "../../../../services/operations/PortfolioApi";
import { useSelector } from "react-redux";
import ProjectEditModal from "./ProjectEditModal";

export const Projects = ({ projects }) => {
  const [manageMode, setManageMode] = useState(false);
  const [projectList, setProjectList] = useState(projects);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const { portfolio } = useSelector((state) => state.portfolio);
  const portfolioId = portfolio._id;

  useEffect(() => {
    setProjectList(projects);
  }, [projects]);

  const handleDelete = async (projectId) => {
    try {
      const res = await deleteProject({ projectId, portfolioId, token });
      if (res) {
        setProjectList((prev) => prev.filter((proj) => proj._id !== projectId));
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  const handleEditModalOpen = (project) => {
    setEditingProject(project);
  };

  const handleEditModalClose = () => {
    setEditingProject(null);
  };

  const updateProjectList = (updatedProject) => {
    setProjectList((prev) =>
      prev.map((proj) => (proj?._id === updatedProject?._id ? updatedProject : proj))
    );
  };

  const handleSave = async () => {
    if (!editingProject) return;

    const formData = new FormData();
    formData.append("title", editingProject.title);
    formData.append("description", editingProject.description);
    formData.append("technologies", editingProject.technologies);
    formData.append("gitRepoLink", editingProject.gitRepoLink);
    formData.append("projectLink", editingProject.projectLink);
    formData.append("projectId", editingProject._id);

    // Add projectBanner if it's updated
    if (editingProject.projectBanner instanceof File) {
      formData.append("projectBanner", editingProject.projectBanner);
    }

    try {
      const response = await updateProject(formData, token);  // Pass the formData to the API

      if (response && response.projectRes) {
        console.log("Updated Project:", response.projectRes);
        updateProjectList(response.projectRes);  // Use projectRes instead of updatedProject

        toast.success("Project updated successfully!");
        setEditingProject(null);  // Close the modal after success
      }
    } catch (error) {
      toast.error("Failed to update the project!");
      console.error("Error updating project:", error);
    }
  };


  // Add a console.log to inspect projectList
  console.log(projectList);

  return (
    <div className="w-full mt-6 p-4 bg-black border-2 border-gray-700 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white border-b border-gray-600 pb-2">
          Projects
        </h2>
        <button
          className="text-sm bg-gray-800 px-3 py-1 rounded text-white hover:bg-gray-700 transition"
          onClick={() => setManageMode((prev) => !prev)}
        >
          {manageMode ? "Exit Manage" : "Manage Projects"}
        </button>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-gray-900 p-4 rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded"
            />
            <button
              className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
              onClick={() => setPreviewImage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {editingProject && (
        <ProjectEditModal
          isOpen={!!editingProject}
          editData={editingProject}
          setEditData={setEditingProject}
          onClose={handleEditModalClose}
          onSave={handleSave}
        />
      )}

      <div className="p-2 rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700 text-white">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="p-3 border border-gray-700">Title</th>
              <th className="p-3 border border-gray-700">Description</th>
              <th className="p-3 border border-gray-700">Technologies</th>
              <th className="p-3 border border-gray-700">Banner</th>
              <th className="p-3 border border-gray-700">GitHub</th>
              <th className="p-3 border border-gray-700">Live Link</th>
              {manageMode && <th className="p-3 border border-gray-700">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {projectList.map((project) => {
              // Add a check for undefined project
              if (!project || !project._id) return null;
              return (
                <tr key={project._id} className="hover:bg-gray-800 transition">
                  <td className="p-3 border border-gray-700">{project.title}</td>
                  <td className="p-3 border border-gray-700">{project.description}</td>
                  <td className="p-3 border border-gray-700">
                    {Array.isArray(project.technologies)
                      ? project.technologies.join(", ")
                      : project.technologies}
                  </td>
                  <td className="p-3 border border-gray-700">
                    <img
                      src={project.projectBanner?.url}
                      alt="Banner"
                      onClick={() => setPreviewImage(project.projectBanner?.url)}
                      className="w-24 h-16 object-cover rounded shadow cursor-pointer hover:scale-105 transition"
                    />
                  </td>
                  <td className="p-3 border border-gray-700">
                    <a
                      href={project.gitRepoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      GitHub
                    </a>
                  </td>
                  <td className="p-3 border border-gray-700">
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:underline"
                    >
                      Live
                    </a>
                  </td>
                  {manageMode && (
                    <td className="p-3 border border-gray-700 flex gap-2">
                      <button
                        className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700 transition"
                        onClick={() => handleEditModalOpen(project)}
                      >
                        Update
                      </button>
                      <button
                        className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700 transition"
                        onClick={() => handleDelete(project._id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        
        </table>
        
      </div>

     

    </div>
  );
};
