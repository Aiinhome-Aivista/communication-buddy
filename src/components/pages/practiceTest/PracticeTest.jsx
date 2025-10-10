import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";


const testData = [
  { title: "Python", duration: "10 mins", date: "17/10/2025", status: "Active" },
  { title: "SQL", duration: "22 mins", date: "11/10/2025", status: "Active" },
  { title: "JAVA", duration: "7 mins", date: "13/10/2025", status: "Active" },
];

const tabOptions = ["Upcoming", "Ongoing", "Expired"];
const testTypeOptions = ["All", "Technology", "Communication"];

export default function PracticeTest() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [testType, setTestType] = useState("Test Type");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredData = testData.filter((test) =>
    Object.values(test).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );


  // ✅ Custom template for status badge
  const statusBodyTemplate = (rowData) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${rowData.status === "Active"
        ? "bg-[#35FF021A] text-[#46BA2F]"
        : "bg-gray-100 text-gray-500"
        }`}
    >
      {rowData.status}
    </span>
  );


  return (
    <div className="w-full h-full bg-[#ECEFF2] flex flex-col">
      <div className="flex-grow flex flex-col">
        <div className="pt-4 px-6">
          <h1 className="text-2xl font-bold text-[#2C2E42]">
            Practice & Test
          </h1>

          {/* Tabs + Search + Dropdown */}
          <div className="flex flex-row items-center mt-6 space-x-8 gap-4">
            <div className="flex border border-[#BCC7D2] rounded-xl overflow-hidden h-[45px]">
              {tabOptions.map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-2 text-sm text-semibold rounded-xl font-medium ${activeTab === tab
                    ? "bg-[#FEFEFE] text-[#2C2E42]"
                    : "bg-[#ECEFF2] text-[#8F96A9]"
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>



            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search content"
                className="w-full h-[45px] px-6 py-2 border border-[#BCC7D2] rounded-xl text-[#8F96A9] text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-[#ECEFF2] pr-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <img
                src="public/assets/icons/search.svg"
                alt="Search"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
              />
            </div>
            {/* Test type */}
            <div className="relative ml-auto">
              <button
                className="border border-[#BCC7D2] rounded-xl px-8 py-2 text-sm bg-[#ECEFF2] flex items-center justify-between w-80 h-[45px]"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ color: "#8F96A9" }}
              >

                {testType}
                {dropdownOpen ? (
                  <KeyboardArrowUpIcon className="w-4 h-4 text-[#8F96A9]" />
                ) : (
                  <KeyboardArrowDownIcon className="w-4 h-4 text-[#8F96A9]" />
                )}

              </button>
              {dropdownOpen && (
                <ul className="absolute mt-1 left-0 w-80 bg-[#BCC7D2] rounded-2xl shadow-md z-10">
                  {testTypeOptions.map((option) => (
                    <li
                      key={option}
                      onClick={() => {
                        setTestType(option);
                        setDropdownOpen(false);
                      }}
                      className={`px-4 py-2 text-base cursor-pointer font-medium text-[#182938]
      ${testType === option
                          ? "bg-[#BCC7D2] font-bold"
                          : "hover:bg-[#D9D9D9]"
                        }
    `}
                    >
                      {option}
                    </li>
                  ))}

                </ul>
              )}
            </div>
          </div>

          {/*DataTable */}
          <div className="table-body custom-width-table">
            <DataTable
              value={filteredData}
              paginator
              rows={5}
              rowsPerPageOptions={[3, 5, 10]}
              paginatorClassName="!m-0 !border-t"
              emptyMessage="No APIs found"

            >
              <Column
                field="title"
                header="Test Title"
                body={(rowData) => (
                  <span style={{ color: "#3D5B81", fontWeight: "400" }}>
                    {rowData.title}
                  </span>
                )}
              ></Column>

              <Column field="duration" header="Session Duration"></Column>
              <Column field="date" header="Session Date"></Column>
              <Column
                field="status"
                header="ACTION"
                body={statusBodyTemplate}
              ></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  );
}
