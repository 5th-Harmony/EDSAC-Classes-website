import { Search, Menu, User, Users, BookOpen, Play, FileText, ClipboardList, BarChart3, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { title: "Teachers", icon: Users, path: "/teachers" },
  { title: "Live Classes", icon: GraduationCap, path: "/live-class/general" },
  { title: "Materials", icon: BookOpen, path: "/materials" },
  { title: "Recordings", icon: Play, path: "/recordings" },
  { title: "Tests", icon: FileText, path: "/tests" },
  { title: "Assignments", icon: ClipboardList, path: "/assignments" },
  { title: "Grade Report", icon: BarChart3, path: "/grade-report" },
];

const Header = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (section: string) => {
    switch (section) {
      case 'home':
        navigate('/');
        break;
      case 'explore':
        navigate('/explore');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'materials':
        navigate('/materials');
        break;
      case 'login':
        console.log('Login clicked');
        break;
      case 'signup':
        console.log('Signup clicked');
        break;
      default:
        console.log(`Navigating to: ${section}`);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleMenuClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchValue);
  };

  return (
    <header className="w-full px-4 lg:px-8 py-4 flex items-center justify-between animate-fade-in bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 z-50">
      {/* Logo */}
      <div className="flex items-center space-x-8">
        <button 
          onClick={() => handleNavClick('home')}
          className="nav-button nav-button-secondary text-lg font-bold"
        >
          EDSAC
        </button>
        
        <button 
          onClick={() => handleNavClick('materials')}
          className="nav-button nav-button-outline"
        >
          MATERIALS
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex-1 mx-8">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Input 
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full bg-white/90 text-gray-900 placeholder:text-gray-500 border-0 rounded-full pl-4 pr-12 py-3 focus:ring-2 focus:ring-primary"
          />
          <Button 
            type="submit"
            size="sm"
            variant="ghost"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => handleNavClick('login')}
          className="nav-button nav-button-secondary text-sm px-4 py-2"
        >
          LOG IN
        </button>
        
        <button 
          onClick={() => handleNavClick('signup')}
          className="nav-button nav-button-secondary text-sm px-4 py-2"
        >
          SIGN UP
        </button>
        
        <button 
          onClick={() => handleNavClick('explore')}
          className="nav-button nav-button-outline"
        >
          EXPLORE
        </button>
        
        <button
          onClick={() => handleNavClick('dashboard')}
          className="text-foreground hover:bg-accent rounded-lg p-2 transition-colors"
        >
          <User className="h-5 w-5" />
        </button>
        
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="text-foreground hover:bg-accent rounded-lg p-2 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Dropdown Menu */}
          <div
            className={`absolute top-12 right-0 w-64 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out z-50 ${
              isMenuOpen ? "max-h-[500px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
            }`}
          >
            <ul className="divide-y divide-gray-200">
              {menuItems.map((item, index) => (
                <li
                  key={item.title}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                  style={{ transitionDelay: `${index * 50}ms` }}
                  onClick={() => handleMenuClick(item.path)}
                >
                  <item.icon className="h-5 w-5 text-black" />
                  <span className="font-medium text-black">{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
