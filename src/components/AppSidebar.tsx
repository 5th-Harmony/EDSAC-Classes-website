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
    <Sidebar className="w-80 bg-white border-l border-border shadow-lg" side="right" collapsible="offcanvas">
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
  );
}