import React from 'react';

export default function Dashboard() {
  const tests = [
    { title: 'Python', duration: '10 mints', date: '17/10/2025', status: 'Active' },
    { title: 'SQL', duration: '22 mints', date: '11/10/2025', status: 'Active' },
    { title: 'JAVA', duration: '7 mints', date: '13/10/2025', status: 'Active' },
  ];

  return (
  <>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Practice & Test</h2>

      <div className="flex items-center gap-3 mb-4">
        <button className="px-4 py-2 text-sm rounded-lg bg-gray-100 font-medium text-gray-700">
          Upcoming
        </button>
        <button className="px-4 py-2 text-sm rounded-lg hover:bg-gray-100 text-gray-600">
          Ongoing
        </button>
        <button className="px-4 py-2 text-sm rounded-lg hover:bg-gray-100 text-gray-600">
          Expired
        </button>
        <input
          type="text"
          placeholder="Search content"
          className="ml-auto border rounded-lg px-3 py-1.5 text-sm text-gray-600 w-60"
        />
        <select className="border rounded-lg px-3 py-1.5 text-sm text-gray-600">
          <option>Test type</option>
        </select>
      </div>

      <table className="w-full text-sm text-gray-700 border-t">
        <thead className="text-gray-500">
          <tr>
            <th className="text-left py-3">Test Title</th>
            <th className="text-left py-3">Session Duration</th>
            <th className="text-left py-3">Session Date</th>
            <th className="text-left py-3">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test, idx) => (
            <tr key={idx} className="border-t">
              <td className="py-3">{test.title}</td>
              <td>{test.duration}</td>
              <td>{test.date}</td>
              <td>
                <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
                  {test.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}