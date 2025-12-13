import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Sign Up",
      description: "Account creation functionality coming soon!",
    });
  };

  return (
    <Layout>
      <div className="hero-container auth-container">
        <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
        <p className="text-secondary mb-8">Start your journey with NexTravel AI today.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-3 border-2 border-border rounded-lg"
            />
          </div>
          
          <div className="input-group mt-4">
            <label htmlFor="email">Email Address</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 border-2 border-border rounded-lg"
            />
          </div>
          
          <div className="input-group mt-4">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-3 border-2 border-border rounded-lg"
            />
          </div>
          
          <button type="submit" className="confirm-btn">CREATE ACCOUNT</button>
          
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline transition-colors duration-200">Log in</Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Signup;
