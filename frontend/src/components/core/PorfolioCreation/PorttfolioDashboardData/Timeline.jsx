import { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { deleteTimeline } from "../../../../services/operations/PortfolioApi";
import { useSelector } from "react-redux";

export const Timeline = ({ timeline }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [localTimeline, setLocalTimeline] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { portfolio } = useSelector((state) => state.portfolio);
  const portfolioId = portfolio._id;

  // Initialize local state with prop
  useEffect(() => {
    setLocalTimeline(timeline);
  }, [timeline]);

  const handleDelete = async (index, id) => {
    try {
      setLoadingIndex(index);
      const success = await deleteTimeline({
        Timelineid: id,
        portfolioId,
        token,
      });

      // console.log("ye hai ji apki timeline ki sucess",success)

      if (success) {
        const updatedTimeline = [...localTimeline];
        updatedTimeline.splice(index, 1);
        setLocalTimeline(updatedTimeline);
      }
    } catch (err) {
      console.error("Failed to delete timeline event:", err);
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="mt-6 border border-gray-700 p-4 rounded-lg bg-black">
      <div className="flex justify-between items-center border-b-2 border-gray-700 pb-2">
        <h2 className="text-3xl font-semibold text-gray-100">Timeline</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg"
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? "Done" : "Manage Timeline"}
        </button>
      </div>

      <div className="bg-black p-1 rounded-lg shadow-lg mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-gray-300">
          <thead>
            <tr className="bg-gray-900 text-gray-400">
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-center">From</th>
              <th className="px-4 py-2 text-center">To</th>
              {isEditMode && <th className="px-4 py-2 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {localTimeline.map((event, index) => (
              <tr key={event._id || index} className="border-b border-gray-700">
                <td className="px-4 py-3">{event.title}</td>
                <td className="px-4 py-3 text-center">{event.timeline.from}</td>
                <td className="px-4 py-3 text-center">{event.timeline.to}</td>
                {isEditMode && (
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(index, event._id)}
                      disabled={loadingIndex === index}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
