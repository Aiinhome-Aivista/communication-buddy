import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function ReportRow({ report, index }) {
  return (
    <tr
      className={
        index % 2 === 0
          ? "bg-teal-900/10"
          : "bg-teal-900/20 hover:bg-teal-800/30"
      }
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-100">
        {report.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-50">
        {report.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-100">
        {report.date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${
              report.status === "Completed"
                ? "bg-green-900/50 text-green-300"
                : report.status === "Pending"
                ? "bg-yellow-900/50 text-yellow-300"
                : "bg-red-900/50 text-red-300"
            }`}
        >
          {report.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-3">
          <button
            className="text-amber-300 hover:text-amber-100 transition-colors"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            className="text-red-300 hover:text-red-100 transition-colors"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
}
