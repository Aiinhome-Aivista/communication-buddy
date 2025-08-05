// import React from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";

// export default function ReportRow({
//   row,
//   index,
//   isShowAction = false,
//   keys = [],
//   isRaiseRequest = false,
//   raiseRequest = () => { },
// }) {
//   return (
//     <tr
//       className={
//         index % 2 === 0
//           ? "bg-teal-900/10"
//           : "bg-teal-900/20 hover:bg-teal-800/30"
//       }
//     >
//       {keys.map((key) => {
//         let value;
//         if (key.toLowerCase() === "id") {
//           value = index + 1;
//         } else {
//           value = row[key];
//         }
//         const isStatus = key.toLowerCase() === "status";
//         return (
//           <td
//             key={key}
//             className="px-6 py-4 whitespace-nowrap text-sm text-teal-100"
//           >
//             {isStatus ? (
//               <span
//                 className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${value === "Completed"
//                   ? "bg-green-900/50 text-green-300"
//                   : value === "Pending"
//                     ? "bg-yellow-900/50 text-yellow-300"
//                     : "bg-red-900/50 text-red-300"
//                   }`}
//               >
//                 {value}
//               </span>
//             ) : (
//               value
//             )}
//           </td>
//         );
//       })}

//       {isShowAction && (
//         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//           <div className="flex space-x-3">
//             <button
//               className="text-amber-300 hover:text-amber-100 transition-colors"
//               title="Edit"
//             >
//               <FaEdit />
//             </button>
//             <button
//               className="text-red-300 hover:text-red-100 transition-colors"
//               title="Delete"
//             >
//               <FaTrash />
//             </button>
//           </div>
//         </td>
//       )}

//       {isRaiseRequest && (
//         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//           <div className="flex space-x-3">
//             <button
//               className="text-teal-100 bg-teal-600/30 px-2 py-1 outline-2 outline-teal-500 rounded-sm outline-offset-2 hover:text-teal-400 cursor-pointer transition-colors"
//               title="request"
//               onClick={() => raiseRequest(row)}
//             >
//               Request
//             </button>
//           </div>
//         </td>
//       )}
//     </tr>
//   );
// }
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
export default function ReportRow({
  row,
  index,
  isShowAction = false,
  keys = [],
  isRaiseRequest = false,
  raiseRequest = () => { },
}) {
  return (
    <tr
      className={
        index % 2 === 0
          ? "bg-teal-900/10"
          : "bg-teal-900/20 hover:bg-teal-800/30"
      }
    >
      {keys.map((key) => {
        let value = key.toLowerCase() === "id" ? index + 1 : row[key];
        const isStatus = key.toLowerCase() === "status";
        const isInsights = key.toLowerCase() === "feedback"; // ✅ Insights column
        const isTopic = key.toLowerCase() === "topic";       // ✅ Topic column

        const showTooltip = isInsights || isTopic; // ✅ both columns will show tooltip

        return (
          <td
            key={key}
            className={`px-6 py-4 whitespace-nowrap text-sm text-teal-100 max-w-[200px] truncate 
              ${showTooltip ? "cursor-pointer" : ""}`} // ✅ pointer on hover for Topic & Insights
            title={showTooltip ? value : ""} // ✅ tooltip for both
          >
            {isStatus ? (
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${value === "Completed"
                    ? "bg-green-900/50 text-green-300"
                    : value === "Pending"
                      ? "bg-yellow-900/50 text-yellow-300"
                      : "bg-red-900/50 text-red-300"
                  }`}
              >
                {value}
              </span>
            ) : showTooltip ? (
              value?.length > 20 ? value.slice(0, 30) + "..." : value
            ) : (
              value
            )}
          </td>
        );
      })}

      {isShowAction && (
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-3">
            <button className="text-amber-300 hover:text-amber-100 transition-colors" title="Edit">
              <FaEdit />
            </button>
            <button className="text-red-300 hover:text-red-100 transition-colors" title="Delete">
              <FaTrash />
            </button>
          </div>
        </td>
      )}

      {isRaiseRequest && (
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-3">
            <button
              className="text-teal-100 bg-teal-600/30 px-2 py-1 outline-2 outline-teal-500 rounded-sm outline-offset-2 hover:text-teal-400 cursor-pointer transition-colors"
              onClick={() => raiseRequest(row)}
            >
              Request
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}
