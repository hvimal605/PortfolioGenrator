import { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { deleteSoftwareApp, updateSoftwareApp } from "../../../../services/operations/PortfolioApi";

export const SoftwareApplications = ({ software }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [localSoftware, setLocalSoftware] = useState([]);
  const [editedSoftware, setEditedSoftware] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const { portfolio } = useSelector((state) => state.portfolio);
  const portfolioId = portfolio._id;

  useEffect(() => {
    setLocalSoftware(software);
    setEditedSoftware(
      software.map((app) => ({
        ...app,
        newSvgFile: null,
        previewSvgUrl: app.svg?.url || null,
      }))
    );
  }, [software]);

  const handleSvgChange = (index, file) => {
    const updated = [...editedSoftware];
    updated[index].newSvgFile = file;
    updated[index].previewSvgUrl = URL.createObjectURL(file);
    setEditedSoftware(updated);
  };

  const handleDelete = async (index, id) => {
    try {
      setLoadingIndex(index);
      const success = await deleteSoftwareApp({ softwareId: id, portfolioId, token });
      if (success) {
        const updatedSoftware = [...localSoftware];
        updatedSoftware.splice(index, 1);
        setLocalSoftware(updatedSoftware);

        const updatedEdited = [...editedSoftware];
        updatedEdited.splice(index, 1);
        setEditedSoftware(updatedEdited);
        toast.success("Software application deleted");
      }
    } catch (error) {
      console.error("Error deleting software application:", error);
      toast.error("Failed to delete software application");
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleUpdate = async (index) => {
    const app = editedSoftware[index];

    const isUnchanged = !app.newSvgFile;

    if (isUnchanged) {
      toast("No changes to update");
      return;
    }

    const formData = new FormData();
    formData.append("softwareId", app._id);
    formData.append("portfolioId", portfolioId);
    if (app.newSvgFile) {
      formData.append("svg", app.newSvgFile);
    }

    try {
      setLoadingIndex(index);
      const response = await updateSoftwareApp(formData, token);

      if (response?.success) {
        const updatedSoftware = [...localSoftware];
        if (app.newSvgFile) {
          updatedSoftware[index].svg = {
            url: app.previewSvgUrl,
          };
        }

        setLocalSoftware(updatedSoftware);
        setIsEditMode(false);
      }
    } catch (error) {
      console.error("Error updating software application:", error);
      toast.error("Failed to update software application");
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="w-full mt-6 border-2 border-gray-700 p-4 rounded-lg bg-black">
      <div className="flex justify-between items-center border-b pb-2 border-gray-600 mb-4">
        <h2 className="text-2xl font-semibold text-white">Software Applications</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? "Done" : "Manage Software Apps"}
        </button>
      </div>

      <div className="p-2 rounded-lg w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {localSoftware.map((app, index) => {
            const edited = editedSoftware[index];
            return (
              <div
                key={index}
                className="relative flex flex-col items-center bg-gray-900 p-3 rounded-lg border border-gray-700"
              >
                {/* Display the app name */}
                <span className="text-white font-medium text-center">{app.name}</span>

                {/* Display the SVG image for the app */}
                {app.svg?.url && (
                  <img
                    src={app.svg.url}
                    alt={app.name}
                    className="w-16 h-16 mt-2 object-contain rounded-lg border-2 border-gray-600 shadow-md"
                  />
                )}

                {/* Edit Mode: Show Delete button */}
                {isEditMode && (
                  <button
                    onClick={() => handleDelete(index, app._id)}
                    disabled={loadingIndex === index}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition disabled:opacity-50"
                  >
                    <AiOutlineDelete size={18} />
                  </button>
                )}

                {/* Edit Mode: Show SVG file input */}
                {isEditMode && (
                  <>
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
                      disabled={loadingIndex === index || !edited?.newSvgFile}
                    >
                      {loadingIndex === index ? "Updating..." : "Update"}
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
