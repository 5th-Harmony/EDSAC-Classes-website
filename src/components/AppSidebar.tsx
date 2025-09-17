import { User, Users, BookOpen, Play, FileText, ClipboardList, BarChart3, GraduationCap } from "lucide-react";
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
  const handleMenuClick = (title: string) => {
    console.log(`Clicked: ${title}`);
    // Add navigation logic here
  };

  return (
    <Sidebar className="w-1/4 bg-white border-r border-gray-200" side="left">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-900 font-semibold text-lg mb-4">
            ENIAC Classes
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => handleMenuClick(item.title)}
                    className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 rounded-lg flex items-center gap-3"
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
  );
}