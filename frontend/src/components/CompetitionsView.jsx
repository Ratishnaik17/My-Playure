import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Plus,
  Search,
  Calendar,
  MapPin,
  X,
  ChevronRight,
  Filter,
  Bookmark,
  Clock,
  Phone,
  Share2
} from "lucide-react";
import { SPORTS_CATEGORIES } from "./SportsCategoriesBar";
import AddCompetitionModal from "./AddCompetitionModal";

const LOCAL_COMPETITION_LEVELS = [
  "All Levels",
  "District Level",
  "State Level",
  "National Level",
  "International Level",
  "College / University",
  "School Level",
  "Club Level",
  "Open Tournament",
];

const LOCAL_DEFAULT_SPORT_BANNERS = {
  Cricket: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80",
  Football: "/football_default.jpg",
  Badminton: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
  Kabaddi: "/kabaddi_default.png",
  Hockey: "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&auto=format&fit=crop&q=80",
  Tennis: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80",
  Basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80",
  Athletics: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80",
  Volleyball: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80",
  "Table Tennis": "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&auto=format&fit=crop&q=80",
  Chess: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop&q=80",
};

export default function CompetitionsView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDetailComp, setActiveDetailComp] = useState(null);
  const [registeredComps, setRegisteredComps] = useState([]);

  const getCompBanner = (comp) => {
    if (!comp) return LOCAL_DEFAULT_SPORT_BANNERS["Badminton"];

    const sportName = (comp.sport || "").trim();
    const matchedKey = Object.keys(LOCAL_DEFAULT_SPORT_BANNERS).find(
      (key) => key.toLowerCase() === sportName.toLowerCase()
    );
    const defaultForSport = matchedKey ? LOCAL_DEFAULT_SPORT_BANNERS[matchedKey] : LOCAL_DEFAULT_SPORT_BANNERS["Badminton"];

    // If custom bannerImage is provided
    if (comp.bannerImage && typeof comp.bannerImage === "string" && comp.bannerImage.trim().length > 0) {
      const banner = comp.bannerImage.trim();

      // Check if sport is Kabaddi
      if (sportName.toLowerCase() === "kabaddi") {
        // If image is a default football or badminton image or non-kabaddi default image, override with Kabaddi default banner!
        if (!banner.includes("kabaddi") && (banner.includes("football") || banner.includes("badminton") || banner.includes("unsplash.com") || banner.includes("photo-"))) {
          return LOCAL_DEFAULT_SPORT_BANNERS["Kabaddi"];
        }
      }

      // Check if sport is Football
      if (sportName.toLowerCase() === "football") {
        if (!banner.includes("football") && (banner.includes("kabaddi") || banner.includes("badminton"))) {
          return LOCAL_DEFAULT_SPORT_BANNERS["Football"];
        }
      }

      return banner;
    }

    return defaultForSport;
  };

  const [competitions, setCompetitions] = useState([
    {
      id: 1,
      title: "All-India Inter-State Badminton Masters 2026",
      sport: "Badminton",
      sportIcon: "🏸",
      level: "National Level",
      date: "March 23, 2026",
      location: "Bengaluru, KA",
      organizer: "Karnataka Badminton Association",
      prizePool: "₹2,50,000 + Gold Medals",
      registrationFee: "₹500 / Entry",
      maxParticipants: "128 Players",
      contactInfo: "+91 98450 12345 (Coach Ramesh)",
      description: "Official All-India Men's & Women's Singles & Doubles Badminton Championship. BWF rules apply. Feather shuttles provided. Cash prizes for Top 8 finalists.",
      bannerImage: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
      status: "OPEN",
      registeredCount: 42,
    },
    {
      id: 2,
      title: "Mumbai Open T20 Turf Cricket Championship",
      sport: "Cricket",
      sportIcon: "🏏",
      level: "State Level",
      date: "March 23, 2026",
      location: "Mumbai, MH",
      organizer: "Mumbai Cricket Club & Playure League",
      prizePool: "₹1,50,000 + Championship Trophy",
      registrationFee: "₹3,500 / Team",
      maxParticipants: "16 Teams",
      contactInfo: "+91 98200 67890 (Siddharth Sports)",
      description: "Night T20 Cricket League played with red leather balls under floodlights. High-definition match recordings provided to all participating teams.",
      bannerImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80",
      status: "OPEN",
      registeredCount: 11,
    },
    {
      id: 3,
      title: "Delhi State Senior Kabaddi Championship 2026",
      sport: "Kabaddi",
      sportIcon: "🤼",
      level: "State Level",
      date: "March 28, 2026",
      location: "Delhi, DL",
      organizer: "Delhi Amateur Kabaddi Assn",
      prizePool: "₹1,00,000 + Pro Trial Nomination",
      registrationFee: "Free Entry",
      maxParticipants: "32 Squads",
      contactInfo: "+91 99100 45678 (Secretary Vijay)",
      description: "State Championship for Selection in National Games 2026. Official Pro Kabaddi scouts will be present for talent identification.",
      bannerImage: "/kabaddi_default.png",
      status: "OPEN",
      registeredCount: 24,
    },
    {
      id: 4,
      title: "Bengaluru City Inter-College Football League",
      sport: "Football",
      sportIcon: "⚽",
      level: "College / University",
      date: "April 05, 2026",
      location: "Bengaluru, KA",
      organizer: "Bengaluru Football League Trust",
      prizePool: "₹80,000 + Rolling Trophy",
      registrationFee: "₹1,200 / Team",
      maxParticipants: "24 College Teams",
      contactInfo: "+91 97400 32109 (Prof. Anand)",
      description: "7v7 Knockout & League tournament for university students. FIFA standard turf and certified AIFF referees.",
      bannerImage: "/football_default.jpg",
      status: "OPEN",
      registeredCount: 18,
    },
  ]);

  useEffect(() => {
    const fetchDBCompetitions = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/competitions/upcoming?limit=50");
        if (res.ok) {
          const dbData = await res.json();
          if (Array.isArray(dbData) && dbData.length > 0) {
            const formatted = dbData.map((c) => {
              if (!c) return null;
              return {
                id: c.id || Date.now(),
                title: c.title || "Sports Competition",
                sport: c.sport || "Cricket",
                sportIcon: "🏆",
                date: c.start_date ? new Date(c.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "March 23, 2026",
                level: c.level || "State Level",
                description: c.description || "",
                location: c.location || "India",
                prizePool: c.prize_pool || "₹50,000",
                registrationFee: c.registration_fee || "₹500 / Entry",
                maxParticipants: c.max_participants || "Open Entry",
                organizer: c.organizer || "Playure Sports League",
                contactInfo: c.contact_info || "",
                bannerImage: c.banner_image,
                status: "OPEN",
                registeredCount: 12,
              };
            }).filter(Boolean);

            setCompetitions((prev) => {
              const existingIds = new Set((prev || []).map(p => p?.id));
              const newItems = formatted.filter(f => f && !existingIds.has(f.id));
              return [...newItems, ...prev];
            });
          }
        }
      } catch (e) {
        console.warn("DB competitions fetch notice:", e);
      }
    };
    fetchDBCompetitions();
  }, []);

  const handleAddCompetition = (newComp) => {
    setCompetitions([newComp, ...competitions]);
  };

  const handleRegister = (compId, compTitle) => {
    if (registeredComps.includes(compId)) {
      setRegisteredComps(registeredComps.filter(id => id !== compId));
    } else {
      setRegisteredComps([...registeredComps, compId]);
      alert(`🎉 Registration Successful for "${compTitle}"!`);
    }
  };

  const filteredCompetitions = competitions.filter((comp) => {
    if (!comp) return false;
    if (selectedSport !== "All Sports" && comp.sport !== selectedSport) return false;
    if (selectedLevel !== "All Levels" && comp.level !== selectedLevel) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (comp.title && comp.title.toLowerCase().includes(q)) ||
        (comp.location && comp.location.toLowerCase().includes(q)) ||
        (comp.sport && comp.sport.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="w-full space-y-6">

      {/* 1. Hero Header Banner matching Kinetic Grid design system */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#161B22]/60 backdrop-blur-xl border border-white/10 min-h-[300px] flex items-center shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#161B22] via-[#161B22]/80 to-transparent z-10"></div>

        {/* Left Text Content */}
        <div className="relative z-20 p-8 sm:p-10 max-w-2xl flex flex-col justify-center space-y-4">
          {/* Heading */}
          <h1 className="font-['Hanken_Grotesk','Outfit',sans-serif] text-3xl sm:text-[44px] font-extrabold text-white tracking-tight leading-[1.1]">
            Discover India's Biggest <span className="text-[#00f0ff]">Sports Competitions</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#b9cacb] font-normal leading-relaxed max-w-xl font-['Inter']">
            Explore and host tournaments across India. Connect with top athletic talent and elevate your game.
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] font-['Hanken_Grotesk'] text-sm sm:text-base font-bold px-8 py-3 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] inline-flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Host / Add Tournament</span>
            </button>
          </div>
        </div>

        {/* Right Athlete Image */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-2/3 h-full overflow-hidden flex items-center justify-end pointer-events-none z-0">
          <img
            src="/competition-hero-bg.jpg"
            alt="Sports Trophy"
            className="w-full h-full object-cover object-right opacity-80"
          />
        </div>
      </div>

      {/* 2. Filter Bar (Glass Panel with Custom Selects) */}
      <div className="bg-[#161B22]/60 backdrop-blur-xl border border-white/10 p-4 rounded-xl space-y-5">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#b9cacb] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tournaments, players, clubs..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#333539] border border-white/10 rounded-full text-xs text-white placeholder-[#b9cacb] focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all font-['Inter']"
            style={{ paddingLeft: "2.75rem" }}
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {/* Sport Filter */}
          <div className="flex items-center bg-[#1e2024] border border-white/10 rounded-lg px-3 py-2 hover:border-[#00f0ff]/50 transition-colors">
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full bg-transparent border-none text-xs sm:text-sm text-[#e2e2e8] focus:ring-0 p-0 cursor-pointer font-['Inter']"
            >
              <option value="All Sports" className="bg-[#1e2024]">All Sports</option>
              <option value="Badminton" className="bg-[#1e2024]">Badminton</option>
              <option value="Cricket" className="bg-[#1e2024]">Cricket</option>
              <option value="Football" className="bg-[#1e2024]">Football</option>
              <option value="Kabaddi" className="bg-[#1e2024]">Kabaddi</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="flex items-center bg-[#1e2024] border border-white/10 rounded-lg px-3 py-2 hover:border-[#00f0ff]/50 transition-colors">
            <select className="w-full bg-transparent border-none text-xs sm:text-sm text-[#e2e2e8] focus:ring-0 p-0 cursor-pointer font-['Inter']">
              <option className="bg-[#1e2024]">All States</option>
              <option className="bg-[#1e2024]">Karnataka</option>
              <option className="bg-[#1e2024]">Maharashtra</option>
              <option className="bg-[#1e2024]">Delhi</option>
            </select>
          </div>

          {/* Level Filter */}
          <div className="flex items-center bg-[#1e2024] border border-white/10 rounded-lg px-3 py-2 hover:border-[#00f0ff]/50 transition-colors">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-transparent border-none text-xs sm:text-sm text-[#e2e2e8] focus:ring-0 p-0 cursor-pointer font-['Inter']"
            >
              {LOCAL_COMPETITION_LEVELS.map(lvl => (
                <option key={lvl} value={lvl} className="bg-[#1e2024]">{lvl}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center bg-[#1e2024] border border-white/10 rounded-lg px-3 py-2 hover:border-[#00f0ff]/50 transition-colors">
            <select className="w-full bg-transparent border-none text-xs sm:text-sm text-[#e2e2e8] focus:ring-0 p-0 cursor-pointer font-['Inter']">
              <option className="bg-[#1e2024]">All Dates</option>
              <option className="bg-[#1e2024]">This Weekend</option>
              <option className="bg-[#1e2024]">Next Month</option>
            </select>
          </div>

          {/* Prize Money Filter */}
          <div className="flex items-center bg-[#1e2024] border border-white/10 rounded-lg px-3 py-2 hover:border-[#00f0ff]/50 transition-colors">
            <select className="w-full bg-transparent border-none text-xs sm:text-sm text-[#e2e2e8] focus:ring-0 p-0 cursor-pointer font-['Inter']">
              <option className="bg-[#1e2024]">Prize Money</option>
              <option className="bg-[#1e2024]">High to Low</option>
            </select>
          </div>
        </div>

      </div>

      {/* 3. Active Competitions Grid */}
      <div className="space-y-4 py-10 px">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-['Hanken_Grotesk']">
            Active Competitions
          </h2>
          <button
            onClick={() => alert("Viewing all active competitions!")}
            className="text-sm font-medium text-[#00f0ff] hover:text-[#7df4ff] transition-colors"
          >
            View All
          </button>
        </div>

        {/* Competitions 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-10">
          {filteredCompetitions.map((comp) => {
            return (
              <div
                key={comp.id}
                className="bg-[#161B22]/60 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-[#00f0ff]/40 transition-all duration-300"
              >
                {/* Banner Image with OPEN Badge */}
                <div className="relative h-48 bg-gray-900 overflow-hidden">
                  <img
                    src={getCompBanner(comp)}
                    alt={comp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-3 left-3 bg-[#00f0ff] text-[#002022] text-xs font-bold px-2 py-1 rounded shadow-md font-['Hanken_Grotesk']">
                    OPEN
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent opacity-90" />
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <h3
                    onClick={() => setActiveDetailComp(comp)}
                    className="text-base font-bold text-white hover:text-[#00f0ff] cursor-pointer font-['Hanken_Grotesk'] leading-snug truncate"
                  >
                    {comp.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-[#b9cacb]">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#b9cacb] shrink-0" />
                      <span>{comp.location}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#b9cacb] shrink-0" />
                      <span>{comp.date}</span>
                    </div>
                  </div>

                  {/* Prize Pool & Entry Fee Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Left: Prize Pool */}
                    <div className="bg-[#333539]/50 p-2.5 rounded-lg border border-white/5 flex flex-col justify-center">
                      <span className="text-[11px] text-[#b9cacb] uppercase tracking-wider block mb-0.5">
                        Prize Pool
                      </span>
                      <span className="font-['JetBrains_Mono',monospace] text-sm font-bold text-[#00f0ff] truncate">
                        {comp.prizePool}
                      </span>
                    </div>

                    {/* Right: Entry Fee */}
                    <div className="bg-[#333539]/50 p-2.5 rounded-lg border border-white/5 flex flex-col justify-center">
                      <span className="text-[11px] text-[#b9cacb] uppercase tracking-wider block mb-0.5">
                        Entry Fee
                      </span>
                      <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-[#e2e2e8] truncate">
                        {comp.registrationFee}
                      </span>
                    </div>
                  </div>

                  {/* Bottom View Details Link */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setActiveDetailComp(comp)}
                      className="text-sm font-medium text-[#00f0ff] hover:text-[#7df4ff] inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 4. Competition Details Modal */}
      <AnimatePresence>
        {activeDetailComp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-[#111A2E] border border-[#1B263C] rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl relative my-8"
            >
              <div className="relative h-48 bg-gray-900">
                <img src={getCompBanner(activeDetailComp)} alt={activeDetailComp.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111A2E] via-black/40 to-transparent" />

                <button
                  onClick={() => setActiveDetailComp(null)}
                  className="absolute top-4 right-4 p-1.5 bg-black/60 text-white rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-4 left-5 right-5">
                  <h2 className="text-lg font-bold text-white font-['Outfit']">{activeDetailComp.title}</h2>
                </div>
              </div>

              <div className="p-5 space-y-4 text-xs text-gray-300">
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#18243A] rounded-xl border border-[#233352]">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">Prize Pool</span>
                    <span className="text-xs font-bold text-white mt-0.5">{activeDetailComp.prizePool}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">Entry Fee</span>
                    <span className="text-xs font-bold text-white mt-0.5">{activeDetailComp.registrationFee}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p><strong>Date:</strong> {activeDetailComp.date}</p>
                  <p><strong>Location:</strong> {activeDetailComp.location}</p>
                  <p><strong>Organizer:</strong> {activeDetailComp.organizer}</p>
                  {activeDetailComp.description && <p className="mt-2 text-gray-400">{activeDetailComp.description}</p>}
                </div>

                <div className="pt-3 border-t border-[#1B263C] flex gap-3">
                  <button
                    onClick={() => {
                      handleRegister(activeDetailComp.id, activeDetailComp.title);
                      setActiveDetailComp(null);
                    }}
                    className="w-full py-2.5 bg-[#007AFF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase cursor-pointer transition-all"
                  >
                    {registeredComps.includes(activeDetailComp.id) ? "Registered ✓" : "Register Now"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Add Competition Modal Component */}
      <AddCompetitionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCompetition={handleAddCompetition}
      />

    </div>
  );
}
