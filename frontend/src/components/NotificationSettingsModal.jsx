import { useState, useEffect } from "react";
import { X, Bell, Mail, Smartphone, MessageSquare, Trophy, Users, Bot, Settings, Check } from "lucide-react";

export default function NotificationSettingsModal({ isOpen, onClose }) {
  const [preferences, setPreferences] = useState({
    competitions: true,
    messages: true,
    social: true,
    ai_coach: true,
    system: true,
    email_enabled: true,
    push_enabled: true,
    sms_enabled: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchPreferences() {
      try {
        const res = await fetch("http://localhost:8000/api/v1/notifications/preferences");
        if (res.ok) {
          const data = await res.json();
          setPreferences(data.preferences || {});
        }
      } catch (err) {
        console.warn("Fetch preferences notice:", err);
      }
    }

    fetchPreferences();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("http://localhost:8000/api/v1/notifications/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences)
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.warn("Save preferences notice:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      
      {/* Modal Box */}
      <div className="w-full max-w-lg bg-[#111318] border border-white/10 rounded-3xl p-6 shadow-2xl relative font-['Inter',sans-serif]">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Hanken_Grotesk'] font-bold text-white text-base leading-tight">
                Notification Preferences
              </h3>
              <p className="text-xs text-[#b9cacb]">Manage channel and category alerts</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preferences Toggles List */}
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 chat-scroll">
          
          <span className="text-[10px] font-bold text-[#b9cacb] font-['JetBrains_Mono'] uppercase tracking-wider block">
            Category Alerts
          </span>

          {[
            { key: "competitions", label: "Competitions & Tournaments", desc: "Registrations, match schedules & winner alerts", icon: Trophy },
            { key: "messages", label: "Direct & Group Messages", desc: "Real-time chat messages & mentions", icon: MessageSquare },
            { key: "social", label: "Social & Team Invites", desc: "Followers, connection requests & team invites", icon: Users },
            { key: "ai_coach", label: "AI Coach Insights", desc: "Weekly reports, 1RM updates & recovery plans", icon: Bot },
            { key: "system", label: "System & Security Alerts", desc: "Security logins, feature launches & maintenance", icon: Bell }
          ].map(item => {
            const Icon = item.icon;
            const isChecked = preferences[item.key];

            return (
              <div key={item.key} className="flex items-center justify-between p-3 bg-[#1e2024]/60 border border-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#282a2e] flex items-center justify-center text-[#7df4ff]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-['Hanken_Grotesk']">{item.label}</h4>
                    <p className="text-[11px] text-[#b9cacb]">{item.desc}</p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button 
                  onClick={() => handleToggle(item.key)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    isChecked ? "bg-[#00f0ff]" : "bg-[#282a2e]"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-[#002022] transform transition-transform ${
                    isChecked ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>
            );
          })}

          <span className="text-[10px] font-bold text-[#b9cacb] font-['JetBrains_Mono'] uppercase tracking-wider block pt-2">
            Delivery Channels
          </span>

          {[
            { key: "push_enabled", label: "Browser & In-App Push", desc: "Real-time desktop popups", icon: Smartphone },
            { key: "email_enabled", label: "Email Summaries", desc: "Important weekly digests & security alerts", icon: Mail },
            { key: "sms_enabled", label: "SMS Urgent Alerts", desc: "Immediate match schedule SMS alerts", icon: Smartphone }
          ].map(item => {
            const Icon = item.icon;
            const isChecked = preferences[item.key];

            return (
              <div key={item.key} className="flex items-center justify-between p-3 bg-[#1e2024]/60 border border-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#282a2e] flex items-center justify-center text-[#7df4ff]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-['Hanken_Grotesk']">{item.label}</h4>
                    <p className="text-[11px] text-[#b9cacb]">{item.desc}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleToggle(item.key)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    isChecked ? "bg-[#00f0ff]" : "bg-[#282a2e]"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-[#002022] transform transition-transform ${
                    isChecked ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>
            );
          })}

        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          {savedSuccess ? (
            <span className="text-xs text-[#00FF41] font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Preferences saved!
            </span>
          ) : (
            <span className="text-[11px] text-[#b9cacb]">Changes auto-sync across devices</span>
          )}

          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-[#00f0ff] hover:bg-[#7df4ff] text-[#002022] font-bold font-['Hanken_Grotesk'] text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
