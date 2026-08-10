import { 
  Trophy, 
  Bookmark, 
  Users, 
  MapPin, 
  Globe, 
  Settings, 
  Award,
  FileText,
  UserPlus,
  LogOut,
  Bot,
  Mail
} from "lucide-react";

import { useUser } from "@clerk/clerk-react";

export default function LeftProfileSidebar({ activeTab, onNavigateTab, onNavigateCompetitions, onSignOut }) {
  const { user } = useUser();
  const userAvatar = "/default_avatar.jpg";
  const userName = user?.fullName || localStorage.getItem("playure_demo_user_name") || "Ratish Naik";

  const menuItems = [
    { id: "ai_assistant", label: "AI Coach & Resume", icon: Bot, isHighlight: true },
    { id: "messages", label: "Direct Messages", icon: Mail },
    { id: "competitions", label: "Competitions", icon: Trophy },
    { id: "tournaments", label: "My Tournaments", icon: Award },
    { id: "registrations", label: "My Registrations", icon: FileText },
    { id: "teams", label: "My Teams", icon: Users },
    { id: "saved", label: "Saved Events", icon: Bookmark },
    { id: "network", label: "My Network", icon: UserPlus },
    { id: "clubs", label: "Local Clubs & Grounds", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "signout", label: "Sign Out", icon: LogOut, isDanger: true },
  ];

  return (
    <aside className="w-full space-y-4">
      {/* Profile Glassmorphism Card Container */}
      <div className="relative overflow-hidden bg-[#161B22]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Avatar & User Info */}
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="relative mb-3">
            <img
              src={userAvatar}
              alt={userName}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#00f0ff] shadow-xl"
            />
            {/* Avatar Badge Overlay */}
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#00f0ff] text-[#002022] rounded-full flex items-center justify-center border-2 border-[#0D1117] shadow-md text-[10px] font-extrabold">
              ✓
            </div>
          </div>

          {/* Name & Subtitle */}
          <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5 font-['Hanken_Grotesk','Outfit',sans-serif] mt-1">
            <span>{userName}</span>
            <span className="w-3.5 h-3.5 rounded-full bg-[#00f0ff] text-[#002022] text-[9px] flex items-center justify-center font-extrabold">
              ✓
            </span>
          </h3>

          <p className="text-xs text-[#b9cacb] font-normal mt-0.5">
            State-level athlete
          </p>
        </div>

        {/* Glassmorphic Stats Section */}
        <div className="mt-4 bg-[#111318]/80 border border-white/10 rounded-xl p-3 shadow-inner backdrop-blur-md relative z-10">
          <div className="grid grid-cols-3 gap-1 text-center">
            <div>
              <span className="text-[11px] text-[#b9cacb] block font-normal">Views</span>
              <span className="text-sm font-bold text-[#00f0ff] block mt-0.5 font-['JetBrains_Mono',monospace]">142</span>
            </div>

            <div>
              <span className="text-[11px] text-[#b9cacb] block font-normal">Followers</span>
              <span className="text-sm font-bold text-[#00f0ff] block mt-0.5 font-['JetBrains_Mono',monospace]">2.4K</span>
            </div>

            <div>
              <span className="text-[11px] text-[#b9cacb] block font-normal">Comps</span>
              <span className="text-sm font-bold text-[#00f0ff] block mt-0.5 font-['JetBrains_Mono',monospace]">18</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <div className="mt-5 space-y-1 relative z-10">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === "competitions" && activeTab === "competitions");

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "signout") {
                    if (onSignOut) onSignOut();
                  } else if (item.id === "competitions") {
                    onNavigateCompetitions();
                  } else {
                    onNavigateTab(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  item.isDanger
                    ? "text-[#ff4d4d] hover:bg-[#ff4d4d]/10 hover:text-[#ff6666]"
                    : isActive
                    ? "bg-[rgba(0,240,255,0.1)] text-[#00f0ff] border-r-4 border-[#00f0ff] font-semibold"
                    : "text-[#b9cacb] hover:bg-[#333539]/60 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${item.isDanger ? "text-[#ff4d4d]" : isActive ? "text-[#00f0ff]" : "text-[#b9cacb]"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6 relative z-10">
          <button 
            onClick={() => alert("Profile Editor opened!")}
            className="w-full py-3 bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] font-bold text-xs uppercase tracking-wider rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] cursor-pointer transition-all font-['Hanken_Grotesk','Inter']"
          >
            EDIT PROFILE
          </button>
        </div>

      </div>
    </aside>
  );
}



