export default function NewDashboard() {
  const tests = [
    { title: "Python", date: "17/10/2025", status: "Active" },
    { title: "SQL", date: "11/10/2025", status: "Active" },
    { title: "JAVA", date: "13/10/2025", status: "Active" },
  ];

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Practice & Test</h2>

      <div className="flex items-center gap-3 mb-4">
        <div className="bg-white border rounded-md flex">
          <button className="px-4 py-2 bg-gray-100 font-semibold text-sm rounded-l-md">Upcoming</button>
          <button className="px-4 py-2 text-sm">Ongoing</button>
          <button className="px-4 py-2 text-sm rounded-r-md">Expired</button>
        </div>

        <input
          type="text"
          placeholder="Search content"
          className="border px-3 py-2 rounded-md text-sm flex-1 max-w-xs"
        />

        <select className="border px-3 py-2 rounded-md text-sm">
          <option>Test type</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm ">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 font-medium">Test Title</th>
              <th className="p-3 font-medium">Session Date</th>
              <th className="p-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test, index) => (
              <tr key={index} className=" hover:bg-gray-50">
                <td className="p-3 text-blue-600 cursor-pointer">{test.title}</td>
                <td className="p-3 text-gray-700">{test.date}</td>
                <td className="p-3 text-right">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {test.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
