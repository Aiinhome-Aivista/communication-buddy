import React, { useEffect, useMemo, useState } from "react";
import { fetchHrDashboard, fatchedPostRequest, postURL } from "../../../services/ApiService";
import Loader from "../../ui/Loader";
import SessionModal from "../../modal/SessionModal";
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
import groupLogo from "../../../assets/logo/group.svg";
import trending_up from "../../../assets/logo/trending_up.svg";
import trending_down from "../../../assets/logo/trending_down.png";
import * as SIIcons from "react-icons/si";
import { FaCode } from "react-icons/fa";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const HrDashboard = () => {
  const COLORS = ["#0f172a", "#DFB916"];
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [animateBars, setAnimateBars] = useState(false);
  const [userData, setUserData] = useState([]);
  const [topics, setTopics] = useState([]);


  const hrId =
    typeof window !== "undefined" ? sessionStorage.getItem("user_id") : null;

  useEffect(() => {
    const load = async () => {
      if (!hrId) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetchHrDashboard(hrId);
        const success =
          res?.success === true ||
          res?.status === 200 ||
          res?.statusCode === 200 ||
          res?.status === "success";
        if (!success) {
          setError("Error fetching data: Failed to fetch");
          setData(null);
        } else {
          const payload =
            res && typeof res === "object" && "data" in res ? res.data : res;
          setData(payload || {});
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching data: Failed to fetch");
        setData({});
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [hrId]);

  //session modal data fetch
  useEffect(() => {
    const fetchUserAndTopics = async () => {
      if (!hrId) return;
      try {
        const JsonBody = { hr_id: hrId };
        const response = await fatchedPostRequest(postURL.hrTopicCandidate, JsonBody);
        if (response.success === true || response.status === 200) {
          setUserData(response.candidates || []);
          setTopics(response.topics || []);
        }
      } catch (error) {
        console.error('Error fetching modal data', error.message);
      }
    };
    if (modalOpen) {
      fetchUserAndTopics();
    }
  }, [modalOpen, hrId]);

  const sessionCompletion = data?.session_completion || {};
  const completionTotal =
    (Number(sessionCompletion.completed) || 0) +
    (Number(sessionCompletion.pending) || 0);
  const completedPct =
    completionTotal > 0
      ? Math.round(
        (Number(sessionCompletion.completed || 0) / completionTotal) * 100
      )
      : 0;
  const pendingPct =
    completionTotal > 0
      ? Math.round(
        (Number(sessionCompletion.pending || 0) / completionTotal) * 100
      )
      : 0;

  const pieData = useMemo(() => {
    const c = Number(sessionCompletion.completed) || 0;
    const p = Number(sessionCompletion.pending) || 0;
    return [
      { name: "Completed", value: c },
      { name: "Pending", value: p },
    ];
  }, [sessionCompletion]);

  const barData = useMemo(() => {
    const list = Array.isArray(data?.anuallyHiringProcess)
      ? data.anuallyHiringProcess
      : [];
    return list.map((it, idx) => ({
      name: String(it.month || it.name || idx + 1).slice(0, 3),
      uv: Number(it.sessions ?? it.value ?? 0),
    }));
  }, [data]);

  const lineData = useMemo(() => {
    const list = Array.isArray(data?.language_usage) ? data.language_usage : [];
    return list.map((obj) => {
      const [name, uv] = Object.entries(obj)[0]; // extract language and value
      return { name, uv };
    });
  }, [data]);


  const mostAskedTechnologies = Array.isArray(data?.top_technical_skills)
    ? data.top_technical_skills
    : [];
  const mostTopTechnologies = Array.isArray(
    data?.top_technologies
  )
    ? data.top_technologies
    : [];

  const sessionReport = data?.session_report || {};

  const activeParticipant =
    sessionReport?.activeParticipants ?? sessionReport?.active_participant ?? 0;
  const avgSessionDuration =
    sessionReport?.averageSessionDuration ??
    sessionReport?.average_session_duration ??
    0;
  const sessionCreated =
    sessionReport?.totalSessionsCreated ??
    sessionReport?.session_created ??
    0;
  const userTraffic =
    sessionReport?.userTraffic ?? sessionReport?.user_traffic ?? 0;
  const averageScore =
    sessionReport?.averageScore ?? sessionReport?.average_score ?? 0;

  const commRaw = sessionReport?.session_type?.communication ?? 0;
  const techRaw = sessionReport?.session_type?.technology ?? 0;

  // Ensure both bars share the same base width using percentage of total
  const totalType = Math.max(1, Number(commRaw) + Number(techRaw));
  const commWidthPct = `${Math.round((Number(commRaw) / totalType) * 100)}%`;
  const techWidthPct = `${Math.round((Number(techRaw) / totalType) * 100)}%`;

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

  useEffect(() => {
    if (!loading && data) {
      // Delay to allow smooth entry animation
      setTimeout(() => setAnimateBars(true), 300);
    }
  }, [loading, data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#182938C2", // dark background
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


  // const getTechIcon = (name) => {
  //   if (!name) return FaCode; // fallback
  //   const key = name
  //     .toLowerCase()
  //     .replace(/\+/g, "plus")
  //     .replace(/\s/g, ""); // normalize key

  //   // Map normalized names to actual icon names
  //   const mapping = {
  //     python: "SiPython",
  //     angular: "SiAngular",
  //     "apache kafka": "SiApachKafka", // Apache Kafka
  //     css: "SiCss3",
  //     dash: "SiPlotly", // Dash is from Plotly
  //     dom: "SiJavascript", // Closest icon for DOM
  //     elasticsearch: "SiElasticsearch",
  //     html: "SiHtml5",
  //     javascript: "SiJavascript",
  //     jsx: "SiReact", // JSX is used in React
  //     react: "SiReact",
  //     pandas: "SiPandas",
  //     pyspark: "SiApachespark",
  //     streamlit: "SiStreamlit",
  //     tensorflow: "SiTensorflow",
  //     "c++": "SiCplusplus",
  //     c: "SiC",
  //     java: "SiJava",
  //     php: "SiPhp",
  //     mysql: "SiMysql",
  //     oracle: "SiOracle",
  //     swift: "SiSwift",
  //   };


  //   const iconName = mapping[key];
  //   return iconName && SIIcons[iconName] ? SIIcons[iconName] : FaCode;
  // };




  if (loading) return <Loader show text="Loading HR dashboard..." />;

  return (
    <div className="w-screen h-screen overflow-auto bg-[#ECEFF2] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <button
          className="flex items-center gap-2 bg-[#E5B800] hover:bg-yellow-500 text-[#272727] font-semibold px-8 py-2 rounded-xl shadow-none cursor-pointer"
          onClick={() => setModalOpen(true)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Session
        </button>
      </div>

      {error && (
        <div className="w-full flex items-center justify-center py-16">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      {!error && (
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT COLUMN */}
          <div className="col-span-12 md:col-span-3 flex flex-col space-y-6">
            {/* Session Completion */}
            <div className="bg-white rounded-xl shadow-sm p-4 w-full h-[220px]">
              <h2 className="text-[#8F96A9] mb-2 text-[15px] font-inter font-sm">
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
                    isAnimationActive={true}
                    animationBegin={animateBars ? 300 : 0}
                    animationDuration={700}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="flex justify-center gap-8 mt-1 text-xs font-medium">
                <div className="flex flex-col items-center">
                  <div className="font-bold text-[20px]">{completedPct}%</div>
                  <div className="text-[12px] text-[#8F96A9] ">Completed</div>
                </div>
                <div className="flex flex-col items-center text-[#DFB916]">
                  <div className="font-bold text-[20px]">{pendingPct}%</div>
                  <div className="text-[12px] text-[#8F96A9]">Pending</div>
                </div>
              </div>
            </div>

           
            {/* Mostly Asked Tech */}
            <div className="bg-white rounded-xl shadow-sm p-4 w-full h-full">
              <h2 className="font-normal text-[#8F96A9] mb-6">
                Mostly Asked Technology
              </h2>
            {mostTopTechnologies.length > 0 ? (
              <div className="grid grid-cols-4 gap-4 mt-4 place-items-center">
                {mostTopTechnologies.slice(0, 16).map((tech, idx) => {
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
              <div className="flex items-center justify-center h-full text-[#8F96A9] text-sm">
                No data found
              </div>
            )}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="col-span-12 md:col-span-9 flex flex-col space-y-6">
            {/* Session Report */}
            <div className="bg-white rounded-xl shadow-sm p-1 px-4 w-full h-[220px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[15px] text-[#8F96A9]">Session Report</h2>

                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <img src={groupLogo} alt="Group" className="w-5 h-5" />
                    <span className="font-bold text-[20px] text-[#8F96A9]">
                      {activeParticipant}
                    </span>
                  </div>
                  <span className="text-[12px] text-[#8F96A9] -ml-7">
                    Active participant
                  </span>

                </div>
              </div>
              <div className="font-inter font-normal text-[13px] leading-none tracking-normal align-middle text-[#8F96A9] mb-3">
                Session type
              </div>

              {/* Bars */}

              <div className="space-y-3 max-w-[500px]">
                {/* Communication Bar */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 bg-slate-200 h-6 rounded-sm overflow-hidden relative">
                    <div
                      className="h-6 rounded-sm flex items-center pl-2 transition-all duration-700 ease-in-out"
                      style={{
                        width: `${(commRaw / Math.max(1, sessionCreated)) * 100}%`,
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
                    <span className="text-xs text-[#8F96A9] font-medium">{commRaw}</span>
                  </div>
                </div>

                {/* Technology Bar */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 bg-slate-200 h-6 rounded-sm overflow-hidden relative">
                    <div
                      className="h-6 rounded-sm flex items-center pl-2 transition-all duration-700 ease-in-out"
                      style={{
                        width: `${(techRaw / Math.max(1, sessionCreated)) * 100}%`,
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
                    <span className="text-xs text-[#8F96A9] font-medium">{techRaw}</span>
                  </div>
                </div>
              </div>






              {/* Bottom Stats */}
              <div className="flex justify-between items-center mt-4 text-sm font-medium text-slate-900">
<div className="flex flex-col items-center">
  <div className="text-[#8F96A9] text-[20px]">
    {/* Integer part - Bold */}
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,   // Bold
        fontStyle: "normal",
        fontSize: "20px",
        lineHeight: "100%",
        letterSpacing: "0%",
        textAlign: "center",
        verticalAlign: "middle",
      }}
    >
      {String(avgSessionDuration).split(".")[0]}
    </span>

    {/* Decimal part - Light */}
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 300,   // Light
        fontStyle: "normal",
        fontSize: "20px",
        lineHeight: "100%",
        letterSpacing: "0%",
        textAlign: "center",
        verticalAlign: "middle",
      }}
    >
      .{String(avgSessionDuration).split(".")[1] || "00"}
    </span>
  </div>

  {/* Label text - Medium */}
<div className="text-[12px] text-[#8F96A9] font-normal"
  >
    Average Session Duration
  </div>
</div>


                <div className="flex flex-col items-center">
                  <div className="font-bold text-[20px] text-[#8F96A9]">{sessionReport.totalSessionsCreated}</div>
                  <div className="text-[12px] text-[#8F96A9] font-normal">Session Created</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 font-bold text-[#8F96A9]">
                    <div className="font-bold text-[20px]">
       {sessionReport.userTraffic}
                    </div>
                    {sessionReport?.progress_indicator === "up" ? (
                      <img src={trending_up} alt="Up" className="w-5 h-5" />
                    ) : sessionReport?.progress_indicator === "down" ? (
                      <img src={trending_down} alt="Down" className="w-5 h-5" />
                    ) : null}
                  </div>
                  <div className="text-[12px] text-[#8F96A9] font-normal">User Traffic</div>
                </div>

<div className="flex flex-col items-center">
  <div className="flex text-[20px] text-[#8F96A9]">
    {(() => {
      const score = Number(averageScore);
      const rounded = Number.isFinite(score) ? score.toFixed(2) : "0.00";
      const [intPart, decPart] = rounded.split(".");
      return (
        <>
          <span className="font-bold">{intPart}</span>
          <span className="font-light" style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}>
            .{decPart}
          </span>
        </>
      );
    })()}
  </div>
  <div className="text-[12px] text-[#8F96A9] font-normal">Average Score</div>
</div>

              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex flex-col gap-6 w-full md:w-2/3">
                <div className="bg-[#DFB916] rounded-xl shadow-sm p-4 h-[200px] flex flex-col">
                  <h2 className="font-normal mb-3 text-[#3D5B81]">
                    Annually Hiring Process
                  </h2>
                  <div className="flex-1">
                    <ResponsiveContainer>
                      <BarChart data={barData}>
                        <XAxis dataKey="name" hide />
                        <YAxis
                          stroke="#182938"
                          axisLine
                          tickLine={false}
                          tick={{ fill: "#182938", fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Bar
                          dataKey="uv"
                          fill="#182938"
                          barSize={25}
                          radius={[6, 6, 0, 0]}
                          isAnimationActive={true}
                          animationBegin={animateBars ? 300 : 0}
                          animationDuration={700}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 h-[200px] overflow-hidden">
                  <h2 className="font-normal text-[#8F96A9]">
                    Language Usage
                  </h2>

                  {lineData.length > 0 ? (
                    <div className="w-full h-[100px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={lineData}
                          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                        >
                          <XAxis dataKey="name" hide />
                          <YAxis hide />
                          <Tooltip
                            cursor={false}
                            content={({ active, payload }) =>
                              active && payload && payload.length ? (
                                <div className="bg-[#FEEFC3] px-4 rounded-sm text-[#DFB916] font-normal text-sm shadow-md">
                                  {`${payload[0].payload.name} ${payload[0].value}`}
                                </div>
                              ) : null
                            }
                          />
                          <Line
                            type="monotone"
                            dataKey="uv"
                            stroke="#DFB916"
                            strokeWidth={3}
                            dot={{
                              r: 5,
                              fill: "#DFB916",
                              stroke: "#DFB916",
                              strokeWidth: 2,
                              opacity: 0.9,
                            }}

                            activeDot={{
                              r: 8,
                              fill: "#DFB916",
                              stroke: "#fff",
                              strokeWidth: 3,
                            }}
                            isAnimationActive={true}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[80px] text-[#8F96A9] text-sm">
                      no data found
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white shadow-sm p-4 rounded-xl w-full md:w-1/3 h-full flex-shrink-0">
                <h2 className="font-normal text-[#8F96A9] mb-6">
                  Mostly Asked Technical Skill
                </h2>
                {mostAskedTechnologies.length > 0 ? (
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    spacing={1.5}
                    useFlexGap
                    justifyContent="center"
                    mt={2}
                  >
                    {mostAskedTechnologies.map((skill, i) => (
                      <Chip
                        key={`${skill}-${i}`}
                        label={skill}
                        title={skill}
                        variant="outlined"
                        sx={{
                          bgcolor: "#D9D9D933",
                          color: "#8F96A9",
                          borderColor: "#3D5B81",
                          borderWidth: 1,
                          borderRadius: "25px",
                          px:2,
                          "& .MuiChip-label": {
                            fontSize: "0.61rem",
                            fontWeight: 400,
                          },
                          "&:hover": {
                            bgcolor: "#ECEFF2",
                          },
                        }}
                      />
                    ))}
                  </Stack>
                ) : (
                  <div className="flex items-center justify-center h-full text-[#8F96A9] text-sm">
                    no data found
                  </div>
                )}


              </div>
            </div>
          </div>
        </div>
      )}

      <SessionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sessionDuration={sessionDuration}
        setSessionDuration={setSessionDuration}
        userData={userData}
        topics={topics}
        onSave={() => setModalOpen(false)}
      />
    </div>
  );
};

export default HrDashboard;
