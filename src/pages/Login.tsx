import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login",
      description: "Login functionality coming soon!",
    });
  };

  return (
    <Layout>
      <div className="hero-container auth-container">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
        <p className="text-secondary mb-8">Log in to access your saved itineraries.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-3 border-2 border-border rounded-lg"
            />
          </div>
          
          <button type="submit" className="confirm-btn">LOG IN</button>
          
          <p className="mt-4 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-secondary hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
