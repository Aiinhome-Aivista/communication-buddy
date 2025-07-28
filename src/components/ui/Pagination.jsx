import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) {
  return (
    <div className="flex justify-center items-center mt-4 space-x-4">
      <div className="flex space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-3 py-1 rounded-md ${
              currentPage === number
                ? "bg-teal-600 text-teal-50"
                : "bg-teal-800/50 text-teal-200 hover:bg-teal-700/50"
            }`}
          >
            {number}
          </button>
        ))}
      </div>
      <select
        value={itemsPerPage}
        onChange={onItemsPerPageChange}
        className="bg-teal-900/50 border border-teal-700/50 text-teal-100 rounded px-2 py-1 text-sm"
      >
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>
    </div>
  );
}
