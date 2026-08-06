import { useState } from "react";
import { Search, Home, Trophy, Users, Bot, Mail, Bell, ChevronDown, LogOut, User } from "lucide-react";

export default function Navbar({ onOpenChatbot, onNavigateTab, activeTab = "home", onSignOut }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "competitions", label: "Competitions", icon: Trophy },
    { id: "collaboration", label: "Collaboration", icon: Users },
    { id: "chatbot", label: "AI Coach", icon: Bot, isChatbot: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#111318]/90 backdrop-blur-md border-b border-white/10 shadow-md flex justify-center">
      <div className="w-full max-w-[1400px] px-4 sm:px-6 h-[64px] flex items-center justify-between gap-4">
        
        {/* Left: Playure Brand Logo & Extended Search Bar */}
        <div className="flex items-center gap-6 flex-1 max-w-[700px] lg:max-w-[800px]">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer shrink-0 group" 
            onClick={() => onNavigateTab("home")}
          >
            <div className="bg-[#0b0e14] p-1 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.25)] border border-[#00f0ff]/30 flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-[#00f0ff]/70 overflow-hidden">
              <img
                src="/playure-logo.png"
                alt="Playure Logo"
                className="h-7 w-7 object-cover rounded-lg"
              />
            </div>
            <span className="font-['Hanken_Grotesk'] text-xl font-black tracking-tight text-white hidden sm:inline-block">
              Play<span className="text-[#00f0ff]">ure</span>
            </span>
          </div>

          {/* Extended Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8ab4f8] pointer-events-none z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tournaments, players, teams, or arenas..."
              className="w-full pl-11 pr-4 py-2 bg-[#222733] border border-white/15 rounded-full text-sm text-gray-100 placeholder-[#8ab4f8]/70 focus:outline-none focus:border-[#00f0ff] focus:ring-2 focus:ring-[#00f0ff]/20 transition-all shadow-inner font-['Inter']"
            />
          </div>
        </div>

        {/* Center/Right: Navigation Tabs */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isChatbot) {
                    onOpenChatbot();
                  } else {
                    onNavigateTab(item.id);
                  }
                }}
                className={`relative flex items-center gap-1.5 px-2 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive ? "text-[#00f0ff]" : "text-[#b9cacb] hover:text-[#00f0ff]"
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? "text-[#00f0ff]" : "text-[#b9cacb]"}`} />
                <span className="font-medium font-['Inter'] hidden md:inline-block">
                  {item.label}
                </span>

                {isActive && (
                  <div className="absolute -bottom-[16px] left-0 right-0 h-0.5 bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]" />
                )}
              </button>
            );
          })}

          {/* Utility Icons & Profile Dropdown */}
          <div className="flex items-center gap-3 pl-3 border-l border-white/10">
            {/* Mail Icon */}
            <button className="relative text-[#b9cacb] hover:text-[#00f0ff] p-1 transition-colors">
              <Mail className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-[#ffb4ab] text-[#690005] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-[#111318]">
                2
              </span>
            </button>

            {/* Notification Bell Icon */}
            <button className="relative text-[#b9cacb] hover:text-[#00f0ff] p-1 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-[#ffb4ab] text-[#690005] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-[#111318]">
                3
              </span>
            </button>

            {/* Profile Avatar & Interactive Dropdown */}
            <div className="relative pl-1">
              <div 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Ratish Naik"
                  className="w-8 h-8 rounded-full object-cover border border-[#00f0ff] shadow-sm"
                />
                <ChevronDown className="w-3.5 h-3.5 text-[#b9cacb] hidden sm:block" />
              </div>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 top-11 z-50 w-52 bg-[#161B22] border border-white/10 rounded-xl shadow-2xl p-2 text-xs font-['Inter'] backdrop-blur-2xl">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="font-bold text-white text-sm font-['Hanken_Grotesk']">Ratish Naik</p>
                    <p className="text-[11px] text-[#00f0ff]">State-level Athlete</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onNavigateTab("settings");
                    }}
                    className="w-full text-left px-3 py-2 text-[#b9cacb] hover:bg-[#333539] hover:text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#00f0ff]" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      if (onSignOut) onSignOut();
                    }}
                    className="w-full text-left px-3 py-2 text-[#ff4d4d] hover:bg-[#ff4d4d]/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer font-semibold mt-1 border-t border-white/5 pt-2"
                  >
                    <LogOut className="w-4 h-4 text-[#ff4d4d]" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </header>
  );
}

