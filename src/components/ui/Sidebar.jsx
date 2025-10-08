import { useState } from "react";
export default function Sidebar() {
  const [active, setActive] = useState("Practice & Test");

 const menuItems = [
    {
      name: "Practice & Test",
      icon: <img src="public/assets/icons/assignment.svg" alt="Practice & Test" className="h-5 w-5" />,
    },
    {
      name: "Test Result",
      icon: <img src="public/assets/icons/bar_chart_4_bars.svg" alt="Test Result" className="h-5 w-5" />,
    },
    {
      name: "Settings",
      icon: <img src="public/assets/icons/settings.svg" alt="Settings" className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="w-60 bg-white h-screen border-r flex flex-col justify-between overflow-hidden">
      <div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex items-center gap-3 w-full text-left px-6 py-2 text-sm font-medium transition-colors ${
                active === item.name
                  ? "bg-[#1E293B] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
