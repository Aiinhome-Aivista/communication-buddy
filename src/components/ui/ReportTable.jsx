import React from "react";
import ReportRow from "./ReportRow";
import { FaRotate } from "react-icons/fa6";

export default function ReportTable({
  tableData,
  headers,
  isShowAction = false,
  keys=[],
  isRaiseRequest = false,
   loadingTable = false,
  raiseRequest = () => {}
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-teal-500/30 mb-0 scrollbar">
      <div className="max-h-[calc(100vh-350px)] overflow-auto">
         {loadingTable && (
          <div className="absolute inset-0 flex items-center justify-center bg-teal-900/40 z-10">
            <FaRotate className="animate-spin text-teal-300 text-3xl" />
          </div>
        )}
        <table className="min-w-full bg-teal-900/30">
          <thead className="sticky top-0 bg-teal-800/50">
            <tr>
              {headers.map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-3 text-left text-xs font-medium text-teal-300 uppercase tracking-wider"
                >
                  {heading}
                </th>
              ))}

              {(isShowAction || isRaiseRequest) && (
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-teal-700/50">
            {tableData.map((row, index) => (
              <ReportRow
                key={index}
                row={row}
                index={index}
                isShowAction={isShowAction}
                keys={keys}
                isRaiseRequest={isRaiseRequest}
                raiseRequest={raiseRequest}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
