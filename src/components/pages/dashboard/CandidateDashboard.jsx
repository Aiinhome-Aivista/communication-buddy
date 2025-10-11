import pythonLogo from "../../../assets/logo/python.svg";
import { postURL, fatchedPostRequest } from '../../../services/ApiService';
import cppLogo from "../../../assets/logo/cpp.svg";
import reactLogo from "../../../assets/logo/react.svg";
import appleLogo from "../../../assets/logo/apple.svg";
import phpLogo from "../../../assets/logo/php.svg";
import javaLogo from "../../../assets/logo/java.svg";
import mysqlLogo from "../../../assets/logo/mysql.svg";
import oracleLogo from "../../../assets/logo/oracle.svg";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useState, useEffect } from "react";
import Loader from '../../ui/Loader';
import assignmentIcon from '../../../../public/assets/images/assignment.png';



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
    // Some parts of the app store user_id directly (see AuthProvider), so prefer that.
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

    // debug
    console.log("User ID from sessionStorage:", user_id);

    const fetchDashboardData = async () => {
      if (!user_id) {
        console.warn('No user_id found in sessionStorage. Skipping dashboard API call.');
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

  const { session_completion = { completed: 0, pending: 0 } } = dashboardData || {};


  const pieData = [
    { name: "Completed", value: session_completion?.completed || 0 },
    { name: "Pending", value: session_completion?.pending || 0 },
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

  // fallback topScores (kept for UI when API doesn't return top_five_test_scores)
  const fallbackTopScores = [
    {
      name: "Debasish Sahoo",
      assignedBy: "Admin",
      topic: "Discuss about current impact of AI ...",
      score: 78,
    },
    {
      name: "Sanchari Karmakar",
      assignedBy: "Admin",
      topic: "Discuss about Datasince",
      score: 75,
    },
    {
      name: "Sayan Mitra",
      assignedBy: "Admin",
      topic: "Discuss about Neural Networking ...",
      score: 65,
    },
    {
      name: "Debasish Sahoo",
      assignedBy: "Admin",
      topic: "Discuss about Cloud Infrastructure ...",
      score: 63,
    },
    {
      name: "Priya Ghosh",
      assignedBy: "Admin",
      topic: "Discuss about Machine Learning ...",
      score: 61,
    },
  ];

  const topScores = dashboardData?.top_five_test_scores
    ? dashboardData.top_five_test_scores.map((s) => ({
      name: s.hr_name || "-",
      topic: s.topic || "-",
      score: s.score || "-",
    }))
    : fallbackTopScores;

  // derive values from API with fallbacks
  const sessionReport = dashboardData?.session_report || {};
  const lastTwelveScores = dashboardData?.last_twelve_test_scores || [];
  const sessionType = sessionReport.session_type || { communication: 0, technology: 0 };

  // compute percentages for session_type bars (avoid division by zero)
  const commCount = Number(sessionType.communication) || 0;
  const techCount = Number(sessionType.technology) || 0;
  const totalType = commCount + techCount || 1;
  const commWidth = Math.round((commCount / totalType) * 100);
  const techWidth = Math.round((techCount / totalType) * 100);

  return (
    <div className="w-[100%] h-[100%] overflow-auto bg-gray-50 p-6">
      <Loader show={loading} />
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
                  {dashboardData?.session_completion
                    ? `${dashboardData.session_completion.completed}%`
                    : "0%"}
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

                    color: 'black',
                  }}
                >
                  Pending
                </div>
              </div>

            </div>
          </div>

          {/* Technologies */}
          <div className="bg-white rounded-[10px] shadow-sm p-5 w-full h-[30%]">
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
                  <span className="font-inter font-bold text-[20px] leading-none align-middle text-gray-700">{sessionReport.assigned_test ?? '562'}</span>
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
                  <div className="bg-slate-900 h-5 rounded-md" style={{ width: `${commWidth}%` }}></div>
                </div>
                <span className="text-xs text-gray-700 font-medium ml-2">{commCount}</span>
              </div>

              {/* Technology Bar */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-24">Technology</span>
                <div className="bg-slate-200 w-full h-5 rounded-md relative">
                  <div className="bg-[#DFB916] h-5 rounded-md" style={{ width: `${techWidth}%` }}></div>
                </div>
                <span className="text-xs text-gray-700 font-medium ml-2">{techCount}</span>
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
                >{sessionReport.average_session_duration ?? '15 minutes'}</div>
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
                >{sessionReport.test_attempted ?? 1256}</div>
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
                  >{Math.round(sessionReport.average_score) ?? 245}</div>
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
                >{Math.round(sessionReport.average_score) ?? 64}</div>
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
              <div className="bg-[#DFB916] rounded-[10px] shadow-sm p-5 w-full h-[198px] flex flex-col">
                <h2 className="font-semibold mb-3" style={{ color: "#182938" }}>
                  Annually Hiring Process
                </h2>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="name" hide />
                      <YAxis
                        stroke="#182938"
                        axisLine={true}
                        tickLine={false}
                        tick={{ fill: "#182938", fontSize: 12 }}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="uv"
                        fill="#182938"
                        barSize={25}
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>


              {/* Language Usage */}
              <div className="bg-white rounded-[10px] shadow-sm p-5 w-full h-40">
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
   <div style={{ height: '400px', overflowY: 'auto' }} className="scrollbar-hide">
  <div className="bg-[#F7F9FB] p-6 rounded-2xl shadow-sm max-w-sm">
    <h2 className="font-semibold text-[#5A5F6B] text-[15px] mb-4">
      Top Five Test Score
    </h2>
    <div className="space-y-3 h-72 overflow-y-auto scrollbar-hide">
      {topScores.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
        >
          {/* Left content */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-semibold">
              <span className="material-icons text-gray-400 text-[18px]"></span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-[13px] text-[#2C2E42] leading-tight">
                {item.name}
              </span>
              <span className="text-[10px] text-gray-400 leading-none mt-[2px]">
                Assigned by
              </span>
              <span className="text-[11px] text-gray-600 truncate max-w-[160px] mt-[4px]">
                Topic: {item.topic}
              </span>
            </div>
          </div>
          {/* Right side */}
          <div className="flex flex-col items-end">
            <span className="text-[15px] font-semibold text-[#2C2E42] leading-tight">
              {item.score}
            </span>
            <span className="text-[10px] text-gray-400">Score</span>
            <KeyboardArrowDown
              style={{ fontSize: "16px", color: "#B0B3B8", marginTop: "2px" }}
            />
          </div>
        </div>
      ))}
    </div>
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
