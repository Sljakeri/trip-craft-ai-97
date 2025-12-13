import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock } from "lucide-react";

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

  const handleGoogleLogin = () => {
    toast({
      title: "Google Sign-In",
      description: "Google Sign-In coming soon!",
    });
  };

  return (
    <Layout>
      <div className="w-full flex justify-center py-20 px-5 bg-secondary/30">
        <div className="bg-card p-14 rounded-3xl w-full max-w-[520px] shadow-[0_25px_60px_rgba(0,0,0,0.08)] text-center">
          <div className="inline-block bg-primary/10 text-primary text-[13px] font-semibold px-[18px] py-2 rounded-full mb-3.5">
            Welcome Back
          </div>
          <h1 className="text-[38px] font-bold text-foreground my-3.5">Log In</h1>
          <p className="text-muted-foreground text-base mb-9">
            Access your saved itineraries and plans.
          </p>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2.5 h-[52px] rounded-full border border-border bg-card text-[15px] font-semibold cursor-pointer transition-all duration-200 hover:bg-muted hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)] mb-6"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-[18px] h-[18px]"
            />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6 text-muted-foreground text-sm">
            <div className="flex-1 h-px bg-border" />
            <span>or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="text-left">
            <label className="text-[15px] font-semibold mb-2 block text-foreground">
              Email Address
            </label>
            <div className="flex items-center border border-primary/20 rounded-full px-[18px] py-3 mb-[22px] transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.15)]">
              <Mail className="w-4 h-4 text-muted-foreground mr-2.5" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-none outline-none shadow-none p-0 h-auto text-base bg-transparent focus-visible:ring-0"
              />
            </div>

            <label className="text-[15px] font-semibold mb-2 block text-foreground">
              Password
            </label>
            <div className="flex items-center border border-primary/20 rounded-full px-[18px] py-3 mb-[22px] transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.15)]">
              <Lock className="w-4 h-4 text-muted-foreground mr-2.5" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-none outline-none shadow-none p-0 h-auto text-base bg-transparent focus-visible:ring-0"
              />
            </div>

            <button
              type="submit"
              className="w-full h-[54px] rounded-full border-none bg-primary text-primary-foreground text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] mt-2.5"
            >
              Log In
            </button>
          </form>

          <div className="mt-6 text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold no-underline hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
