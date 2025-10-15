import { postURL, fatchedPostRequest } from "../../../services/ApiService";
import groupLogo from "../../../assets/logo/group.svg";
import trending_up from "../../../assets/logo/trending_up.svg";
import trending_down from "../../../assets/logo/trending_down.png";
import assignmentIcon from "../../../../public/assets/icons/assignment.png";
import { KeyboardArrowDown, IntegrationInstructions, Css, Html, Javascript, Code, TableChart, Bolt, ShowChart, Science, DataObject } from "@mui/icons-material";
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

    return list.map((item, idx) => {
      // Each item is an object with one key-value pair
      const [key, value] = Object.entries(item)[0] || [`Language ${idx + 1}`, 0];
      return {
        name: key, // language name
        uv: Number(value ?? 0), // count
      };
    });
  }, [dashboardData]);


  const mostAskedTechnologies = Array.isArray(dashboardData?.most_asked_technologies)
    ? dashboardData.most_asked_technologies
    : Array.isArray(dashboardData?.top_technologies)
      ? dashboardData.top_technologies
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



  const CustomTooltip1 = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#DFB91614", // light transparent background
            padding: "6px 10px",
            borderRadius: "8px",
            border: "1px solid #DFB91633",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{// solid background for text
              color: "#DFB916", // readable dark text
              fontWeight: 600,
              fontSize: "13px",
              padding: "3px 8px",
              borderRadius: "4px",
              textTransform: "capitalize",
            }}
          >
            {label} : {payload[0].value}
          </span>
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


  // Map technology names to Material UI icon components
  const getTechIcon = (name) => {
    const key = (name || "").toLowerCase();
    switch (key) {
      // Frontend Technologies
      case "react":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg";
      case "angular":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg";
      case "vue":
      case "vue.js":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg";
      case "svelte":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg";
      case "nextjs":
      case "next.js":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg";

      // Web Technologies
      case "html":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg";
      case "css":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg";
      case "javascript":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg";
      case "typescript":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg";
      case "jsx":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg";
      case "sass":
      case "scss":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg";
      case "tailwind":
      case "tailwindcss":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg";

      // Backend Technologies
      case "nodejs":
      case "node.js":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg";
      case "express":
      case "expressjs":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg";
      case "nestjs":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg";
      case "fastapi":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg";
      case "flask":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg";
      case "django":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg";

      // Programming Languages
      case "python":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg";
      case "java":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg";
      case "c++":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg";
      case "c":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg";
      case "c#":
      case "csharp":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg";
      case "php":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg";
      case "ruby":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg";
      case "go":
      case "golang":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg";
      case "rust":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg";
      case "swift":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg";
      case "kotlin":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg";
      case "scala":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg";

      // Databases
      case "mysql":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg";
      case "postgresql":
      case "postgres":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg";
      case "mongodb":
      case "mongo":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg";
      case "redis":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg";
      case "sqlite":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg";
      case "oracle":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg";

      // Cloud & DevOps
      case "aws":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg";
      case "azure":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg";
      case "gcp":
      case "google cloud":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg";
      case "docker":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg";
      case "kubernetes":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg";
      case "jenkins":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg";

      // Data Science & AI
      case "tensorflow":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg";
      case "pytorch":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg";
      case "pandas":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg";
      case "numpy":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg";
      case "jupyter":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg";
      case "streamlit":
        return "https://streamlit.io/images/brand/streamlit-mark-color.svg";

      // Tools & Others
      case "git":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg";
      case "github":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg";
      case "gitlab":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg";
      case "vscode":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg";
      case "apache kafka":
      case "kafka":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg";
      case "elasticsearch":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg";
      case "nginx":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg";
      case "apache":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg";
      case "pyspark":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg";
      case "dash":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/plotly/plotly-original.svg";
      case "dom":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg";

      // Mobile Development
      case "android":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg";
      case "flutter":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg";
      case "react native":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg";

      default:
        return "https://via.placeholder.com/40x40/f3f4f6/9ca3af?text=%3F"; // Gray placeholder with question mark
    }
  };



  return (
    <div className="w-[100%] h-[100%] overflow-auto bg-[#ECEFF2] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-3">
          {/* Main action button */}
          {/* <button className="bg-[#DFB916] hover:bg-[#c8a514] px-4 py-2 rounded-md font-semibold text-gray-900 flex items-center gap-2">
            <img src={assignmentIcon} alt="assignment" className="w-5 h-5" />
            <span>Ongoing session</span>
          </button> */}
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
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "15px",
                verticalAlign: "middle",
                display: "inline-block",
                padding: "2px 6px",
                borderRadius: "4px",
                color: "#8F96A9",
              }}
            >
              Mostly Asked Technology
            </h2>

            {mostAskedTechnologies.length > 0 ? (
              <div className="grid grid-cols-4 gap-4 mt-4 place-items-center">
                {mostAskedTechnologies.slice(0, 16).map((tech, idx) => {
                  const iconSrc = getTechIcon(tech);
                  return (
                    <div
                      key={`${tech}-${idx}`}
                      className="w-[65px] h-[65px] flex items-center justify-center bg-gray-100 rounded"
                      title={tech}
                    >
                      <img
                        src={iconSrc}
                        alt={tech || "Technology"}
                        className="w-[40px] h-[40px] object-contain"
                        onError={(e) => {
                          // If image fails to load, show placeholder
                          e.target.src = "https://via.placeholder.com/40x40/f3f4f6/9ca3af?text=%3F";
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                No data found
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
                  Assigned Test
                </span>
              </div>
            </div>

            {/* Session Type Label */}
            <div className="font-inter font-normal text-[12px] leading-none tracking-normal align-middle text-gray-500 mb-1">
              Session type
            </div>

            <div className="space-y-3 max-w-[500px]">
              {/* Communication Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 bg-slate-200 h-6 rounded-sm overflow-hidden relative">
                  <div
                    className="h-6 rounded-sm flex items-center pl-2 transition-all duration-700 ease-in-out"
                    style={{
                      width: `${commWidth}%`,
                      backgroundColor: "#0f172a",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <span className="text-xs text-white">Communication</span>
                  </div>
                </div>
                <div className="w-10 text-right">
                  <span className="text-xs text-gray-700 font-medium">{commCount}</span>
                </div>
              </div>

              {/* Technology Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 bg-slate-200 h-6 rounded-sm overflow-hidden relative">
                  <div
                    className="h-6 rounded-sm flex items-center pl-2 transition-all duration-700 ease-in-out"
                    style={{
                      width: `${techWidth}%`,
                      background: "linear-gradient(90deg, #DFB916 0%, #F5D85B 100%)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <span className="text-xs text-gray-900">Technology</span>
                  </div>
                </div>
                <div className="w-10 text-right">
                  <span className="text-xs text-gray-700 font-medium">{techCount}</span>
                </div>
              </div>
            </div>


            {/* Bottom Stats */}
            <div className="flex justify-between items-center mt-6 text-sm font-medium text-slate-900">
              <div className="flex flex-col items-center">
                <div className="text-[#8F96A9] text-[20px]">
                  {/* Split integer and decimal parts */}
                  {sessionReport.average_session_duration ? (
                    <>
                      {/* Integer part - Bold */}
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700, // Bold
                          fontStyle: "normal",
                          fontSize: "20px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        {String(sessionReport.average_session_duration).split(".")[0]}
                      </span>

                      {/* Decimal part - Light */}
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 300, // Light
                          fontStyle: "normal",
                          fontSize: "20px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        .{String(sessionReport.average_session_duration).split(".")[1] || "00"}
                      </span>
                    </>
                  ) : (
                    "15.00"
                  )}
                </div>

                {/* Label text - Medium */}
                <div className="text-[12px] text-[#8F96A9] font-normal">
                  Average Session Duration
                </div>
              </div>


              <div className="flex flex-col items-center">
                <div className="font-bold text-[20px] text-[#8F96A9]">
                  {sessionReport.test_attempted ?? "0"}
                </div>
                <div className="text-[12px] text-[#8F96A9] font-normal">
                  Test Attempted
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 font-semibold">
                  {/* Score */}
                  <div className="text-[20px] text-[#8F96A9] flex items-center">
                    {(() => {
                      const score = Number(sessionReport.highest_score) || 0;
                      const rounded = score.toFixed(2); // ensures 2 decimals
                      const [intPart, decPart] = rounded.split(".");
                      return (
                        <>
                          <span className="font-bold">{intPart}</span>
                          <span
                            className="font-light"
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 300,        // Light
                              fontStyle: "normal",
                              fontSize: "20px",
                              lineHeight: "100%",
                              letterSpacing: "0%",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            .{decPart}
                          </span>
                        </>
                      );
                    })()}
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
                <div className="text-[20px] text-[#8F96A9] flex">
                  {(() => {
                    const score = Number(sessionReport.average_score);
                    const rounded = Number.isFinite(score) ? score.toFixed(1) : "0.0";
                    const [intPart, decPart] = rounded.split(".");
                    return (
                      <>
                        <span className="font-bold">{intPart}</span>
                        <span
                          className="font-light"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 300, // Light
                            fontSize: "20px",
                          }}
                        >
                          .{decPart}
                        </span>
                      </>
                    );
                  })()}
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
                      <Tooltip content={<CustomTooltip1 />} cursor={false} />
                      <Line
                        type="monotone"
                        dataKey="uv"
                        stroke="#DFB916"
                        strokeWidth={2}
                        dot={{
                          r: 4,
                          fill: "#DFB916",
                          stroke: "#0f172a",
                          strokeWidth: 1,
                        }}
                        activeDot={{ r: 4, fill: "#DFB916" }}
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
