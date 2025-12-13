import { useState } from "react";
import { Globe, Bell, Moon } from "lucide-react";
import Layout from "@/components/Layout";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [currency, setCurrency] = useState("USD ($)");
  const [language, setLanguage] = useState("English");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <Layout>
      <div className="hero-container">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-secondary mb-8">Manage your preferences.</p>
        
        <div className="settings-section">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Globe className="h-5 w-5" />
            Regional
          </h3>
          <div className="setting-item">
            <label>Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-card text-foreground"
            >
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-card text-foreground"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>
        
        <hr className="my-5 border-0 border-t border-border" />
        
        <div className="settings-section">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Bell className="h-5 w-5" />
            Notifications
          </h3>
          <div className="setting-item">
            <label>Email Updates</label>
            <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} />
          </div>
          <div className="setting-item">
            <label>Push Alerts</label>
            <Switch checked={pushAlerts} onCheckedChange={setPushAlerts} />
          </div>
        </div>
        
        <hr className="my-5 border-0 border-t border-border" />
        
        <div className="settings-section">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Moon className="h-5 w-5" />
            Appearance
          </h3>
          <div className="setting-item">
            <label>Dark Mode</label>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </div>
        
        <button onClick={handleSave} className="confirm-btn">SAVE SETTINGS</button>
      </div>
    </Layout>
  );
};

export default Settings;
