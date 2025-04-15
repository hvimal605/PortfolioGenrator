import React, { useState } from "react";

import { toast } from "react-hot-toast";
import { createTimeline } from "../../../../services/operations/PortfolioApi";
import { useSelector } from "react-redux";

const Timeline = () => {
  const { token } = useSelector((state) => state.auth);
  const {portfolio} = useSelector((state)=>state.portfolio)
  // console.log("ye aagya porfolio time line ke ander  ",portfolio)


  const [timeLine, setTimeLine] = useState({
    title: "",
    description: "",
    from: "",
    to: "",
  });

  const handleChange = (e) => {
    setTimeLine({ ...timeLine, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const portfolioId = portfolio._id;
    if (!portfolioId) {
      toast.error("Portfolio ID not found. Please try again.");
      return;
    }
    try {
      const timeLineData = { ...timeLine, portfolioId };
      await createTimeline(timeLineData, token);

      setTimeLine({
        title: "",
        description: "",
        from: "",
        to: "",
      });


    } catch (error) {
      console.error("Error adding timeline:", error);
    }
  };

  return (
    <div className="bg-gray-900 border border-pink-500 text-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Timeline</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={timeLine.title}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 font-medium">Description</label>
          <textarea
            name="description"
            value={timeLine.description}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 font-medium">From</label>
            <input
              type="date"
              name="from"
              value={timeLine.from}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium">To</label>
            <input
              type="date"
              name="to"
              value={timeLine.to}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
          >
            Save and Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Timeline;