import React from "react";
import ReportRow from "./ReportRow";
import { FaRotate } from "react-icons/fa6";

export default function ReportTable({
  tableData,
  headers,
  isShowAction = false,
  keys = [],
  isRaiseRequest = false,
  loadingTable = false,
  raiseRequest = () => { },
  onEdit = null,
  onDelete = null,
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-400 mb-0 scrollbar">
      <div className="max-h-[calc(100vh-350px)] overflow-auto">
        {loadingTable && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-500 z-10">
            <FaRotate className="animate-spin text-black text-3xl" />
          </div>
        )}
        <table className="min-w-full bg-gray-300">
          <thead className="sticky top-0 bg-gray-500">
            <tr>
              {headers.map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                >
                  {heading}
                </th>
              ))}

              {(isShowAction || isRaiseRequest) && (
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-400">
            {tableData.map((row, index) => (
              <ReportRow
                key={index}
                row={row}
                index={index}
                isShowAction={isShowAction}
                keys={keys}
                isRaiseRequest={isRaiseRequest}
                raiseRequest={raiseRequest}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
