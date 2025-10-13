import pythonLogo from "../../../assets/logo/python.svg";
import { postURL, fatchedPostRequest } from "../../../services/ApiService";
// import cppLogo from "../../../assets/logo/cpp.svg";
// import reactLogo from "../../../assets/logo/react.svg";
// import appleLogo from "../../../assets/logo/apple.svg";
// import phpLogo from "../../../assets/logo/php.svg";
// import javaLogo from "../../../assets/logo/java.svg";
// import mysqlLogo from "../../../assets/logo/mysql.svg";
// import oracleLogo from "../../../assets/logo/oracle.svg";
import groupLogo from "../../../assets/logo/group.svg";
import trending_up from "../../../assets/logo/trending_up.svg";
import trending_down from "../../../assets/logo/trending_down.png";
import assignmentIcon from "../../../../public/assets/icons/assignment.png"; // <-- ADDED THIS LINE
import { KeyboardArrowDown } from "@mui/icons-material";
import { useState, useEffect, useMemo } from "react";

import personImage from "../../../assets/logo/person.jpg";

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

const CandidateDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let user_id = null;
    try {
      const directId = sessionStorage.getItem("user_id");
      if (directId) {
        user_id = Number(directId);
      } else {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        user_id = storedUser?.user_id ? Number(storedUser.user_id) : null;
      }
    } catch (err) {
      console.warn("Error reading user from sessionStorage", err);
      user_id = null;
    }
    console.log("User ID from sessionStorage:", user_id);

    const fetchDashboardData = async () => {
      if (!user_id) {
        console.warn(
          "No user_id found in sessionStorage. Skipping dashboard API call."
        );
        setLoading(false);
        return;
      }
      try {
        const result = await fatchedPostRequest(postURL.dashboard, { user_id });
        if (result?.status === "success") {
          setDashboardData(result.data);
        } else {
          console.error("Dashboard fetch failed:", result?.message || result);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const COLORS = ["#0f172a", " #DFB916"];
  const { session_completion = { completed: 0, pending: 0 } } =
    dashboardData || {};

  const pieData = [
    { name: "Completed", value: session_completion?.completed || 0 },
    { name: "Pending", value: session_completion?.pending || 0 },
  ];

  const barData = useMemo(() => {
    const list = Array.isArray(dashboardData?.last_twelve_test_scores)
      ? dashboardData.last_twelve_test_scores
      : [];
    return list.map((score, idx) => ({
      name: `T${idx + 1}`,
      uv: Number(score) || 0,
    }));
  }, [dashboardData]);



  const lineData = useMemo(() => {
    const list = Array.isArray(dashboardData?.language_usage)
      ? dashboardData.language_usage
      : [];
    return list.map((it, idx) => ({
      name: it.name || it.lang || String(idx + 1),
      uv: Number(it.uv ?? it.value ?? 0),
    }));
  }, [dashboardData]);

  const mostAskedTechnologies = Array.isArray(dashboardData?.most_asked_technologies)
    ? dashboardData.most_asked_technologies
    : [];

  const mostDiscussedSkills = Array.isArray(
    dashboardData?.most_discussed_technical_skills
  )
    ? dashboardData.most_discussed_technical_skills
    : [];


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#182938", // dark background
            color: "#fff",               // white text
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "600",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            pointerEvents: "none",       // prevents mouse interference
            transform: "translateY(-8px)", // lifts above the bar
            whiteSpace: "nowrap",
          }}
        >
          <div>
            {` ${payload[0].value}`}</div>
        </div>
      );
    }
    return null;
  };







  const topScores = (dashboardData?.top_five_test_scores || []).map(
    (s) => ({
      name: s.hr_name || "-",
      topic: s.topic || "-",
      score: s.score || "-",
    })
  );

  const sessionReport = dashboardData?.session_report || {};
  const lastTwelveScores = dashboardData?.last_twelve_test_scores || [];
  const sessionType = sessionReport.session_type || {
    communication: 0,
    technology: 0,
  };
  const commCount = Number(sessionType.communication) || 0;
  const techCount = Number(sessionType.technology) || 0;
  const totalType = commCount + techCount || 1;
  const commWidth = Math.round((commCount / totalType) * 100);
  const techWidth = Math.round((techCount / totalType) * 100);

  return (
    <div className="w-[100%] h-[100%] overflow-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-3">
          {/* Main action button */}
          <button className="bg-[#DFB916] hover:bg-[#c8a514] px-4 py-2 rounded-md font-semibold text-gray-900 flex items-center gap-2">
            <img src={assignmentIcon} alt="assignment" className="w-5 h-5" />
            <span>Ongoing session</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <div className="col-span-12 md:col-span-3 flex flex-col space-y-6">
          {/* Session Completion */}
          <div className="bg-white rounded-2xl shadow-sm p-3 w-full h-[220px]">
            <h2
              style={{
                fontFamily: "Inter",
                fontWeight: 400,             // Regular
                fontStyle: "normal",         // Regular style
                fontSize: "15px",
                verticalAlign: "middle",  // Added background
                display: "inline-block",     // Ensures padding and background behave correctly
                padding: "2px 6px",          // Optional: add padding to make background visible
                borderRadius: "4px",         // Optional: rounded corners for design
                color: "#8F96A9",              // Assuming white text on colored background
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
                  cornerRadius={6}
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
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "20px",
                  }}
                >
                  {dashboardData?.session_completion
                    ? `${dashboardData.session_completion.completed}%`
                    : "0%"}
                </div>
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "#8F96A9",
                  }}
                >
                  Completed
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "20px",

                    color: " #DFB916",
                  }}
                >
                  {dashboardData?.session_completion
                    ? `${dashboardData.session_completion.pending}%`
                    : "0%"}
                </div>

                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "#8F96A9",
                  }}
                >
                  Pending
                </div>
              </div>
            </div>
          </div>

          {/* Mostly Asked Tech */}
          <div className="bg-white rounded-[10px] shadow-sm p-5 w-full h-[374px]">
            <h2 style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,           // Regular
              fontStyle: "normal",       // Regular style
              fontSize: "15px",
              verticalAlign: "middle",
              display: "inline-block",
              padding: "2px 6px",
              borderRadius: "4px",
              color: "#8F96A9",
            }}>
              Mostly Asked Technology
            </h2>
            {mostAskedTechnologies.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 justify-items-center mt-4 text-sm">
                {mostAskedTechnologies.map((tech, idx) => (
                  <span
                    key={`${tech}-${idx}`}
                    className="bg-gray-100 px-3 py-1.5 rounded-full text-gray-700 hover:bg-yellow-100"
                    title={tech}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                no data found
              </div>
            )}
          </div>
        </div>

        {/* CENTER + RIGHT SECTION */}
        <div className="col-span-12 md:col-span-9 flex flex-col space-y-6">
          {/* Session Report */}
          <div className="bg-white rounded-2xl shadow-sm p-3 w-full h-[220px]">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <h2
                className="mb-4"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,           // Regular
                  fontStyle: "normal",       // Regular style
                  fontSize: "15px",
                  verticalAlign: "middle",
                  display: "inline-block",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  color: "#8F96A9",
                }}
              >
                Session Report
              </h2>

              <div className="flex flex-col items-start">
                {/* First line: icon + number */}
                <div className="flex items-center gap-2">
                  <img
                    src={groupLogo}
                    alt="Group Icon"
                    className="w-5 h-5 object-contain"
                  />
                  <span className="font-bold text-[20px] text-[#8F96A9]">
                    {sessionReport.assigned_test ?? "562"}
                  </span>
                </div>

                {/* Second line: label */}
                <span className="text-[12px] text-[#8F96A9] -ml-7">
                  Assigned_Test
                </span>
              </div>
            </div>

            {/* Session Type Label */}
            <div className="font-inter font-normal text-[12px] leading-none tracking-normal align-middle text-gray-500 mb-1">
              Session type
            </div>

            <div className="space-y-3">
              {/* Communication Bar */}
              <div className="flex items-center gap-3">
                {/* Bar with label inside */}
                <div className="bg-slate-200 w-full h-6 rounded-sm overflow-hidden relative">
                  <div
                    className="h-6 rounded-sm flex items-center pl-2"
                    style={{
                      width: `${commWidth}%`,
                      backgroundColor: "#0f172a",
                      whiteSpace: "nowrap",

                      textOverflow: "ellipsis",
                      transition: "width 0.3s ease",
                    }}
                  >
                    <span className="text-xs text-[#8F96A9]">Communication</span>
                  </div>
                </div>
                {/* Count outside the bar */}
                <span className="text-xs text-gray-700 font-medium w-8 text-right">
                  {commCount}
                </span>
              </div>

              {/* Technology Bar */}
              <div className="flex items-center gap-3">
                {/* Bar with label inside */}
                <div className="bg-slate-200 w-full h-6 rounded-sm overflow-hidden relative">
                  <div
                    className="h-6 rounded-sm flex items-center pl-2"
                    style={{
                      width: `${techWidth}%`,
                      backgroundColor: "#DFB916",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      transition: "width 0.3s ease",
                    }}
                  >
                    <span className="text-xs text-gray-900">Technology</span>
                  </div>
                </div>
                {/* Count outside the bar */}
                <span className="text-xs text-gray-700 font-medium w-8 text-right">
                  {techCount}
                </span>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="flex justify-between items-center mt-6 text-sm font-medium text-slate-900">
              <div className="flex flex-col items-center">
<div className="font-bold text-[20px] text-[#8F96A9]">
                  {sessionReport.average_session_duration ?? "15 minutes"}
                </div>
<div className="text-[12px] text-[#8F96A9] font-normal">
                  Average Session Duration
                </div>
              </div>

              <div className="flex flex-col items-center">
<div className="font-bold text-[20px] text-[#8F96A9]">
                  {sessionReport.test_attempted ?? 1256}
                </div>
<div className="text-[12px] text-[#8F96A9] font-normal">
                  Test Attempted
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 font-semibold">
                  {/* Score */}
<div className="font-bold text-[20px] text-[#8F96A9]">
                    {Math.round(Number(sessionReport.highest_score) || 0)}
                  </div>

                  {/* Check indicator first, then show icon */}
                  {sessionReport?.highest_score === "up" ? (
                    <img
                      src={trending_up}
                      alt="Trending Up"
                      className="w-5 h-5 object-contain"
                    />
                  ) : sessionReport?.highest_score === "down" ? (
                    <img
                      src={trending_down}
                      alt="Trending Down"
                      className="w-5 h-5 object-contain"
                    />
                  ) : null}
                </div>

                {/* Label */}
<div className="text-[12px] text-[#8F96A9] font-normal">
                  Highest Score
                </div>
              </div>

              <div className="flex flex-col items-center">
<div className="font-bold text-[20px] text-[#8F96A9]">
                  {Math.round(sessionReport.average_score) ?? 64}
                </div>
<div className="text-[12px] text-[#8F96A9] font-normal">
                  Average Score
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row (Charts + Skills Card) */}
          <div className="flex flex-col md:flex-row justify-between w-full gap-6">
            {/* Charts Column */}
            <div className="flex flex-col gap-6 w-full md:w-2/3">
              {/* Annually Hiring Process */}
              <div className="bg-[#DFB916] rounded-[10px] shadow-sm p-5 w-full h-[198px] flex flex-col">
                <h2 style={{
                  fontFamily: "Inter",
                  fontWeight: 400,           // Regular
                  fontStyle: "normal",       // Regular style
                  fontSize: "15px",
                  verticalAlign: "middle",
                  display: "inline-block",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  color: "#3D5B81",

                }}>
                  Last 12 Test Score
                </h2>

                <div className="flex-1 -ml-8"> {/* optional: move slightly left for alignment */}
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      barCategoryGap="2%"
                    >
                      <XAxis dataKey="name" hide />
                      <YAxis
                        stroke="#182938"
                        axisLine={true}
                        tickLine={false}
                        tick={{ fill: "#182938", fontSize: 18 }}
                      />
                      {/* Use custom tooltip */}
                      <Tooltip content={<CustomTooltip />} cursor={false} />
                      <Bar
                        dataKey="uv"
                        fill="#182938"
                        barSize={Math.max(12, 45 - barData.length * 2)} // dynamic size
                        radius={[6, 6, 6, 6]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>




              {/* Language Usage */}
              <div className="bg-white rounded-[10px] shadow-sm p-5 h-[150px]">
                <h2 style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,           // Regular
                  fontStyle: "normal",       // Regular style
                  fontSize: "15px",
                  verticalAlign: "middle",
                  display: "inline-block",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  color: "#8F96A9",
                }}>
                  Language Usage
                </h2>
                {lineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={80}>
                    <LineChart data={lineData}>
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="uv"
                        stroke="#DFB916"
                        strokeWidth={3}
                        dot={{
                          r: 5,
                          fill: "#DFB916",
                          stroke: "#0f172a",
                          strokeWidth: 1,
                        }}
                        activeDot={{ r: 7, fill: "#DFB916" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[80px] text-gray-500 text-sm">
                    no data found
                  </div>
                )}
              </div>
            </div>

            <>
              <style>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;     /* Firefox */
    }
  `}</style>
              <div
                style={{ height: "400px", overflowY: "auto" }}
                className="scrollbar-hide w-full md:w-1/2"
              >
                <h2
                  className="mb-4"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,           // Regular
                    fontStyle: "normal",       // Regular style
                    fontSize: "15px",
                    verticalAlign: "middle",
                    display: "inline-block",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    color: "#8F96A9",
                  }}
                >

                  Top 5 Session Score
                </h2>
                <div className="space-y-3 h-82 overflow-y-auto scrollbar-hide">
                  {topScores.length > 0 ? (
                    topScores.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                      >
                        {/* Left content */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-semibold">
                            <span className="material-icons text-gray-400 text-[18px]">
                              <img
                                src={personImage}
                                alt="Person"
                                className="w-8 h-8 rounded-full"
                              />
                            </span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 leading-none mt-[2px]">
                              Assigned by
                            </span>
                            <span className="font-medium text-[13px] text-[#2C2E42] leading-tight">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-gray-600 truncate max-w-[140px] mt-[4px] text-left w-full">
                              Topic: {item.topic}
                            </span>
                          </div>
                        </div>
                        {/* Right side */}
                        <div className="flex flex-col items-end">
                          <span className="text-[15px] font-semibold text-[#2C2E42] leading-tight">
                            {item.score}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            Score
                          </span>
                          <KeyboardArrowDown
                            style={{
                              fontSize: "16px",
                              color: "#B0B3B8",
                              marginTop: "2px",
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 pt-10">No top scores found.</p>
                  )}
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
