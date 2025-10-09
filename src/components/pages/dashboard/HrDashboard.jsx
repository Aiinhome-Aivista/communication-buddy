import React from "react";
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

const HrDashboard = () => {
  const COLORS = ["#0f172a", "#eab308"];

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

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <button className="bg-yellow-400 hover:bg-yellow-500 px-5 py-2 rounded-md font-semibold text-gray-900">
          + Create Session
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <div className="col-span-3 space-y-6">
          {/* Session Completion */}
         <div className="bg-white rounded-2xl shadow-sm p-4">
  <h2 className="font-semibold text-gray-700 mb-2">Session Completion</h2>

  {/* Smaller Pie Chart */}
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

  {/* Labels */}
  <div className="flex justify-center gap-10 mt-2 text-xs font-medium">
    <div className="flex flex-col items-center text-slate-900">
      <div className="font-semibold text-sm">70%</div>
      <div>Completed</div>
    </div>
    <div className="flex flex-col items-center text-yellow-500">
      <div className="font-semibold text-sm">30%</div>
      <div>Pending</div>
    </div>
  </div>
</div>


          {/* Technologies */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-700 mb-3">Mostly Asked Technology</h2>
            <div className="grid grid-cols-3 gap-4 text-center text-gray-500">
              {[
                "python",
                "cpp",
                "react",
                "angular",
                "php",
                "java",
                "mysql",
                "oracle",
                "html5",
              ].map((tech) => (
                <div
                  key={tech}
                  className="flex flex-col items-center text-xs font-medium text-gray-700"
                >
                  <i className={`devicon-${tech}-plain text-3xl`}></i>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER + RIGHT SECTION */}
        <div className="col-span-9 space-y-8">
          {/* Session Report */}
          <div className="bg-white rounded-2xl shadow-sm p-5 w-full">
            <h2 className="font-semibold text-gray-700 mb-5">Session Report</h2>

            <div className="space-y-4">
              {/* Communication */}
              <div>
                <div className="bg-slate-900 h-6 w-[60%] flex items-center justify-center text-white text-xs font-medium">
                  Communication
                </div>
              </div>

              {/* Technology */}
              <div>
                <div className="bg-yellow-400 h-6 w-[75%] flex items-center justify-center text-gray-900 text-xs font-medium">
                  Technology
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex justify-center gap-10 mt-3 text-sm font-medium">
                <div className="flex flex-col items-center text-slate-900">
                  <div className="font-bold">15 Minutes</div>
                  <div className="font-semibold">Average Session Duration</div>
                </div>

                <div className="flex flex-col items-center text-slate-900">
                  <div className="font-semibold">1,256</div>
                  <div>Sessions Created</div>
                </div>

                <div className="flex flex-col items-center text-slate-900">
                  <div className="font-semibold">245</div>
                  <div>User Traffic</div>
                </div>

                <div className="flex flex-col items-center text-slate-900">
                  <div className="font-semibold">64</div>
                  <div>Average Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row (Charts + Skills Card) */}
          <div className="flex gap-6">
            {/* Left Column (Charts) */}
            <div className="flex flex-col gap-6">
              {/* Annually Hiring Process */}
              <div className="bg-yellow-400 rounded-[10px] shadow-sm p-5 w-[457px] h-[198px] opacity-100">
 <h2 className="font-semibold text-white mb-3">Annually Hiring Process</h2>
  <ResponsiveContainer width="100%" height={130}>
    <BarChart data={barData}>
      {/* Hide X-axis line and labels */}
      <XAxis dataKey="name" axisLine={false} tick={false} />
      {/* Hide Y-axis line and labels */}
      <YAxis axisLine={false} tick={false} />
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

              {/* Language Usage */}
              <div className="bg-white rounded-[10px] shadow-sm p-5 w-[457px] h-[150px] opacity-100">
                <h2 className="font-semibold text-gray-700 mb-3">Language Usage</h2>
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={lineData}>
                    <XAxis dataKey="name" stroke="#374151" />
                    <YAxis stroke="#374151" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="uv"
                      stroke="#eab308"
                      strokeWidth={3}
                      dot={{ r: 5, stroke: "#0f172a", strokeWidth: 1 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Column (Skills Card) */}
            <div className="bg-white rounded-[10px] shadow-sm p-5 w-[341px] h-[374px] opacity-100">
              <h2 className="font-semibold text-gray-700 mb-4">
                Mostly Asked Technical Skill
              </h2>
              <div className="flex flex-wrap gap-3">
                {[
                  "Artificial Intelligence",
                  "Machine Learning",
                  "Data Analysis & Science",
                  "Cloud Computing",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:bg-yellow-100 transition"
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

export default HrDashboard;