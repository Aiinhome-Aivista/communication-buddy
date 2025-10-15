import React, { useEffect, useMemo, useState } from "react";
import { fetchHrDashboard, fatchedPostRequest, postURL } from "../../../services/ApiService";
import Loader from "../../ui/Loader";
import SessionModal from "../../modal/SessionModal";
import { KeyboardArrowDown } from "@mui/icons-material";
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
import assignmentIcon from "/assets/icons/assignment.png";
import Subtract from "../../../assets/logo/Subtract.svg";
import candidateIcon from "/public/assets/images/AT.png";
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LoaderNew from "../../ui/LoaderNew";
import { useMinLoaderTime } from "../../../hooks/useMinLoaderTime";

const HrCandidateDashboard = () => {
    const COLORS = ["#0f172a", "#DFB916"];
    const [modalOpen, setModalOpen] = useState(false);
    const [sessionDuration, setSessionDuration] = useState(15);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [data, setData] = useState(null);
    const [animateBars, setAnimateBars] = useState(false);
    const [userData, setUserData] = useState([]);
    const [topics, setTopics] = useState([]);

    // Get user role and ID
    const userRole = typeof window !== "undefined" ? sessionStorage.getItem("userRole") : null;
    const userId = typeof window !== "undefined" ? sessionStorage.getItem("user_id") : null;
    const isHR = userRole === 'hr';

    useEffect(() => {
        const load = async () => {
            if (!userId) {
                console.log("No userId found, skipping API call");
                return;
            }

            console.log("Loading dashboard for:", { userId, userRole, isHR });
            setLoading(true);
            setError("");
            try {
                let res;
                if (isHR) {
                    // Use HR dashboard API
                    console.log("Calling HR dashboard API");
                    res = await fetchHrDashboard(userId);
                } else {
                    // Use candidate dashboard API
                    console.log("Calling candidate dashboard API");
                    const JsonBody = { user_id: Number(userId) };
                    res = await fatchedPostRequest(postURL.dashboard, JsonBody);
                }

                console.log("API response:", res);

                const success = isHR
                    ? (res?.success === true || res?.status === 200 || res?.statusCode === 200)
                    : (res?.status === "success");

                console.log("Success check:", success);

                if (!success) {
                    setError("Error fetching data: Failed to fetch");
                    setData(null);
                } else {
                    const payload = isHR
                        ? (res && typeof res === "object" && "data" in res ? res.data : res)
                        : res.data;
                    console.log("Setting data:", payload);
                    setData(payload || {});
                }
            } catch (err) {
                console.error("API call error:", err);
                setError("Error fetching data: Failed to fetch");
                setData({});
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [userId, isHR]);

    // Session modal data fetch (HR only)
    useEffect(() => {
        const fetchUserAndTopics = async () => {
            if (!userId || !isHR) return;
            try {
                const JsonBody = { hr_id: userId };
                const response = await fatchedPostRequest(postURL.hrTopicCandidate, JsonBody);
                if (response.success === true || response.status === 200) {
                    setUserData(response.candidates || []);
                    setTopics(response.topics || []);
                }
            } catch (error) {
                console.error('Error fetching modal data', error.message);
            }
        };
        if (modalOpen && isHR) {
            fetchUserAndTopics();
        }
    }, [modalOpen, userId, isHR]);

    // Process session completion data
    const sessionCompletion = data?.session_completion || {};
    const completionTotal =
        (Number(sessionCompletion.completed) || 0) +
        (Number(sessionCompletion.pending) || 0);
    const completedPct =
        completionTotal > 0
            ? Math.round((Number(sessionCompletion.completed || 0) / completionTotal) * 100)
            : 0;
    const pendingPct =
        completionTotal > 0
            ? Math.round((Number(sessionCompletion.pending || 0) / completionTotal) * 100)
            : 0;

    const pieData = useMemo(() => {
        const c = Number(sessionCompletion.completed) || 0;
        const p = Number(sessionCompletion.pending) || 0;
        return [
            { name: "Completed", value: c },
            { name: "Pending", value: p },
        ];
    }, [sessionCompletion]);

    // Process chart data
    const barData = useMemo(() => {
        const list = isHR
            ? Array.isArray(data?.anuallyHiringProcess) ? data.anuallyHiringProcess : []
            : Array.isArray(data?.last_twelve_test_scores) ? data.last_twelve_test_scores : [];

        if (isHR) {
            return list.map((it, idx) => ({
                name: String(it.month || it.name || idx + 1).slice(0, 3),
                uv: Number(it.sessions ?? it.value ?? 0),
            }));
        } else {
            return list.map((score, idx) => ({
                name: `T${idx + 1}`,
                uv: Number(score) || 0,
            }));
        }
    }, [data, isHR]);

    const lineData = useMemo(() => {
        const list = Array.isArray(data?.language_usage) ? data.language_usage : [];
        return list.map((obj) => {
            const [name, uv] = Object.entries(obj)[0];
            return { name, uv };
        });
    }, [data]);

    // Technology data
    const technologies = isHR
        ? Array.isArray(data?.top_technologies) ? data.top_technologies : []
        : Array.isArray(data?.most_asked_technologies)
            ? data.most_asked_technologies
            : Array.isArray(data?.top_technologies)
                ? data.top_technologies
                : [];

    const technicalSkills = isHR
        ? Array.isArray(data?.top_technical_skills) ? data.top_technical_skills : []
        : Array.isArray(data?.most_discussed_technical_skills) ? data.most_discussed_technical_skills : [];

    // Session report data
    const sessionReport = data?.session_report || {};
    const activeParticipant = isHR
        ? (sessionReport?.activeParticipants ?? sessionReport?.active_participant ?? 0)
        : (sessionReport?.test_attempted ?? sessionReport?.assigned_test ?? sessionReport?.activeParticipants ?? sessionReport?.active_participant ?? 0);
    const avgSessionDuration = isHR
        ? (sessionReport?.averageSessionDuration ?? sessionReport?.average_session_duration ?? 0)
        : (sessionReport?.average_session_duration ?? sessionReport?.averageSessionDuration ?? "0 min");
    const sessionCreated = isHR
        ? (sessionReport?.totalSessionsCreated ?? sessionReport?.session_created ?? 0)
        : (sessionReport?.assigned_test ?? sessionReport?.test_assigned ?? sessionReport?.session_created ?? 0);
    const userTraffic = isHR
        ? (sessionReport?.userTraffic ?? sessionReport?.user_traffic ?? 0)
        : (sessionReport?.highest_score ?? sessionReport?.best_score ?? sessionReport?.average_score ?? 0);
    const averageScore = sessionReport?.averageScore ?? sessionReport?.average_score ?? 0;

    const commRaw = sessionReport?.session_type?.communication ?? 0;
    const techRaw = sessionReport?.session_type?.technology ?? 0;
    const totalType = Math.max(1, Number(commRaw) + Number(techRaw));

    // Top scores (candidate only)
    const topScores = isHR ? [] : (data?.top_five_test_scores || []).map(s => ({
        name: s.hr_name || "-",
        topic: s.topic || "-",
        score: s.score || "-",
    }));
    const CustomActiveDot = (props) => {
        const { cx, cy } = props;
        return (
            <g>
                {/* Outer yellow border */}
                <circle cx={cx} cy={cy} r={7} fill="none" stroke="#DFB916" strokeWidth={2} />
                {/* White inner border */}
                <circle cx={cx} cy={cy} r={5} fill="none" stroke="#ffffff" strokeWidth={2} />
                {/* Middle yellow dot */}
                <circle cx={cx} cy={cy} r={3} fill="#DFB916" stroke="none" />
            </g>
        );
    };
    // Technology icon function
    const getTechIcon = (name) => {
        const key = (name || "").toLowerCase();
        switch (key) {
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
            case "android":
                return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg";
            case "flutter":
                return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg";
            case "react native":
                return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg";
            default:
                return "https://via.placeholder.com/40x40/f3f4f6/9ca3af?text=%3F";
        }
    };

    useEffect(() => {
        if (!loading && data) {
            setTimeout(() => setAnimateBars(true), 300);
        }
    }, [loading, data]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div
                    style={{
                        backgroundColor: "#182938C2",
                        color: "#fff",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        pointerEvents: "none",
                        transform: "translateY(-8px)",
                        whiteSpace: "nowrap",
                    }}
                >
                    <div>{` ${payload[0].value}`}</div>
                </div>
            );
        }
        return null;
    };

    const showLoader = useMinLoaderTime(loading, 3000);
    if (showLoader)
        return (
            <div className="w-full bg-[#ECEFF2] p-3 overflow-visible">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                    <div className="flex items-center gap-3">
                        {isHR ? (
                            <button
                                className="flex items-center gap-2 bg-[#E5B800] hover:bg-yellow-500 text-xs text-[#272727] font-semibold px-4 py-2 rounded-xl shadow-none cursor-pointer"
                                onClick={() => setModalOpen(true)}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Create Session
                            </button>
                        ) : (
                            ""
                        )}
                    </div>
                </div>

                {/* Loader below header */}
                <div className="w-full flex items-center justify-center py-32">
                    <LoaderNew />
                </div>
            </div>
        );

    return (
        <div className="w-full h-full bg-[#ECEFF2] p-3 overflow-visible">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                <div className="flex items-center gap-3">
                    {isHR ? (
                        <button
                            className="flex items-center gap-2 bg-[#E5B800] hover:bg-yellow-500 text-xs text-[#272727] font-semibold px-4 py-2 rounded-xl shadow-none cursor-pointer"
                            onClick={() => setModalOpen(true)}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Create Session
                        </button>
                    ) : (
                        //     (
                        //     <button className="bg-[#DFB916] hover:bg-[#c8a514] px-4 py-2 rounded-md font-semibold text-gray-900 flex items-center gap-2">
                        //         <img src={assignmentIcon} alt="assignment" className="w-5 h-5" />
                        //         <span>Ongoing session</span>
                        //     </button>
                        // )
                        ""
                    )}
                </div>
            </div>

            {error && (
                <div className="w-full flex items-center justify-center py-16">
                    <p className="text-red-600 text-center">{error}</p>
                </div>
            )}

            {!error && (
                <div className="grid grid-cols-4 gap-4">
                    {/* LEFT COLUMN */}
                    <div className="col-span-12 sm:col-span-6 md:col-span-1 lg:col-span-1 flex flex-col space-y-4 items-start">
                        {/* Session Completion */}
                        <div className="bg-white rounded-2xl shadow-sm p-3 px-4 w-full  ">
                            <h2 className="text-[#8F96A9] mb-4 text-[15px] font-inter font-sm">
                                Session Completion
                            </h2>

                            {/* <ResponsiveContainer width="100%" height={106} >
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
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
              </ResponsiveContainer> */}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center", // horizontally center
                                    alignItems: "center", // vertically center (optional)
                                    width: "100%",
                                    height: "106px", // match chart height
                                    outline: "none",
                                    userSelect: "none",
                                    WebkitUserSelect: "none",
                                    MozUserSelect: "none",
                                    msUserSelect: "none",
                                    WebkitTapHighlightColor: "transparent",
                                }}
                                onFocus={(e) => e.target.blur()}
                                tabIndex={-1}
                            >
                                <ResponsiveContainer width={200} height={106}>
                                    <PieChart style={{ outline: "none" }}>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={25}
                                            outerRadius={45}
                                            paddingAngle={4}
                                            cornerRadius={6}
                                            dataKey="value"
                                            isAnimationActive={true}
                                            animationBegin={animateBars ? 300 : 0}
                                            animationDuration={700}
                                            onClick={() => {}}
                                            onMouseEnter={() => {}}
                                            onMouseLeave={() => {}}
                                            cursor="default"
                                            style={{ outline: "none" }}
                                        >
                                            {pieData.map((_, i) => (
                                                <Cell 
                                                    key={i} 
                                                    fill={COLORS[i]}
                                                    onClick={() => {}}
                                                    onMouseEnter={() => {}}
                                                    onMouseLeave={() => {}}
                                                    cursor="default"
                                                    style={{ outline: "none" }}
                                                />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex  justify-center mt-4 text-xs font-medium">
                                <div className="flex flex-col items-center text-slate-900 min-w-[100px]">
                                    <div
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                            fontWeight: 700,
                                            fontSize: "20px",
                                        }}
                                    >
                                        {completedPct}%
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

                                <div className="flex flex-col items-center min-w-[100px]">
                                    <div
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                            fontWeight: 700,
                                            fontSize: "20px",
                                            color: "#DFB916",
                                        }}
                                    >
                                        {pendingPct}%
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

                        {/* Technology Icons */}
                        <div className="bg-white rounded-2xl shadow-sm p-3 w-full flex-grow">
                            <h2
                                style={{
                                    fontFamily: "Inter",
                                    fontWeight: 400,
                                    fontStyle: "normal",
                                    fontSize: "15px",
                                    display: "inline-block",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    color: "#8F96A9",
                                }}
                            >
                                {isHR ? "Top Technologies" : "Mostly Asked Technology"}
                            </h2>

                            {technologies.length > 0 ? (
                                <div
                                    className="
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        gap-3 
        mt-4 
        place-items-center
      "
                                >
                                    {technologies.slice(0, 16).map((tech, idx) => {
                                        const iconSrc = getTechIcon(tech);
                                        return (
                                            <div
                                                key={`${tech}-${idx}`}
                                                className="w-[55px] h-[55px] sm:w-[60px] sm:h-[60px] md:w-[65px] md:h-[65px] flex items-center justify-center bg-gray-100 rounded-2xl relative group cursor-pointer transition-all duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-lg"
                                            >
                                                {/* Background overlay for opacity effect */}
                                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 ease-in-out rounded-2xl"></div>

                                                <img
                                                    src={iconSrc}
                                                    alt={tech || "Technology"}
                                                    className="w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] object-contain transition-transform duration-300 ease-in-out group-hover:scale-125 relative z-10"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "https://via.placeholder.com/40x40/f3f4f6/9ca3af?text=%3F";
                                                    }}
                                                />
                                                {/* Hover tooltip */}
                                                <div
                                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-1 rounded-sm text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap z-20 pointer-events-none shadow-md"
                                                    style={{
                                                        backgroundColor: "#FFF8E1",
                                                        color: "#DFB916",
                                                    }}
                                                >
                                                    {tech}
                                                    <div
                                                        className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                                                        style={{ borderTopColor: "#FFF8E1" }}
                                                    ></div>
                                                </div>
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
                    <div className="col-span-12 sm:col-span-12 md:col-span-8 lg:col-span-3 flex flex-col space-y-4">
                        {/* Session Report */}
                        <div className="bg-white rounded-2xl shadow-sm p-3 px-4 w-full ">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-[15px] text-[#8F96A9]">Session Report</h2>
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2">
                                        {isHR ? (
                                            <img src={groupLogo} alt="Group" className="w-5 h-5" />
                                        ) : (
                                            <img
                                                src={candidateIcon}
                                                alt="Group Icon"
                                                className="w-5 h-5 object-contain"
                                            />
                                        )}
                                        <span className="font-bold text-[20px] text-[#8F96A9]">
                                            {activeParticipant}
                                        </span>
                                    </div>
                                    <span className="text-[12px] text-[#8F96A9] -ml-7">
                                        {isHR ? "Active Participant" : "Test Attempted"}
                                    </span>
                                </div>
                            </div>

                            <div className="font-inter font-normal text-[13px] leading-none tracking-normal align-middle text-[#8F96A9] mb-3">
                                Session type
                            </div>

                            {/* Session Type Bars */}
                            <div className="space-y-3 max-w-[500px]">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex-1 bg-slate-200 h-5 rounded-sm overflow-hidden relative">
                                        <div
                                            className="h-5 rounded-sm flex items-center pl-2 transition-all duration-700 ease-in-out"
                                            style={{
                                                width: `${(commRaw / Math.max(1, sessionCreated)) * 100
                                                    }%`,
                                                backgroundColor: "#0f172a",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        ></div>
                                    </div>
                                    <div className="w-10 text-right flex gap-2 ">
                                        <span className="text-xs text-[#8F96A9]">
                                            Communication
                                        </span>
                                        <span className="text-xs text-[#8F96A9] font-medium">
                                            {commRaw}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex-1 bg-slate-200 h-5 rounded-sm overflow-hidden relative">
                                        <div
                                            className="h-5 rounded-sm flex items-center pl-2 transition-all duration-700 ease-in-out"
                                            style={{
                                                width: `${(techRaw / Math.max(1, sessionCreated)) * 100
                                                    }%`,
                                                background:
                                                    "linear-gradient(90deg, #DFB916 0%, #F5D85B 100%)",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        ></div>
                                    </div>
                                    <div className="w-10 text-right flex gap-2 ">
                                        <span className="text-xs text-[#8F96A9]">Technology</span>
                                        <span className="text-xs text-[#8F96A9] font-medium">
                                            {techRaw}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Stats */}
                            <div className="flex flex-wrap justify-between items-center mt-4 gap-4 text-sm font-medium text-slate-900">
                                <div className="flex flex-col items-center flex-1 min-w-[120px]">
                                    <div className="text-[#8F96A9]" style={{ fontSize: "20px", lineHeight: "100%" }}>
                                        {/* Integer part - Bold */}
                                        <span
                                            style={{
                                                fontFamily: "Inter, sans-serif",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {String(avgSessionDuration).split(".")[0]}
                                        </span>

                                        {/* Decimal part - Light */}
                                        <span
                                            style={{
                                                fontFamily: "Inter, sans-serif",
                                                fontWeight: 300,
                                            }}
                                        >
                                            .{String(avgSessionDuration).split(".")[1] || "00"}
                                        </span>
                                    </div>

                                    <div className="text-[12px] text-[#8F96A9] font-normal">
                                        Average Session Duration
                                    </div>
                                </div>

                                <div className="flex flex-col items-center flex-1 min-w-[120px]">
                                    <div className="text-[#8F96A9]" style={{ fontSize: "20px", lineHeight: "100%" }}>
                                        <span
                                            style={{
                                                fontFamily: "Inter, sans-serif",
                                                fontWeight: 700, // Bold
                                            }}
                                        >
                                            {isHR
                                                ? Number.isFinite(Number(sessionCreated))
                                                    ? Number(sessionCreated)
                                                    : 0
                                                : Number.isFinite(Number(sessionReport?.assigned_test || 0))
                                                    ? Number(sessionReport?.assigned_test || 0)
                                                    : 0}
                                        </span>
                                    </div>

                                    <div className="text-[12px] text-[#8F96A9] font-normal">
                                        {isHR ? "Session Created" : "Assigned Test"}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center flex-1 min-w-[120px]">
                                    <div className="flex items-center gap-1 font-bold text-[#8F96A9]">
                                        <div className="text-[20px]" style={{ lineHeight: "100%" }}>
                                            {(() => {
                                                // Determine the display value
                                                const value = isHR
                                                    ? Math.round(
                                                        Number.isFinite(Number(userTraffic)) ? Number(userTraffic) : 0
                                                    ).toString()
                                                    : Number.isFinite(Number(sessionReport?.highest_score || averageScore))
                                                        ? Number(sessionReport?.highest_score || averageScore).toFixed(1)
                                                        : "0.0";

                                                const [intPart, decimalPart] = value.split(".");

                                                return (
                                                    <>
                                                        {/* Integer part - Bold */}
                                                        <span
                                                            style={{
                                                                fontFamily: "Inter, sans-serif",
                                                                fontWeight: 700, // Bold
                                                                color: "#8F96A9"
                                                            }}
                                                        >
                                                            {intPart}
                                                        </span>

                                                        {/* Decimal part - Light */}
                                                        {decimalPart && (
                                                            <span
                                                                style={{
                                                                    fontFamily: "Inter, sans-serif",
                                                                    fontWeight: 300, // Light
                                                                    color: "#8F96A9"
                                                                }}
                                                            >
                                                                .{decimalPart}
                                                            </span>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>

                                        {sessionReport?.progress_indicator === "up" ? (
                                            <img src={trending_up} alt="Up" className="w-5 h-5" />
                                        ) : sessionReport?.progress_indicator === "down" ? (
                                            <TrendingDownIcon
                                                style={{ fontSize: "20px", color: "#e91717ff" }}
                                            />
                                        ) : null}
                                    </div>
                                    <div className="text-[12px] text-[#8F96A9] font-normal">
                                        {isHR ? "User Traffic" : "Highest Score"}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center flex-1 min-w-[120px]">
                                    <div className="flex flex-col items-end">
                                        <span
                                            className="text-[20px] leading-[100%] text-right"
                                            style={{
                                                fontFamily: "Inter, sans-serif",
                                                color: "#8F96A9",
                                            }}
                                        >
                                            {(() => {
                                                // Format value safely
                                                const formattedValue = Number.isFinite(Number(averageScore))
                                                    ? Number(averageScore).toFixed(1)
                                                    : "0.0";

                                                const [intPart, decimalPart] = formattedValue.split(".");

                                                return (
                                                    <>
                                                        {/* Integer part - Bold */}
                                                        <span style={{ fontWeight: 700 }}>{intPart}</span>

                                                        {/* Decimal part - Light */}
                                                        <span style={{ fontWeight: 300 }}>
                                                            .{decimalPart || "0"}
                                                        </span>
                                                    </>
                                                );
                                            })()}
                                        </span>
                                    </div>

                                    <div className="text-[12px] text-[#8F96A9] font-normal">
                                        Average Score
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="grid grid-cols-3 gap-4 h-full">
                            <div className="col-span-2 h-full ">
                                <div className="flex flex-col gap-4 w-full h-full">
                                    {/* Chart Section */}
                                    <div className="bg-[#DFB916] rounded-2xl shadow-sm p-4 h-full flex flex-col ">
                                        <h2 className="font-normal mb-3 text-[#3D5B81]">
                                            {isHR
                                                ? "Monthly Session Created"
                                                : "Last 12 Session Scores"}
                                        </h2>

                                        <div className="flex-1 mt-2">
                                            <ResponsiveContainer height={130} >
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
                                                        radius={[5, 5, 5, 5]}
                                                        isAnimationActive={true}
                                                        animationBegin={animateBars ? 300 : 0}
                                                        animationDuration={700}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Line Chart */}
                                    <div className="bg-white rounded-2xl shadow-sm p-4 h-full">
                                        <h2 className="font-normal text-[#8F96A9]">Language Usage</h2>

                                        {lineData.length > 0 ? (
                                            <div className="w-full h-[100px] mt-2">
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
                                                                    <div
                                                                        className="px-4 py-1 rounded-sm text-[#DFB916] font-normal text-sm shadow-md"
                                                                        style={{ backgroundColor: "#FFF8E1" }}
                                                                    >
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
                                                            activeDot={<CustomActiveDot />}
                                                            isAnimationActive={true}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-[80px] text-[#8F96A9] text-sm">
                                                No data found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Right Panel - Conditional Content */}
                            {isHR ? (
                                /* HR: Technical Skills */
                                <div className="bg-white shadow-sm p-3 rounded-2xl w-full h-full flex-shrink-0 col-span-1">
                                    <h2
                                        style={{
                                            fontFamily: "Inter",
                                            fontWeight: 400,
                                            fontStyle: "normal",
                                            fontSize: "15px",
                                            display: "inline-block",
                                            padding: "2px 6px",
                                            borderRadius: "4px",
                                            color: "#8F96A9",
                                        }}
                                    >
                                        Mostly Asked Technical Skill
                                    </h2>
                                    {technicalSkills.length > 0 ? (
                                        <div className="flex flex-wrap gap-4 mt-4 justify-center text-sm">
                                            {technicalSkills.map((skill, i) => (
                                                <span
                                                    key={`${skill}-${i}`}
                                                    className="bg-[#D9D9D933] px-4 py-2 border border-[#3D5B81] rounded-full text-center"
                                                    style={{
                                                        fontFamily: "Inter",
                                                        fontWeight: 500, // Medium
                                                        fontStyle: "normal", // Medium
                                                        fontSize: "12px",
                                                        lineHeight: "100%",
                                                        letterSpacing: "0%",
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: "#8F96A9",
                                                    }}
                                                    title={skill}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-[#8F96A9] text-sm">
                                            No data found
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Candidate: Top Test Scores without outer container */
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
                                        style={{ overflowY: "auto" }}
                                        className="scrollbar-hide w-full 
                    "
                                    >
                                        <h2
                                            className="mb-4"
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
                                            Top 5 Session Score
                                        </h2>
                                        <div className="space-y-3 h-92 overflow-y-auto scrollbar-hide">
                                            {topScores.length > 0 ? (
                                                topScores.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm mx-2"
                                                    >
                                                        {/* Left content */}
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex flex-col gap-2" >
                                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-semibold">

                                                                    <img
                                                                        src={Subtract}
                                                                        alt="Subtract"
                                                                        className="w-8 h-8 rounded-full"
                                                                    />

                                                                </div>
                                                                <p className="text-[11px] text-gray-600 ">Topic</p>
                                                            </div>

                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] text-gray-400 leading-none mt-[2px]">
                                                                    Assigned by
                                                                </span>

                                                                <span className="font-medium text-[13px] text-[#2C2E42] leading-tight ">
                                                                    {item.name}
                                                                </span>

                                                                <span className="text-[11px] text-gray-400 font-bold truncate max-w-[140px] mt-[11px] text-left w-full">
                                                                    {item.topic}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* Right side */}
                                                        <div className="flex flex-col items-end">
                                                            <span
                                                                className="text-[20px] leading-[100%] text-right"
                                                                style={{
                                                                    fontFamily: "Inter, sans-serif",
                                                                    color: "#8F96A9",
                                                                }}
                                                            >
                                                                {(() => {
                                                                    // Format score safely
                                                                    const formattedValue = Number.isFinite(Number(item.score))
                                                                        ? Number(item.score).toFixed(1)
                                                                        : "0.0";

                                                                    const [intPart, decimalPart] = formattedValue.split(".");

                                                                    return (
                                                                        <>
                                                                            {/* Integer part - Bold */}
                                                                            <span style={{ fontWeight: 700 }}>{intPart}</span>

                                                                            {/* Decimal part - Light */}
                                                                            <span style={{ fontWeight: 300 }}>
                                                                                .{decimalPart || "0"}
                                                                            </span>
                                                                        </>
                                                                    );
                                                                })()}
                                                            </span>

                                                            <span
                                                                className="font-normal text-[12px] leading-[100%] text-right"
                                                                style={{
                                                                    fontFamily: "Inter",
                                                                    color: "#8F96A9",
                                                                }}
                                                            >
                                                                Score
                                                            </span>
                                                            {/* <KeyboardArrowDown
                                                                style={{
                                                                    fontSize: "16px",
                                                                    color: "#B0B3B8",
                                                                    marginTop: "2px",
                                                                }}
                                                            /> */}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-gray-500 pt-10">
                                                    No top scores found.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Session Modal (HR only) */}
            {isHR && (
                <SessionModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    sessionDuration={sessionDuration}
                    setSessionDuration={setSessionDuration}
                    userData={userData}
                    topics={topics}
                    onSave={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};

export default HrCandidateDashboard;
