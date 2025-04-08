export const SoftwareApplications = ({ software }) => (
  <div className="w-full mt-6 border-2 border-gray-700 p-4 rounded-lg bg-black">
    <h2 className="text-2xl font-semibold text-white mb-4 border-b pb-2 border-gray-600 ">Software Applications</h2>
    <div className=" p-4 rounded-lg w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {software.map((app, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gray-900 p-3 rounded-lg border "
          >
            <span className="text-white font-medium">{app.name}</span>
            <button className="mt-2 text-red-400 hover:text-red-500 transition">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);
