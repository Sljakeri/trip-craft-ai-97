import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Camera, LogOut, MapPin } from "lucide-react";

const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    if (data) {
      setFullName(data.full_name || "");
      setEmail(data.email || user.email || "");
      setAvatarUrl(data.avatar_url);
    } else {
      setEmail(user.email || "");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile Saved",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
  };

  if (loading) {
    return (
      <Layout>
        <main className="flex justify-center items-center px-5 py-20 min-h-[calc(100vh-140px)]">
          <div className="text-slate-500">Loading...</div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex justify-center px-5 py-20">
        <div className="bg-white p-14 rounded-3xl w-full max-w-[640px] shadow-[0_25px_60px_rgba(0,0,0,0.08)] text-center">
          <div className="inline-block bg-indigo-50 text-indigo-600 text-sm font-semibold px-5 py-2 rounded-full mb-4">
            My Profile
          </div>
          
          <h1 className="text-4xl font-bold text-slate-800 my-4 tracking-tight">
            Account Settings
          </h1>
          
          <p className="text-slate-500 text-base mb-10">
            Manage your profile information
          </p>

          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div 
              onClick={handleAvatarClick}
              className="relative w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer group overflow-hidden border-4 border-white shadow-lg"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-slate-400" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          {/* Form */}
          <div className="text-left">
            <label className="text-sm font-semibold text-slate-800 mb-2 block">
              Full Name
            </label>
            <div className="flex items-center border border-blue-100 rounded-full px-5 py-3 mb-5 transition-all duration-200 focus-within:border-indigo-400 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.15)]">
              <User className="text-slate-500 mr-3 h-4 w-4" />
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border-none outline-none w-full text-base bg-transparent"
              />
            </div>

            <label className="text-sm font-semibold text-slate-800 mb-2 block">
              Email Address
            </label>
            <div className="flex items-center border border-blue-100 rounded-full px-5 py-3 mb-6 bg-slate-50">
              <Mail className="text-slate-500 mr-3 h-4 w-4" />
              <input
                type="email"
                value={email}
                disabled
                className="border-none outline-none w-full text-base bg-transparent text-slate-500"
              />
            </div>

            {/* Saved Trips Link */}
            <Link
              to="/saved-trips"
              className="w-full h-14 border-2 border-indigo-200 rounded-full bg-indigo-50 text-indigo-700 text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-indigo-100 active:scale-[0.98] flex items-center justify-center gap-2 mb-4"
            >
              <MapPin className="h-4 w-4" />
              View Saved Trips
            </Link>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full h-14 border-none rounded-full bg-indigo-500 text-white text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-indigo-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={handleSignOut}
              className="w-full h-14 border-2 border-slate-200 rounded-full bg-white text-slate-700 text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-slate-50 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Profile;
