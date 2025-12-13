import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Send, ArrowUp, Info, Crown, Headphones, User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/premium", label: "Premium" },
    { href: "/support", label: "Support" },
  ];

  const menuItems = [
    { href: "/login", icon: User, label: "Log In" },
    { href: "/signup", icon: UserPlus, label: "Sign Up" },
    { divider: true },
    { href: "/about", icon: Info, label: "About AI" },
    { href: "/premium", icon: Crown, label: "Premium Plans" },
    { href: "/support", icon: Headphones, label: "Support" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card backdrop-blur supports-[backdrop-filter]:bg-card/95">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-[22px] tracking-tight mr-4 hover:opacity-80 transition-opacity text-foreground">
          <Send size={20} className="text-primary" />
          NexTravel AI
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.href 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/login">
            <Button variant="outline" size="sm">Login</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">
              Get Started
              <ArrowUp size={14} className="ml-2 rotate-45" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-1 shadow-lg">
          {menuItems.map((item, index) =>
            item.divider ? (
              <hr key={index} className="border-0 h-px bg-border my-2" />
            ) : (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.href 
                    ? "bg-muted text-primary" 
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
