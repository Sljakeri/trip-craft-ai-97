import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Plane, User, UserPlus, Info, Crown, Headphones, Settings } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { href: "/login", icon: User, label: "Log In" },
    { href: "/signup", icon: UserPlus, label: "Sign Up" },
    { divider: true },
    { href: "/about", icon: Info, label: "About AI" },
    { href: "/premium", icon: Crown, label: "Premium Plans" },
    { href: "/support", icon: Headphones, label: "Support" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <header className="bg-card px-4 md:px-8 py-4 flex justify-between items-center shadow-md relative z-50 border-b-2 border-secondary">
      <Link to="/" className="flex items-center gap-2 text-foreground no-underline">
        <Plane className="h-6 w-6 text-secondary" />
        <span className="text-xl font-bold">NexTravel AI</span>
      </Link>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-transparent border-none text-2xl text-foreground cursor-pointer transition-colors hover:text-secondary"
          aria-label="Menu"
        >
          <Menu className="h-7 w-7" />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 w-64 bg-card shadow-xl rounded-bl-lg overflow-hidden">
            <ul className="list-none p-0 m-0">
              {menuItems.map((item, index) =>
                item.divider ? (
                  <hr key={index} className="border-0 h-px bg-border my-0" />
                ) : (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-5 py-4 text-foreground no-underline border-b border-muted transition-colors hover:bg-muted hover:text-secondary ${
                        location.pathname === item.href ? "bg-muted text-secondary" : ""
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
