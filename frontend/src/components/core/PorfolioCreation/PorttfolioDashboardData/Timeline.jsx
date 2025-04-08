export const Timeline = ({ timeline }) => (
    <div className="mt-6 border border-gray-700 p-4 rounded-lg bg-black">
      <div className="flex justify-between items-center border-b-2 border-gray-700 pb-2">
        <h2 className="text-3xl font-semibold text-gray-100">Timeline</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg">
          Manage Timeline
        </button>
      </div>
      <div className="bg-black p-1 rounded-lg shadow-lg mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-gray-300">
          <thead>
            <tr className="bg-gray-900 text-gray-400">
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-center">From</th>
              <th className="px-4 py-2 text-center">To</th>
            </tr>
          </thead>
          <tbody>
            {timeline.map((event, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="px-4 py-3">{event.title}</td>
                <td className="px-4 py-3 text-center">{event.timeline.from}</td>
                <td className="px-4 py-3 text-center">{event.timeline.to}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  