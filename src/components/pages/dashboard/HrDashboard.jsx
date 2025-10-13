import React, { useEffect, useMemo, useState } from "react";
import { fetchHrDashboard } from "../../../services/ApiService";
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

const HrDashboard = () => {
  const COLORS = ["#0f172a", "#DFB916"];
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

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
    const list = Array.isArray(data?.language_usage)
      ? data.language_usage
      : [];
    return list.map((it, idx) => ({
      name: it.name || it.lang || String(idx + 1),
      uv: Number(it.uv ?? it.value ?? 0),
    }));
  }, [data]);

  const mostAskedTechnologies = Array.isArray(data?.most_asked_technologies)
    ? data.most_asked_technologies
    : [];
  const mostDiscussedSkills = Array.isArray(
    data?.most_discussed_technical_skills
  )
    ? data.most_discussed_technical_skills
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
  const totalType = Math.max(1, commRaw + techRaw);
  const commWidth = `${Math.round((commRaw / totalType) * 100)}%`;
  const techWidth = `${Math.round((techRaw / totalType) * 100)}%`;

  if (loading) return <Loader show text="Loading HR dashboard..." />;

  return (
    <div className="w-screen h-screen overflow-auto bg-gray-50 p-6">
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
            <div className="bg-white rounded-2xl shadow-sm p-4 w-full h-[220px]">
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
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="flex justify-center gap-8 mt-2 text-xs font-medium">
                <div className="flex flex-col items-center">
                  <div className="font-bold text-[20px]">{completedPct}%</div>
                  <div className="text-[12px]text-[#8F96A9] ">Completed</div>
                </div>
                <div className="flex flex-col items-center text-[#DFB916]">
                  <div className="font-bold text-[20px]">{pendingPct}%</div>
                  <div className="text-[12px] text-[#8F96A9]">Pending</div>
                </div>
              </div>
            </div>

            {/* Mostly Asked Tech */}
            <div className="bg-white rounded-[10px] shadow-sm p-5 w-full h-[374px]">
              <h2 className="font-semibold text-[#8F96A9] mb-6">
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

          {/* RIGHT SECTION */}
          <div className="col-span-12 md:col-span-9 flex flex-col space-y-6">
            {/* Session Report */}
            <div className="bg-white rounded-2xl shadow-sm p-1 px-4 w-full h-[220px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[15px] text-[#8F96A9]">Session Report</h2>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <img src={groupLogo} alt="Group" className="w-5 h-5" />
                    <span className="font-bold text-[20px] text-gray-700">
                      {activeParticipant}
                    </span>
                  </div>
                  <span className="text-[12px] text-gray-500 mt-1 -ml-7">
                    Active participant
                  </span>
                </div>
              </div>

              {/* Bars */}
         <div className="space-y-3">
  {/* Communication Bar */}
  <div className="flex items-center gap-3">
    <div className="bg-slate-200 w-full h-5 rounded-full overflow-hidden relative">
      <div
        className="h-5 rounded-full flex items-center pl-2"
        style={{
          width: `${commWidth}%`,
          backgroundColor: '#0f172a',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'width 0.3s ease'
        }}
      >
        <span className="text-xs text-white">Communication</span>
      </div>
    </div>
    <span className="text-xs text-gray-700 font-medium w-8 text-right">{commRaw}</span>
  </div>

  {/* Technology Bar */}
  <div className="flex items-center gap-3">
    <div className="bg-slate-200 w-full h-5 rounded-full overflow-hidden relative">
      <div
        className="h-5 rounded-full flex items-center pl-2"
        style={{
          width: `${techWidth}%`,
          backgroundColor: '#DFB916',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'width 0.3s ease'
        }}
      >
        <span className="text-xs text-gray-900">Technology</span>
      </div>
    </div>
    <span className="text-xs text-gray-700 font-medium w-8 text-right">{techRaw}</span>
  </div>
</div>


              {/* Bottom Stats */}
              <div className="flex justify-between items-center mt-6 text-sm font-medium text-slate-900">
                <div className="flex flex-col items-center">
                  <div className="font-bold text-[20px]">{avgSessionDuration}</div>
                  <div className="text-[12px]">Average Session Duration</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="font-bold text-[20px]">{sessionCreated}</div>
                  <div className="text-[12px]">Session Created</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 font-semibold">
                    <div className="font-bold text-[20px]">
                      {Math.round(Number(userTraffic) || 0)}
                    </div>
                    {sessionReport?.progress_indicator === "up" ? (
                      <img src={trending_up} alt="Up" className="w-5 h-5" />
                    ) : sessionReport?.progress_indicator === "down" ? (
                      <img src={trending_down} alt="Down" className="w-5 h-5" />
                    ) : null}
                  </div>
                  <div className="text-[12px]">User Traffic</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="font-bold text-[20px]">{averageScore}</div>
                  <div className="text-[12px]">Average Score</div>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex flex-col gap-6 w-full md:w-2/3">
                <div className="bg-[#DFB916] rounded-[10px] shadow-sm p-5 h-[198px] flex flex-col">
                  <h2 className="font-semibold mb-3 text-[#182938]">
                    Annually Hiring Process
                  </h2>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <XAxis dataKey="name" hide />
                        <YAxis
                          stroke="#182938"
                          axisLine
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

                <div className="bg-white rounded-[10px] shadow-sm p-5 h-[150px]">
                  <h2 className="font-semibold text-[#8F96A9] mb-3">
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

              <div className="bg-white shadow-sm p-5 rounded-[10px] w-full md:w-1/3 h-[374px] flex-shrink-0">
                <h2 className="font-semibold text-gray-700 mb-6">
                  Mostly Asked Technical Skill
                </h2>
                {mostDiscussedSkills.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 justify-items-center mt-4 text-sm">
                    {mostDiscussedSkills.map((skill, i) => (
                      <span
                        key={`${skill}-${i}`}
                        className="bg-gray-100 px-3 py-1.5 rounded-full text-gray-700 hover:bg-yellow-100"
                        title={skill}
                      >
                        {skill}
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
          </div>
        </div>
      )}

      <SessionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sessionDuration={sessionDuration}
        setSessionDuration={setSessionDuration}
        onSave={() => setModalOpen(false)}
      />
    </div>
  );
};

export default HrDashboard;
