import { useState } from "react";
import {
  User, Users, BookOpen, Play, FileText,
  ClipboardList, BarChart3, GraduationCap, Menu
} from "lucide-react";

const menuItems = [
  { title: "Student Profile", icon: User },
  { title: "Teachers", icon: Users },
  { title: "Classes", icon: GraduationCap },
  { title: "Courses", icon: BookOpen },
  { title: "Recordings", icon: Play },
  { title: "Tests", icon: FileText },
  { title: "Assignments", icon: ClipboardList },
  { title: "Grade Report", icon: BarChart3 },
];

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleMenuClick = (title: string) => {
    console.log(`Clicked: ${title}`);
  };

  return (
    <div className="relative z-50">
      {/* Fixed Menu Icon */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 bg-white text-black p-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Toggle Menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`fixed top-16 right-4 w-64 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
        }`}
      >
        <ul className="divide-y divide-gray-200">
          {menuItems.map((item, index) => (
            <li
              key={item.title}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              style={{ transitionDelay: `${index * 50}ms` }}
              onClick={() => handleMenuClick(item.title)}
            >
              <item.icon className="h-5 w-5 text-black" />
              <span className="font-medium text-black">{item.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
