import React from "react";
import pythonLogo from "../../../assets/logo/python.svg";
import cppLogo from "../../../assets/logo/cpp.svg";
import reactLogo from "../../../assets/logo/react.svg";
import appleLogo from "../../../assets/logo/apple.svg";
import phpLogo from "../../../assets/logo/php.svg";
import javaLogo from "../../../assets/logo/java.svg";
import mysqlLogo from "../../../assets/logo/mysql.svg";
import oracleLogo from "../../../assets/logo/oracle.svg";


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";



export async function getCandidateDashboard(userId) {
  
  try {
    const body = { user_id: userId };
    const response = await fatchedPostRequest(postURL.dashboard, body);

    if (response?.success) {
      return response.data; 
    } else {
      console.error("API Error:", response?.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching dashboard:", error.message);
    return null;
  }
}

const UserDashboard = () => {
  const COLORS = ["#0f172a", " #DFB916"];

  const pieData = [
    { name: "Completed", value: 70 },
    { name: "Pending", value: 30 },
  ];

  const barData = [
    { name: "Jan", uv: 4 },
    { name: "Feb", uv: 2 },
    { name: "Mar", uv: 6 },
    { name: "Apr", uv: 3 },
    { name: "May", uv: 5 },
    { name: "Jun", uv: 4 },
    { name: "Jul", uv: 7 },
    { name: "Aug", uv: 6 },
    { name: "Sep", uv: 8 },
    { name: "Oct", uv: 9 },
    { name: "Nov", uv: 9 },
    { name: "Dec", uv: 9 },
  ];

  const lineData = [
    { name: "English", uv: 80 },
    { name: "Hindi", uv: 60 },
    { name: "French", uv: 40 },
    { name: "Spanish", uv: 88 },
    { name: "German", uv: 45 },
  ];

  const technologyLogos = [
    pythonLogo,
    cppLogo,
    reactLogo,
    appleLogo,
    phpLogo,
    javaLogo,
    mysqlLogo,
    oracleLogo,
  ];

  return (
    <div className="w-screen h-screen overflow-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <button className="bg-yellow-400 hover:bg-yellow-500 px-5 py-2 rounded-md font-semibold text-gray-900">
          + Create Session
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <div className="col-span-12 md:col-span-3 flex flex-col space-y-6">
          {/* Session Completion */}
          <div className="bg-white rounded-2xl shadow-sm p-4 w-full h-[220px]">
            <h2
              className="text-gray-700 mb-2"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '15px',
                lineHeight: '100%',
                letterSpacing: '0%',
                verticalAlign: 'middle',
              }}
            >
              Session Completion
            </h2>

            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={55}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="flex justify-center gap-8 mt-2 text-xs font-medium">
              <div className="flex flex-col items-center text-slate-900">
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',

                  }}
                >
                  70%
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '12px',

                  }}
                >
                  Completed
                </div>

              </div>
              <div className="flex flex-col items-center">
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    color: ' #DFB916', // Tailwind's yellow-500
                  }}
                >
                  30%
                </div>

                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    color: 'black', // Tailwind's yellow-500
                  }}
                >
                  Pending
                </div>
              </div>

            </div>
          </div>

          {/* Technologies */}
          <div className="bg-white rounded-[10px] shadow-sm p-5 w-full h-[374px]">
            <h2 className="font-semibold text-gray-700 mb-6 text-left">
              Mostly Asked Technology
            </h2>
            <div className="grid grid-cols-4 gap-4 justify-items-center mt-4">
              {technologyLogos.map((logo, index) => (
                <div key={index} className="flex items-center justify-center">
                  <img
                    src={logo}
                    alt={`tech-${index}`}
                    className="w-[40px] h-[40px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER + RIGHT SECTION */}
        <div className="col-span-12 md:col-span-9 flex flex-col space-y-6">
          {/* Session Report */}
          <div className="bg-white rounded-2xl shadow-sm p-5 w-full h-[220px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-inter font-normal text-[15px] leading-none tracking-normal align-middle text-gray-700">
                Session Report
              </h2>


              <div className="flex items-center space-x-2">
                <img src="/icons/group.svg" alt="group" className="w-5 h-5" />
                <div className="flex flex-col items-center -ml-2 leading-tight">
                  <span className="font-inter font-bold text-[20px] leading-none align-middle text-gray-700">562</span>
                  <span className="font-inter font-normal text-[12px] leading-none tracking-normal text-right align-middle text-gray-500 -mt-0.5">Active participant</span>

                </div>
              </div>

            </div>

            {/* Session Type Label */}
            <div className="font-inter font-normal text-[12px] leading-none tracking-normal align-middle text-gray-500 mb-3">
              Session type
            </div>


            {/* Bars */}
            <div className="space-y-3">
              {/* Communication Bar */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-24">Communication</span>
                <div className="bg-slate-200 w-full h-5 rounded-md relative">
                  <div className="bg-slate-900 h-5 rounded-md w-3/5"></div>
                </div>
                <span className="text-xs text-gray-700 font-medium ml-2">200</span>
              </div>

              {/* Technology Bar */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-24">Technology</span>
                <div className="bg-slate-200 w-full h-5 rounded-md relative">
                  <div className="bg-yellow-400 h-5 rounded-md w-3/4"></div>
                </div>
                <span className="text-xs text-gray-700 font-medium ml-2">300</span>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="flex justify-between items-center mt-6 text-sm font-medium text-slate-900">
              <div className="flex flex-col items-center">
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontStyle: 'normal',
                    fontSize: '20px',

                  }}
                >15 minutes</div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '12px',

                  }}
                >
                  Average Session Duration
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontStyle: 'normal',
                    fontSize: '20px',

                  }}
                >1,256</div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '12px',

                  }}>Session Created</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 font-semibold">
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 700,
                      fontStyle: 'normal',
                      fontSize: '20px',

                    }}
                  >245</div>
                  <img src="/icons/trending_up.svg" alt="trend" className="w-4 h-4" />
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '12px',

                  }}>User Traffic</div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontStyle: 'normal',
                    fontSize: '20px',

                  }}
                >64</div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '12px',

                  }}>Average Score</div>
              </div>
            </div>
          </div>





          {/* Bottom Row (Charts + Skills Card) */}
          <div className="flex flex-col md:flex-row justify-between w-full gap-6">
            {/* Charts Column */}
            <div className="flex flex-col gap-6 w-full md:w-2/3">
              {/* Annually Hiring Process */}
              <div className="bg-yellow-400 rounded-[10px] shadow-sm p-5 w-full h-[198px] flex flex-col">
                <h2 className="font-semibold text-white mb-3">
                  Annually Hiring Process
                </h2>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="name" hide />
                      <YAxis
                        stroke="#fff"
                        axisLine={true}
                        tickLine={false}
                        tick={{ fill: "#fff", fontSize: 12 }}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="uv"
                        fill="#0f172a"
                        barSize={25}
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>


              {/* Language Usage */}
              <div className="bg-white rounded-[10px] shadow-sm p-5 w-full h-[150px]">
                <h2 className="font-semibold text-gray-700 mb-3">
                  Language Usage
                </h2>
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={lineData}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="uv"
                      stroke=" #DFB916"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                        fill: " #DFB916",
                        stroke: "#0f172a",
                        strokeWidth: 1,
                      }}
                      activeDot={{ r: 7, fill: " #DFB916" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-white shadow-sm p-5 rounded-[10px] w-full md:w-1/3 h-[374px] flex-shrink-0">
              <h2 className="font-semibold text-gray-700 mb-6 text-left">
                Mostly Asked Technical Skill
              </h2>
              <div className="grid grid-cols-2 gap-4 justify-items-center mt-4">
                {[
                  "Artificial Intelligence",
                  "Machine Learning",
                  "Data Analysis & Science",
                  "Cloud Computing",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:bg-yellow-100 transition text-center"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
