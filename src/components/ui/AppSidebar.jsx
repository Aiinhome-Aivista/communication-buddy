import {
  Bell,
  BookOpenCheck,
  ChartColumnStacked,
  ChevronLeft,
  ChevronRight,
  LogOut,
  List,
  ChevronDown,
  ChevronUp,
  Users,
  UserPlus,
  Hourglass,
  CircleEqual
} from "lucide-react";
import React, { useEffect, useState, useRef, } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../provider/AuthProvider";
import { useTopic } from "../../provider/TopicProvider";
import { saveChatSession } from "../../utils/saveChatSessionReview";
import { useContext } from "react";
import { UserContext } from "../../context/Context";



// static menu list
const menuList = [

  {
    icon: <BookOpenCheck size={20} />,
    title: "Practice & Test",
    path: null,
    allowedRoles: ["candidate"],
  },
  {
    icon: <CircleEqual size={20} />,
    title: "Test Result",
    path: null,
    allowedRoles: ["candidate"],
  },

  {
    icon: <UserPlus size={20} />,
    title: "Users",
    path: "/dashboard/user",
    allowedRoles: ["hr", "admin"],
  },
  {
    icon: <Hourglass size={20} />,
    title: "Schedule Sessions",
    path: "/dashboard/schedule",
    allowedRoles: ["hr", "admin"],
  },
  {
    icon: <ChartColumnStacked size={20} />,
    title: "Reports & Review",
    path: "/dashboard/reports",
    allowedRoles: ["hr", "admin"],
  },
];

export default function AppSidebar() {
  const { logout } = useAuth();

  const { getTopicData } = useTopic();
  const navigate = useNavigate();
  const topicData = getTopicData;
  const userRole = sessionStorage.getItem("userRole")?.toLowerCase() || "";
  const userId = parseInt(sessionStorage.getItem("user_id"), 10);
  const matchedRecord = topicData.find(item => item.user_id === userId);
  const hrId = matchedRecord?.hr_id || null;
  const [collapsed, setCollapsed] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [practiceSubmenu, setPracticeSubmenu] = useState([]);
  const [width, setWidth] = useState(collapsed ? 80 : 320); // starting widths
  const isResizing = useRef(false);

  const [selectedTopic, setSelectedTopic] = useState(null);

  const { setUserData } = useContext(UserContext);

  const startResizing = () => { isResizing.current = true; document.body.style.cursor = "col-resize"; };
  const stopResizing = () => { isResizing.current = false; document.body.style.cursor = ""; };
  const resize = (e) => {
    if (isResizing.current) {
      const newWidth = e.clientX;
      if (newWidth > 80 && newWidth < 500) {
        setWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  const getTopicDetails = async (data) => {
    console.log("getTopicDetails", data);



    // Format current datetime as YYYY-MM-DD HH:MM:SS
    const pad = (n) => String(n).padStart(2, '0');
    const nowDate = new Date();
    const nowFormatted = `${nowDate.getFullYear()}-${pad(nowDate.getMonth() + 1)}-${pad(nowDate.getDate())} ${pad(nowDate.getHours())}:${pad(nowDate.getMinutes())}:${pad(nowDate.getSeconds())}`;

    const response = await fetch("http://122.163.121.176:3004/get_session_status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "user_id": data.user_id,
        "hr_id": data.hr_id,
        "topic": data.topic_name,
        "now": nowFormatted
      }),
    });

    const getResponse = await response.json();
    console.log("getSessionStatus", getResponse);

    setUserData(getResponse);
  }


  useEffect(() => {
    if (userRole === "candidate") {
      const assignedTopics = getTopicData.filter(
        topic => topic.status === "assigned" && topic.topic_category // null বা undefined বাদ
      );

      // Group topics by category
      const grouped = assignedTopics.reduce((acc, topic) => {
        const category = topic.topic_category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(topic);
        return acc;
      }, {});

      setPracticeSubmenu(grouped);
    }
  }, [userRole, getTopicData]);


  const filteredMenu = menuList.filter((item) =>
    item.allowedRoles.includes(userRole)
  );

  const handleLogout = async () => {

    navigate("/");
    if (userRole === "candidate") {
      // sessionStorage বা context থেকে conversation ডাটা নাও
      const topic = sessionStorage.getItem("topic");
      const conversation = JSON.parse(sessionStorage.getItem("fullConversation"));
      const aiResponse = sessionStorage.getItem("aiResponse");
      if (!aiResponse.includes("time is up")) {
        await saveChatSession({
          userId,
          hrId,
          topic,
          fullConversation: conversation
        });
      }
    }
    logout();

  };

  return (
    <div
      className={`sidebar bg-slate-800 text-white border-r-4 border-teal-500 p-3 relative flex flex-col transition-[width] duration-200 ease-linear`}
      style={{ width: `${collapsed ? 80 : width}px`, height: "calc(100vh - 8rem)" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Drag handle */}
      <div
        className={`absolute top-0 right-0 h-full w-2 ${hovering ? "bg-teal-500/30" : "bg-transparent"} cursor-col-resize flex items-center justify-end pr-1 transition-all duration-200`}
        onMouseDown={startResizing}
        style={{ zIndex: 10 }}
      >
        {hovering && (
          collapsed ? <span className="text-white"></span> : <span className="text-white"></span>
        )}
      </div>

      {/* Header */}
      <div
        className={`sidebar-header flex items-center mb-4 p-2 bg-teal-500/20 rounded-md transition-all duration-300 ${collapsed ? "justify-center w-full" : "justify-between"}`}
      >
        {!collapsed && (
          <h2 className="text-teal-200 block">
            <span className="text-lg font-medium">
              <NavLink to="/dashboard" className="flex items-center gap-2">
                Skill Enhancement
              </NavLink>
            </span>
          </h2>
        )}

        <span
          className={`text-teal-400 cursor-pointer transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          ▶
        </span>
      </div>

      {/* Sidebar body */}
      <div className="sidebar-body flex flex-col justify-between h-[calc(100%-4rem-1rem)] overflow-y-auto">
        <div className="menu-list space-y-2">
          {filteredMenu.map((item, index) => {
            // Handle collapsible Practice menu for candidate
            if (item.title === "Practice & Test" && userRole === "candidate") {
              return (
                <div key={index}>
                  <button
                    onClick={() => setSubMenuOpen(!subMenuOpen)}
                    className={`flex items-center w-full px-3 py-2 bg-teal-500/25 hover:bg-teal-700 rounded-md cursor-pointer text-md ${collapsed ? "justify-center gap-0" : "gap-4"
                      }`}
                  >
                    <span>{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span>{item.title}</span>
                        <span className="ml-auto">
                          {subMenuOpen ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </span>
                      </>
                    )}
                  </button>

                  {/* Submenu */}
                  {/* {subMenuOpen && !collapsed && (
                    <div className="ml-6 mt-1 space-y-1 p-2">
                      {practiceSubmenu.map((subItem, subIndex) => (
                        <NavLink
                          key={subIndex}
                          to={`/dashboard/test/${subItem.topic_name}`} // adjust route as needed
                          className="block px-3 py-2 text-sm text-teal-300 hover:text-white hover:bg-teal-600/10 rounded truncate"
                        >
                          {`${subIndex + 1}. ${subItem.topic_name}`}
                        </NavLink>
                      ))}
                    </div>
                  )} */}
                  {subMenuOpen && !collapsed && (
                    <div className="ml-6 mt-1 space-y-2 p-2">
                      {Object.keys(practiceSubmenu).map((category, catIndex) => (
                        <div key={catIndex}>
                          <h4 className="text-teal-400 font-semibold mb-1">{category}</h4>
                          {practiceSubmenu[category].map((subItem, subIndex) => (
                            <NavLink
                              key={subIndex}
                              to={`/dashboard/test/${subItem.topic_name}`}
                              onClick={() => { getTopicDetails(subItem); setSelectedTopic(subItem.topic_name); }}
                              className={
                                selectedTopic === subItem.topic_name
                                  ? "bg-teal-600 text-white block px-3 py-1 text-sm rounded truncate"
                                  : "text-teal-300 hover:text-white hover:bg-teal-600/10 block px-3 py-1 text-sm rounded truncate"
                              }                            >
                              {`${subIndex + 1}. ${subItem.topic_name}`}
                            </NavLink>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Default static items
            return (
              <NavLink
                to={item.path}
                key={index}
                className="flex items-center gap-2 text-teal-200 hover:text-teal-100"
              >
                <li
                  className={`flex items-center px-3 py-2 bg-teal-500/25 hover:bg-teal-700 rounded-md cursor-pointer text-md w-full ${collapsed ? "justify-center gap-0" : "gap-4"
                    }`}
                >
                  <span className="text-teal-200">{item.icon}</span>
                  {!collapsed && <span>{item.title}</span>}
                </li>
              </NavLink>
            );
          })}
        </div>

        {/* Logout */}
        <div className="sidebar-footer flex items-center justify-center mt-4">
          <button
            className="border-1 border-rose-400 bg-rose-500/20 text-md flex-1 h-10 rounded-md shadow-sm hover:bg-rose-700/50 flex items-center justify-center gap-4 text-rose-100 cursor-pointer transition-colors duration-300"
            onClick={handleLogout}
          >
            {!collapsed && "Logout"} <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
