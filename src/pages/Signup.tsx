import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePendingTrip } from "@/hooks/usePendingTrip";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, User } from "lucide-react";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getPendingTrip, clearPendingTrip } = usePendingTrip();

  const savePendingTripToDb = async (userId: string) => {
    const pendingTrip = getPendingTrip();
    if (!pendingTrip) return;

    try {
      const { error } = await supabase
        .from("saved_trips")
        .insert([{
          user_id: userId,
          name: `Trip to ${pendingTrip.destinationCity}`,
          origin: pendingTrip.formData?.origin || null,
          destination: pendingTrip.destinationCity,
          start_date: pendingTrip.formData?.dateFrom ? new Date(pendingTrip.formData.dateFrom).toISOString().split('T')[0] : null,
          end_date: pendingTrip.formData?.dateTo ? new Date(pendingTrip.formData.dateTo).toISOString().split('T')[0] : null,
          budget: pendingTrip.formData?.budget || null,
          travelers_adults: pendingTrip.formData?.travelers?.adults || 1,
          travelers_kids: pendingTrip.formData?.travelers?.kids || 0,
          transport_modes: pendingTrip.formData?.transport || [],
          crowd_preference: pendingTrip.formData?.crowdPreference || null,
          trip_data: pendingTrip.tripData,
        }] as any);

      if (error) throw error;

      clearPendingTrip();
      toast({
        title: "Trip Saved!",
        description: "Your trip has been saved to your profile.",
      });
      navigate("/saved-trips");
    } catch (error: any) {
      console.error("Error saving pending trip:", error);
      toast({
        title: "Save Failed",
        description: "Could not save trip. Please try again from your trips.",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  useEffect(() => {
    if (!loading && user) {
      const redirect = searchParams.get("redirect");
      if (redirect === "save-trip") {
        savePendingTripToDb(user.id);
      } else {
        navigate("/");
      }
    }
  }, [user, loading, navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = signupSchema.safeParse({ name, email, password });
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(email, password, name);
    setIsSubmitting(false);

    if (error) {
      let message = error.message;
      if (message.includes("User already registered")) {
        message = "An account with this email already exists. Please log in instead.";
      }
      toast({
        title: "Sign Up Failed",
        description: message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account Created!",
      description: "Welcome to NexTravel AI. You are now logged in.",
    });
    navigate("/");
  };

  const handleGoogleSignup = () => {
    toast({
      title: "Google Sign-Up",
      description: "Google Sign-Up coming soon!",
    });
  };

  if (loading) {
    return (
      <Layout>
        <main className="flex justify-center items-center px-5 py-20 bg-slate-100 min-h-[calc(100vh-140px)]">
          <div className="text-slate-500">Loading...</div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex justify-center px-5 py-20 bg-slate-100 min-h-[calc(100vh-140px)]">
        <div className="bg-white p-14 rounded-3xl w-full max-w-[520px] shadow-[0_25px_60px_rgba(0,0,0,0.08)] text-center">
          {/* Badge */}
          <div className="inline-block bg-indigo-50 text-primary text-sm font-semibold px-5 py-2 rounded-full mb-4">
            Get Started
          </div>
          
          {/* Heading */}
          <h1 className="text-4xl font-bold text-foreground mb-3">Create Account</h1>
          <p className="text-slate-500 text-base mb-9">
            Start planning smarter trips with AI.
          </p>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignup}
            className="flex items-center justify-center gap-3 w-full h-14 rounded-full border border-slate-200 bg-white text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:shadow-lg mb-6"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6 text-slate-400 text-sm">
            <div className="flex-1 h-px bg-slate-200" />
            <span>or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="text-left">
            <label className="text-base font-semibold mb-2 block text-foreground">
              Full Name
            </label>
            <div className="flex items-center border border-blue-100 rounded-full px-5 py-3 mb-5 transition-all duration-200 focus-within:border-indigo-400 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.15)]">
              <User className="w-5 h-5 text-slate-500 mr-3" />
              <Input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-none shadow-none p-0 h-auto text-base focus-visible:ring-0 bg-transparent"
                required
              />
            </div>

            <label className="text-base font-semibold mb-2 block text-foreground">
              Email Address
            </label>
            <div className="flex items-center border border-blue-100 rounded-full px-5 py-3 mb-5 transition-all duration-200 focus-within:border-indigo-400 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.15)]">
              <Mail className="w-5 h-5 text-slate-500 mr-3" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-none shadow-none p-0 h-auto text-base focus-visible:ring-0 bg-transparent"
                required
              />
            </div>

            <label className="text-base font-semibold mb-2 block text-foreground">
              Password
            </label>
            <div className="flex items-center border border-blue-100 rounded-full px-5 py-3 mb-5 transition-all duration-200 focus-within:border-indigo-400 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.15)]">
              <Lock className="w-5 h-5 text-slate-500 mr-3" />
              <Input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-none shadow-none p-0 h-auto text-base focus-visible:ring-0 bg-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-full border-none bg-primary text-white text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline transition-colors duration-200">
              Log in
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Signup;
