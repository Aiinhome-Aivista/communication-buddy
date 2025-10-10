import React, { useEffect, useMemo, useState } from "react";
import { fetchHrDashboard } from "../../../services/ApiService";
import Loader from "../../ui/Loader";


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
  const COLORS = ["#0f172a", " #DFB916"];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const hrId = typeof window !== "undefined" ? sessionStorage.getItem("user_id") : null;

  useEffect(() => {
    const load = async () => {
      if (!hrId) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetchHrDashboard(hrId);
        const success = (
          res?.success === true ||
          res?.status === 200 ||
          res?.statusCode === 200 ||
          res?.status === 'success'
        );
        if (!success) {
          setError("Error fetching data: Failed to fetch");
          setData(null);
        } else {
          // Prefer the `data` field if present, otherwise use whole response
          const payload = (res && typeof res === 'object' && 'data' in res) ? res.data : res;
          setData(payload || null);
        }
      } catch (_e) {
        setError("Error fetching data: Failed to fetch");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [hrId]);

  // Derived safe values with graceful fallbacks
  const sessionCompletion = data?.session_completion || null;
  const completionTotal = sessionCompletion ? (Number(sessionCompletion.completed) || 0) + (Number(sessionCompletion.pending) || 0) : 0;
  const completedPct = sessionCompletion && completionTotal > 0 ? Math.round((Number(sessionCompletion.completed) / completionTotal) * 100) : null;
  const pendingPct = sessionCompletion && completionTotal > 0 ? Math.round((Number(sessionCompletion.pending) / completionTotal) * 100) : null;

  const pieData = useMemo(() => {
    if (!sessionCompletion) return [];
    const c = Number(sessionCompletion.completed) || 0;
    const p = Number(sessionCompletion.pending) || 0;
    return [
      { name: "Completed", value: c },
      { name: "Pending", value: p },
    ];
  }, [sessionCompletion]);

  const barData = useMemo(() => {
    const list = Array.isArray(data?.anuallyHiringProcess) ? data.anuallyHiringProcess : [];
    return list.map((it, idx) => ({
      name: String((it.month || it.name || idx + 1)).slice(0, 3),
      uv: Number(it.sessions ?? it.value ?? 0),
    }));
  }, [data]);

  const lineData = useMemo(() => {
    const list = Array.isArray(data?.language_usage) ? data.language_usage : [];
    return list.map((it, idx) => ({ name: it.name || it.lang || String(idx + 1), uv: Number(it.uv ?? it.value ?? 0) }));
  }, [data]);

  const mostAskedTechnologies = Array.isArray(data?.most_asked_technologies) ? data.most_asked_technologies : [];
  const mostDiscussedSkills = Array.isArray(data?.most_discussed_technical_skills) ? data.most_discussed_technical_skills : [];

  const sessionReport = data?.session_report || null;
  const activeParticipant = sessionReport?.activeParticipants ?? sessionReport?.active_participant;
  const avgSessionDuration = sessionReport?.averageSessionDuration ?? sessionReport?.average_session_duration;
  const sessionCreated = sessionReport?.totalSessionsCreated ?? sessionReport?.session_created;
  const userTraffic = sessionReport?.userTraffic ?? sessionReport?.user_traffic;
  const averageScore = sessionReport?.averageScore ?? sessionReport?.average_score;

  const commRaw = sessionReport?.session_type?.communication;
  const techRaw = sessionReport?.session_type?.technology;
  const commCount = commRaw != null ? Number(commRaw) : undefined;
  const techCount = techRaw != null ? Number(techRaw) : undefined;
  const totalType = Math.max(1, (commCount ?? 0) + (techCount ?? 0));
  const commWidth = commCount != null && techCount != null && totalType > 0 ? `${Math.round((commCount / totalType) * 100)}%` : '0%';
  const techWidth = commCount != null && techCount != null && totalType > 0 ? `${Math.round((techCount / totalType) * 100)}%` : '0%';

  return (
    <div className="w-screen h-screen overflow-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <button className="bg-[#DFB916] hover:bg-[#c8a514] px-5 py-2 rounded-md font-semibold text-gray-900">
          + Create Session
        </button>
      </div>

      <Loader show={loading} text="Loading HR dashboard..." />
      {error && (
        <div className="w-full flex items-center justify-center py-16">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      {/* Main Content Grid */}
      {!error && (
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

              {sessionCompletion && (
                <div className="flex justify-center gap-8 mt-2 text-xs font-medium">
                  <div className="flex flex-col items-center text-slate-900">
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px' }}>
                      {completedPct != null ? `${completedPct}%` : '-'}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px' }}>
                      Completed
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: ' #DFB916' }}>
                      {pendingPct != null ? `${pendingPct}%` : '-'}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', color: 'black' }}>
                      Pending
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Technologies */}
            <div className="bg-white rounded-[10px] shadow-sm p-5 w-full h-[374px]">
              <h2 className="font-semibold text-gray-700 mb-6 text-left">Mostly Asked Technology</h2>
              {mostAskedTechnologies.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 justify-items-center mt-4 text-center text-[12px] font-medium leading-[100%] tracking-[0%]">
                  {mostAskedTechnologies.map((tech, idx) => (
                    <span key={`${tech}-${idx}`} className="bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:bg-yellow-100 transition text-center" title={tech}>
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[calc(374px-56px)] text-gray-500 text-sm">no data found</div>
              )}
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
                    <span className="font-inter font-bold text-[20px] leading-none align-middle text-gray-700">{activeParticipant ?? '-'}</span>
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
                    <div className="bg-slate-900 h-5 rounded-md" style={{ width: commWidth }}></div>
                  </div>
                  <span className="text-xs text-gray-700 font-medium ml-2">{commCount ?? '-'}</span>
                </div>

                {/* Technology Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-24">Technology</span>
                  <div className="bg-slate-200 w-full h-5 rounded-md relative">
                    <div className="bg-[#DFB916] h-5 rounded-md" style={{ width: techWidth }}></div>
                  </div>
                  <span className="text-xs text-gray-700 font-medium ml-2">{techCount ?? '-'}</span>
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
                  >{avgSessionDuration ?? '-'}</div>
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
                  >{sessionCreated ?? '-'}</div>
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
                    >{userTraffic ?? '-'}</div>
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
                  >{averageScore ?? '-'}</div>
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
                <div className="bg-white rounded-[10px] shadow-sm p-5 w-full h-[150px]">
                  <h2 className="font-semibold text-gray-700 mb-3">
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
                  ) : (
                    <div className="flex items-center justify-center h-[80px] text-gray-500 text-sm">no data found</div>
                  )}
                </div>
              </div>

              {/* Skills Card */}
              <div className="bg-white shadow-sm p-5 rounded-[10px] w-full md:w-1/3 h-[374px] flex-shrink-0">
                <h2 className="font-semibold text-gray-700 mb-6 text-left">Mostly Asked Technical Skill</h2>
                {mostDiscussedSkills.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 justify-items-center mt-4 text-center text-[12px] font-medium leading-[100%] tracking-[0%]">
                    {mostDiscussedSkills.map((skill, i) => (
                      <span key={`${skill}-${i}`} className="bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:bg-yellow-100 transition text-center" title={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[calc(374px-56px)] text-gray-500 text-sm">no data found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrDashboard;
