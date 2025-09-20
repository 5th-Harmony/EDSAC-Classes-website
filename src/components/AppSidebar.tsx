import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Users, BookOpen, Play, FileText,
  ClipboardList, BarChart3, GraduationCap, Menu
} from "lucide-react";

const menuItems = [
  { title: "Teachers", icon: Users, path: "/teachers" },
  { title: "Live Classes", icon: GraduationCap, path: "/live-class/general" },
  { title: "Materials", icon: BookOpen, path: "/materials" },
  { title: "Recordings", icon: Play, path: "/recordings" },
  { title: "Tests", icon: FileText, path: "/tests" },
  { title: "Assignments", icon: ClipboardList, path: "/assignments" },
  { title: "Grade Report", icon: BarChart3, path: "/grade-report" },
];

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleMenuClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Fixed Menu Icon - responsive positioning */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm text-black p-2 rounded-lg shadow-lg hover:bg-white/100 transition-all duration-300 hover:scale-105 lg:top-6 lg:right-6"
        aria-label="Toggle Menu"
      >
        <Menu className="h-5 w-5 lg:h-6 lg:w-6" />
      </button>

      {/* Dropdown Menu - responsive sizing and positioning */}
      <div
        className={`fixed top-16 right-4 w-72 lg:w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out z-40 lg:top-20 lg:right-6 ${
          isOpen ? "max-h-[600px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
        }`}
      >
        <div className="p-2">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li
                key={item.title}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 cursor-pointer transition-all duration-200 hover:scale-[1.02] group"
                style={{ transitionDelay: `${index * 50}ms` }}
                onClick={() => handleMenuClick(item.path)}
              >
                <item.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium text-black group-hover:text-primary transition-colors duration-200 text-sm lg:text-base">
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
