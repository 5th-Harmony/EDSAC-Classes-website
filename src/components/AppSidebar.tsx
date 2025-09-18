import { useState } from "react";
import {
  User, Users, BookOpen, Play, FileText,
  ClipboardList, BarChart3, GraduationCap,
  Menu
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

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

  const handleMenuClick = (title: string) => {
    console.log(`Clicked: ${title}`);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 bg-white border border-border p-2 rounded-lg shadow-md hover:bg-accent transition-colors"
        aria-label="Toggle Sidebar"
      >
        <Menu className="h-6 w-6 text-foreground" />
      </button>

      {/* Animated Sidebar */}
      <Sidebar
        className={`w-80 bg-white border-l border-border shadow-lg fixed top-0 right-0 h-full z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarGroupLabel className="text-foreground font-semibold text-lg mb-4 px-4 pt-4">
              ENIAC Classes
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-2">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => handleMenuClick(item.title)}
                      className="w-full text-left py-3 px-4 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg flex items-center gap-3"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
