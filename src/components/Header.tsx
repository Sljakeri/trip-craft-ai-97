import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUp, Info, Crown, Headphones, User, UserPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, loading } = useAuth();

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/premium", label: "Premium" },
    { href: "/support", label: "Support" },
  ];

  const guestMenuItems = [
    { href: "/login", icon: User, label: "Log In" },
    { href: "/signup", icon: UserPlus, label: "Sign Up" },
    { divider: true },
    { href: "/about", icon: Info, label: "About AI" },
    { href: "/premium", icon: Crown, label: "Premium Plans" },
    { href: "/support", icon: Headphones, label: "Support" },
  ];

  const userMenuItems = [
    { href: "/profile", icon: User, label: "My Profile" },
    { divider: true },
    { href: "/about", icon: Info, label: "About AI" },
    { href: "/premium", icon: Crown, label: "Premium Plans" },
    { href: "/support", icon: Headphones, label: "Support" },
  ];

  const menuItems = user ? userMenuItems : guestMenuItems;

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight mr-4 hover:opacity-80 transition-opacity text-foreground">
          <img src={logo} alt="NexTravel" className="h-8 w-auto" />
          NexTravel
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
          {!loading && (
            user ? (
              <>
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User size={14} />
                    Profile
                  </Button>
                </Link>
                <Button size="sm" variant="ghost" onClick={handleSignOut} className="gap-2">
                  <LogOut size={14} />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Get Started
                    <ArrowUp size={14} className="ml-2 rotate-45" />
                  </Button>
                </Link>
              </>
            )
          )}
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
                to={item.href!}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.href 
                    ? "bg-muted text-primary" 
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Link>
            )
          )}
          {user && (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-foreground hover:bg-muted w-full"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
