export const Projects = ({ projects }) => (
  <div className="w-full mt-6  p-4 bg-black border-2 border-gray-700 rounded-lg">
    <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-600 pb-2">Projects</h2>
    <div className="p-2 rounded-lg shadow-lg overflow-x-auto">
      <table className="w-full border-collapse border border-gray-700 text-white">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="p-3 border border-gray-700">Title</th>
            <th className="p-3 border border-gray-700">Stack</th>
            <th className="p-3 border border-gray-700">Deployed</th>
            <th className="p-3 border border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index} className="hover:bg-gray-800 transition">
              <td className="p-3 border border-gray-700">{project.title}</td>
              <td className="p-3 border border-gray-700">{project.stack}</td>
              <td className="p-3 border border-gray-700">{project.deployed}</td>
              <td className="p-3 border border-gray-700 flex gap-2">
                <button className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700 transition">
                  Update
                </button>
                <button className="bg-green-600 px-3 py-1 rounded text-white hover:bg-green-700 transition">
                  Visit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
