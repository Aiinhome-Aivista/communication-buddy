import React from "react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-teal-900 text-teal-100 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Confirm Request</h2>
        <p className="mb-6">{message}</p>

        {/* ✅ Button দুটি দুই পাশে */}
        <div className="flex justify-between w-full">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
