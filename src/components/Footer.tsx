import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 text-sm" style={{ backgroundColor: '#ffffff' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-4 text-foreground">
              <img src={logo} alt="NexTravel AI" className="h-8 w-auto" />
              NexTravel
            </Link>
            <p className="text-muted-foreground mb-4">Revolutionizing travel with intelligent, crowd-aware planning.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3">Resources</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Crowd Index</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><Link to="/support" className="hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3">Legal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Settings</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between text-muted-foreground">
          <p>&copy; 2025 NexTravel Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span>Made with ❤️ for the planet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
