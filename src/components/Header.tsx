import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const handleNavClick = (section: string) => {
    console.log(`Navigating to: ${section}`);
    // Add your navigation logic here
  };

  return (
    <header className="w-full px-8 py-4 flex items-center justify-between animate-fade-in">
      {/* Logo */}
      <div className="flex items-center space-x-8">
        <button 
          onClick={() => handleNavClick('home')}
          className="nav-button nav-button-secondary text-lg font-bold"
        >
          ENIAC
        </button>
        
        <button 
          onClick={() => handleNavClick('materials')}
          className="nav-button nav-button-outline"
        >
          MATERIALS
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Input 
            type="text"
            placeholder="Search..."
            className="w-full bg-white/90 text-gray-900 placeholder:text-gray-500 border-0 rounded-full pl-4 pr-12 py-3 focus:ring-2 focus:ring-primary"
          />
          <Button 
            size="sm"
            variant="ghost"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => handleNavClick('login')}
          className="nav-button nav-button-secondary"
        >
          LOG IN
        </button>
        
        <button 
          onClick={() => handleNavClick('signup')}
          className="nav-button nav-button-secondary"
        >
          SIGN UP
        </button>
        
        <button 
          onClick={() => handleNavClick('explore')}
          className="nav-button nav-button-outline"
        >
          EXPLORE
        </button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleNavClick('menu')}
          className="text-foreground hover:bg-foreground/10"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
};

export default Header;