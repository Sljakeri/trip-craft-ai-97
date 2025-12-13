import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-muted-foreground py-12 px-8 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-primary-foreground mb-4 text-lg font-bold">NexTravel AI</h3>
          <p className="text-sm">Revolutionizing travel with intelligent planning.</p>
        </div>
        
        <div>
          <h4 className="text-primary-foreground mb-4 font-semibold">Company</h4>
          <Link to="/about" className="block text-muted-foreground no-underline mb-2 text-sm hover:text-secondary transition-colors">
            About Us
          </Link>
          <a href="#" className="block text-muted-foreground no-underline mb-2 text-sm hover:text-secondary transition-colors">
            Careers
          </a>
          <a href="#" className="block text-muted-foreground no-underline mb-2 text-sm hover:text-secondary transition-colors">
            Press
          </a>
        </div>
        
        <div>
          <h4 className="text-primary-foreground mb-4 font-semibold">Support</h4>
          <Link to="/support" className="block text-muted-foreground no-underline mb-2 text-sm hover:text-secondary transition-colors">
            Help Center
          </Link>
          <Link to="/support" className="block text-muted-foreground no-underline mb-2 text-sm hover:text-secondary transition-colors">
            Contact Us
          </Link>
          <a href="#" className="block text-muted-foreground no-underline mb-2 text-sm hover:text-secondary transition-colors">
            Refund Policy
          </a>
        </div>
        
        <div>
          <h4 className="text-primary-foreground mb-4 font-semibold">Legal</h4>
          <a href="#" className="block text-muted-foreground no-underline mb-2 text-sm hover:text-secondary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="block text-muted-foreground no-underline mb-2 text-sm hover:text-secondary transition-colors">
            Terms of Service
          </a>
          <Link to="/settings" className="block text-muted-foreground no-underline mb-2 text-sm hover:text-secondary transition-colors">
            Cookie Settings
          </Link>
        </div>
      </div>
      
      <div className="text-center mt-8 pt-4 border-t border-primary-foreground/20 text-xs">
        &copy; 2024 NexTravel AI Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
