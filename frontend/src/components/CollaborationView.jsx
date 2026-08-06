import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  MapPin, 
  Clock, 
  Megaphone, 
  Filter, 
  CheckCircle2, 
  Plus, 
  Calendar,
  Sparkles,
  Trophy
} from "lucide-react";
import { SPORTS_CATEGORIES } from "./SportsCategoriesBar";

export default function CollaborationView() {
  const [sport, setSport] = useState("Football");
  const [location, setLocation] = useState("");
  const [datetime, setDatetime] = useState("");
  const [playersNeeded, setPlayersNeeded] = useState(2);
  const [filterSport, setFilterSport] = useState("All");

  // Initial Collaboration Requests state
  const [requests, setRequests] = useState([
    {
      id: 1,
      adminName: "Rahul Dravid",
      adminAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
      sport: "Football",
      sportIcon: "⚽",
      location: "Turf Park, Koramangala",
      time: "Today, 19:00",
      isLive: true,
      isTimeGold: true,
      currentPlayers: 5,
      totalPlayers: 7,
      isJoined: false,
    },
    {
      id: 2,
      adminName: "Sneha Reddy",
      adminAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      sport: "Badminton",
      sportIcon: "🏸",
      location: "Indiranagar Club",
      time: "Tomorrow, 07:00",
      isLive: false,
      isTimeGold: false,
      currentPlayers: 1,
      totalPlayers: 4,
      isJoined: false,
    },
    {
      id: 3,
      adminName: "Vikram Singh",
      adminAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
      sport: "Cricket",
      sportIcon: "🏏",
      location: "HSR Layout Grounds",
      time: "Sat, 14:00",
      isLive: false,
      isTimeGold: false,
      currentPlayers: 10,
      totalPlayers: 11,
      isJoined: false,
    },
  ]);

  // Fetch Collaborations from PostgreSQL Database Backend
  useEffect(() => {
    async function fetchDBCollaborations() {
      try {
        const res = await fetch("http://localhost:8000/api/v1/collaborations");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((item) => ({
              id: item.id,
              adminName: item.admin_name,
              adminAvatar: item.admin_avatar,
              sport: item.sport,
              sportIcon: item.sport_icon || "🏆",
              location: item.location,
              time: item.time,
              isLive: item.is_live,
              isTimeGold: item.is_time_gold,
              currentPlayers: item.current_players,
              totalPlayers: item.total_players,
              isJoined: item.is_joined || false,
            }));

            setRequests((prev) => {
              const existingIds = new Set((prev || []).map((p) => String(p.id)));
              const uniqueNew = mapped.filter((item) => !existingIds.has(String(item.id)));
              return [...uniqueNew, ...prev];
            });
          }
        }
      } catch (err) {
        console.warn("PostgreSQL DB collaboration fetch notice:", err);
      }
    }
    fetchDBCollaborations();
  }, []);

  const handlePostRequest = async (e) => {
    e.preventDefault();
    if (!location.trim()) {
      alert("Please enter a location for your collaboration request.");
      return;
    }

    const needed = Number(playersNeeded) || 5;
    const selectedSportObj = SPORTS_CATEGORIES.find((s) => s.name === sport);
    const timeStr = datetime ? new Date(datetime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Upcoming";

    const payload = {
      sport: sport,
      location: location.trim(),
      datetime_info: timeStr,
      players_needed: needed,
      admin_name: "Ratish Naik",
      admin_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    };

    try {
      const res = await fetch("http://localhost:8000/api/v1/collaborations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedData = await res.json();
        const newReq = {
          id: savedData.id,
          adminName: savedData.admin_name,
          adminAvatar: savedData.admin_avatar,
          sport: savedData.sport,
          sportIcon: savedData.sport_icon || selectedSportObj?.icon || "🏆",
          location: savedData.location,
          time: savedData.time,
          isLive: savedData.is_live,
          isTimeGold: savedData.is_time_gold,
          currentPlayers: savedData.current_players,
          totalPlayers: savedData.total_players,
          isJoined: false,
        };
        setRequests([newReq, ...requests]);
        alert("🎉 Your Collaboration Request has been stored in PostgreSQL Database and published!");
      } else {
        const fallback = {
          id: Date.now(),
          adminName: "Ratish Naik",
          adminAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          sport: sport,
          sportIcon: selectedSportObj?.icon || "🏆",
          location: location.trim(),
          time: timeStr,
          isLive: false,
          isTimeGold: true,
          currentPlayers: 1,
          totalPlayers: needed + 1,
          isJoined: false,
        };
        setRequests([fallback, ...requests]);
        alert("🎉 Your Collaboration Request has been published!");
      }
    } catch (err) {
      console.warn("PostgreSQL save notice:", err);
      const fallback = {
        id: Date.now(),
        adminName: "Ratish Naik",
        adminAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        sport: sport,
        sportIcon: selectedSportObj?.icon || "🏆",
        location: location.trim(),
        time: timeStr,
        isLive: false,
        isTimeGold: true,
        currentPlayers: 1,
        totalPlayers: needed + 1,
        isJoined: false,
      };
      setRequests([fallback, ...requests]);
      alert("🎉 Your Collaboration Request has been published!");
    }

    setLocation("");
    setDatetime("");
  };

  const handleToggleJoin = async (id) => {
    // Send backend toggle request if valid UUID
    if (typeof id === "string" && id.includes("-")) {
      try {
        await fetch(`http://localhost:8000/api/v1/collaborations/${id}/join`, {
          method: "POST",
        });
      } catch (err) {
        console.warn("Join backend notice:", err);
      }
    }

    setRequests(
      requests.map((req) => {
        if (req.id === id) {
          if (req.isJoined) {
            return {
              ...req,
              currentPlayers: Math.max(0, req.currentPlayers - 1),
              isJoined: false,
            };
          } else {
            if (req.currentPlayers >= req.totalPlayers) {
              alert("This squad is already fully filled!");
              return req;
            }
            return {
              ...req,
              currentPlayers: req.currentPlayers + 1,
              isJoined: true,
            };
          }
        }
        return req;
      })
    );
  };

  const filteredRequests = filterSport === "All" 
    ? requests 
    : requests.filter((r) => r.sport.toLowerCase().includes(filterSport.toLowerCase()));

  return (
    <div className="w-full space-y-10 pb-16">
      
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="font-['Hanken_Grotesk'] text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Collaboration Hub
        </h1>
        <p className="text-[#b9cacb] font-['Inter'] text-base sm:text-lg">
          Find teammates, create squads, and dominate the arena.
        </p>
      </div>

      {/* Post a Collaboration Form Glass Panel */}
      <section className="bg-[#161B22]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-12">
        <h2 className="font-['Hanken_Grotesk'] text-xl font-semibold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-[#00f0ff]" />
          <span>Post a Collaboration Request</span>
        </h2>

        <form onSubmit={handlePostRequest} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            
            {/* SPORT */}
            <div className="space-y-2">
              <label className="font-['JetBrains_Mono',monospace] text-xs text-[#b9cacb] block uppercase tracking-wider">
                Sport
              </label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full bg-transparent border-b border-[#3b494b] focus:border-[#00f0ff] focus:outline-none text-white py-2 px-1 text-sm font-['Inter'] cursor-pointer"
              >
                {SPORTS_CATEGORIES.filter((s) => s.name !== "All Sports").map((s) => (
                  <option key={s.name} value={s.name} className="bg-[#111318] text-white">
                    {s.icon} {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION */}
            <div className="space-y-2">
              <label className="font-['JetBrains_Mono',monospace] text-xs text-[#b9cacb] block uppercase tracking-wider">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kanteerava Stadium"
                className="w-full bg-transparent border-b border-[#3b494b] focus:border-[#00f0ff] focus:outline-none text-white py-2 px-1 text-sm font-['Inter'] placeholder:text-[#b9cacb]/40"
              />
            </div>

            {/* DATE & TIME */}
            <div className="space-y-2">
              <label className="font-['JetBrains_Mono',monospace] text-xs text-[#b9cacb] block uppercase tracking-wider">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                className="w-full bg-transparent border-b border-[#3b494b] focus:border-[#00f0ff] focus:outline-none text-white py-2 px-1 text-sm font-['Inter'] [color-scheme:dark]"
              />
            </div>

            {/* PLAYERS NEEDED */}
            <div className="space-y-2">
              <label className="font-['JetBrains_Mono',monospace] text-xs text-[#b9cacb] block uppercase tracking-wider">
                Players Needed
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={playersNeeded}
                onChange={(e) => setPlayersNeeded(e.target.value)}
                placeholder="e.g. 5"
                className="w-full bg-transparent border-b border-[#3b494b] focus:border-[#00f0ff] focus:outline-none text-white py-2 px-1 text-sm font-['JetBrains_Mono',monospace] placeholder:text-[#b9cacb]/40"
              />
            </div>

          </div>

          {/* Submit Action Row */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-['Hanken_Grotesk'] text-sm font-bold tracking-wider px-8 py-3 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-2 transition-all uppercase cursor-pointer active:scale-95"
            >
              <Megaphone className="w-4 h-4" />
              <span>Post Request</span>
            </button>
          </div>
        </form>
      </section>

      {/* Active Requests Grid Section with generous top margin */}
      <section className="space-y-8 pt-4">
        
        {/* Header & Filter Controls with increased bottom padding */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 my-2 border-b border-white/10">
          <h2 className="font-['Hanken_Grotesk'] text-xl font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00f0ff]" />
            <span>Active Requests</span>
          </h2>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#161B22] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-[#00f0ff] font-['JetBrains_Mono',monospace] shadow-md">
              <Filter className="w-3.5 h-3.5" />
              <select
                value={filterSport}
                onChange={(e) => setFilterSport(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer font-['Inter']"
              >
                {SPORTS_CATEGORIES.map((s) => (
                  <option key={s.name} value={s.name === "All Sports" ? "All" : s.name} className="bg-[#111318]">
                    {s.icon} {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Requests Cards Grid: 2 cards per line with generous 32px gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <AnimatePresence>
            {filteredRequests.map((req) => {
              const fillPercentage = Math.min(100, Math.round((req.currentPlayers / req.totalPlayers) * 100));
              const slotsLeft = req.totalPlayers - req.currentPlayers;
              const isAlmostFull = fillPercentage >= 80;

              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#161B22]/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden flex flex-col relative group hover:border-[#00f0ff]/40 transition-all duration-300 shadow-xl"
                >
                  
                  {/* Live Now Pip Badge */}
                  {req.isLive && (
                    <div className="absolute top-4 right-4 bg-[#161B22] border border-white/10 px-2.5 py-1 rounded text-xs font-['JetBrains_Mono',monospace] text-white flex items-center gap-2 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></span>
                      <span>Live Now</span>
                    </div>
                  )}

                  {/* Card Header: Admin Avatar, Name, Sport */}
                  <div className="p-6 pb-4 border-b border-white/10 flex items-center gap-4">
                    <img
                      src={req.adminAvatar}
                      alt={req.adminName}
                      className="w-12 h-12 rounded-full border border-[#00f0ff] object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-['Hanken_Grotesk'] text-lg font-semibold text-white truncate">
                        {req.adminName}
                      </h3>
                      <div className="text-[#b9cacb] text-xs flex items-center gap-1 font-['Inter'] mt-0.5">
                        <span>{req.sportIcon}</span>
                        <span>{req.sport}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body: Location, Time, Squad Filled Bar */}
                  <div className="p-6 flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[#b9cacb] font-['JetBrains_Mono',monospace] text-xs uppercase mb-1">
                          Location
                        </div>
                        <div className="font-['Inter'] text-sm text-white truncate">
                          {req.location}
                        </div>
                      </div>
                      <div>
                        <div className="text-[#b9cacb] font-['JetBrains_Mono',monospace] text-xs uppercase mb-1">
                          Time
                        </div>
                        <div className={`font-['Inter'] text-sm ${req.isTimeGold ? 'text-[#FFD700] font-semibold' : 'text-white'}`}>
                          {req.time}
                        </div>
                      </div>
                    </div>

                    {/* Squad Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-2 font-['Inter']">
                        <span className="text-[#b9cacb]">Squad Filled</span>
                        <span className="font-['JetBrains_Mono',monospace] font-bold text-[#00f0ff]">
                          {req.currentPlayers}/{req.totalPlayers} Players
                        </span>
                      </div>
                      <div className="w-full bg-[#333539] rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isAlmostFull ? "bg-[#FFD700]" : "bg-[#00f0ff]"
                          }`}
                          style={{ width: `${fillPercentage}%` }}
                        />
                      </div>
                      <div className="text-right text-xs font-['JetBrains_Mono',monospace] text-[#b9cacb] mt-1">
                        {slotsLeft <= 0 ? (
                          <span className="text-[#00FF41]">Squad Full</span>
                        ) : slotsLeft === 1 ? (
                          <span className="text-[#FFD700] font-semibold">1 Slot Left!</span>
                        ) : (
                          <span>{slotsLeft} Slots Left</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Collaborate Button */}
                  <div className="p-4 bg-[#161B22]/40 border-t border-white/5">
                    {req.isJoined ? (
                      <button
                        type="button"
                        onClick={() => handleToggleJoin(req.id)}
                        className="w-full bg-[#00FF41]/20 border border-[#00FF41] text-[#00FF41] py-2.5 rounded font-['Hanken_Grotesk'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Joined (Leave)</span>
                      </button>
                    ) : slotsLeft <= 0 ? (
                      <button
                        type="button"
                        disabled
                        className="w-full bg-[#333539] text-[#b9cacb]/50 py-2.5 rounded font-['Hanken_Grotesk'] font-bold text-xs uppercase tracking-wider cursor-not-allowed"
                      >
                        Squad Full
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleJoin(req.id)}
                        className="w-full bg-transparent border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#00363a] py-2.5 rounded font-['Hanken_Grotesk'] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.15)] group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                      >
                        Collaborate
                      </button>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </section>

    </div>
  );
}
