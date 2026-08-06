import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Calendar, MapPin, Award, DollarSign, Users, Phone, FileText, Image as ImageIcon, Sparkles, Layers } from "lucide-react";
import { SPORTS_CATEGORIES } from "./SportsCategoriesBar";

export const COMPETITION_LEVELS = [
  "District Level",
  "State Level",
  "National Level",
  "International Level",
  "College / University",
  "School Level",
  "Club Level",
  "Open Tournament",
];

export const DEFAULT_SPORT_BANNERS = {
  Cricket: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80",
  Football: "/football_default.jpg",
  Badminton: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
  Kabaddi: "/kabaddi_default.png",
  Hockey: "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&auto=format&fit=crop&q=80",
  "Field Hockey": "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&auto=format&fit=crop&q=80",
  Tennis: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80",
  Basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80",
  Athletics: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80",
  Weightlifting: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
  Volleyball: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80",
  Swimming: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80",
  Cycling: "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80",
  Chess: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop&q=80",
  Boxing: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80",
  "Table Tennis": "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&auto=format&fit=crop&q=80",
  Wrestling: "/kabaddi_default.png",
  "Kho Kho": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
  Judo: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
  Archery: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=80",
  Shooting: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=80",
  Golf: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&auto=format&fit=crop&q=80",
  Gymnastics: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
  Karate: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
  Taekwondo: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
};

export default function AddCompetitionModal({ isOpen, onClose, onAddCompetition }) {
  const [title, setTitle] = useState("");
  const [sport, setSport] = useState("Cricket");
  const [date, setDate] = useState("");
  const [level, setLevel] = useState("State Level");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [registrationFee, setRegistrationFee] = useState("Free Entry");
  const [maxParticipants, setMaxParticipants] = useState("Open Entry");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [bannerImage, setBannerImage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !sport || !date) {
      alert("Please fill in Competition Name, Sport, and Date.");
      return;
    }

    const selectedSportData = SPORTS_CATEGORIES.find(s => s.name === sport);
    const defaultImage = DEFAULT_SPORT_BANNERS[sport] || DEFAULT_SPORT_BANNERS["Cricket"];
    const finalBannerImage = bannerImage.trim() || defaultImage;

    const payload = {
      title: title.trim(),
      sport: sport,
      level: level,
      organizer: organizer.trim() || "Playure Sports League",
      location: location.trim() || "India",
      description: description.trim(),
      start_date: date ? new Date(date).toISOString() : null,
      registration_deadline: registrationDeadline ? new Date(registrationDeadline).toISOString() : null,
      prize_pool: prizePool.trim() || "₹0",
      registration_fee: registrationFee.trim() || "Free Entry",
      max_participants: maxParticipants.trim() || "Open Entry",
      contact_info: contactInfo.trim(),
      status: "Open for Registration",
      banner_image: finalBannerImage,
    };

    try {
      const res = await fetch("http://localhost:8000/api/v1/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedData = await res.json();
        console.log("✅ Competition successfully saved to PostgreSQL:", savedData);
        alert(`🎉 Tournament "${savedData.title}" has been successfully hosted and stored in the PostgreSQL Database!`);
        
        const newComp = {
          id: savedData.id || Date.now(),
          title: savedData.title,
          sport: savedData.sport,
          sportIcon: selectedSportData?.icon || "🏆",
          date: savedData.start_date ? new Date(savedData.start_date).toISOString().split('T')[0] : date,
          registrationDeadline: savedData.registration_deadline ? new Date(savedData.registration_deadline).toISOString().split('T')[0] : registrationDeadline,
          level: savedData.level,
          description: savedData.description,
          location: savedData.location,
          prizePool: savedData.prize_pool,
          registrationFee: savedData.registration_fee,
          maxParticipants: savedData.max_participants,
          organizer: savedData.organizer,
          contactInfo: savedData.contact_info,
          bannerImage: savedData.banner_image,
          status: savedData.status,
          registeredCount: 0,
          timestamp: "Just now",
        };
        onAddCompetition(newComp);
      } else {
        const errorText = await res.text();
        console.error("PostgreSQL DB save error:", res.status, errorText);
        const fallbackComp = {
          id: Date.now(),
          title: title.trim(),
          sport: sport,
          sportIcon: selectedSportData?.icon || "🏆",
          date: date,
          registrationDeadline: registrationDeadline,
          level: level,
          description: description.trim(),
          location: location.trim() || "India",
          prizePool: prizePool.trim() || "₹0",
          registrationFee: registrationFee.trim() || "Free Entry",
          maxParticipants: maxParticipants.trim() || "Open Entry",
          organizer: organizer.trim() || "Playure Sports League",
          contactInfo: contactInfo.trim(),
          bannerImage: finalBannerImage,
          status: "Open for Registration",
          registeredCount: 0,
          timestamp: "Just now",
        };
        onAddCompetition(fallbackComp);
      }
    } catch (err) {
      console.warn("PostgreSQL save notice:", err);
      const fallbackComp = {
        id: Date.now(),
        title: title.trim(),
        sport: sport,
        sportIcon: selectedSportData?.icon || "🏆",
        date: date,
        registrationDeadline: registrationDeadline,
        level: level,
        description: description.trim(),
        location: location.trim() || "India",
        prizePool: prizePool.trim() || "₹0",
        registrationFee: registrationFee.trim() || "Free Entry",
        maxParticipants: maxParticipants.trim() || "Open Entry",
        organizer: organizer.trim() || "Playure Sports League",
        contactInfo: contactInfo.trim(),
        bannerImage: finalBannerImage,
        status: "Open for Registration",
        registeredCount: 0,
        timestamp: "Just now",
      };
      onAddCompetition(fallbackComp);
    }

    // Reset form
    setTitle("");
    setDate("");
    setRegistrationDeadline("");
    setDescription("");
    setLocation("");
    setPrizePool("");
    setRegistrationFee("Free Entry");
    setMaxParticipants("Open Entry");
    setOrganizer("");
    setContactInfo("");
    setBannerImage("");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="bg-[#0A1224] border border-[#192540] rounded-2xl max-w-6xl w-full p-8 sm:p-10 shadow-2xl relative my-6 text-gray-100"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-7">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-[#00f0ff]/10 border border-[#00f0ff]/30 rounded-xl text-[#00f0ff]">
                <Trophy className="w-6 h-6" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white font-['Hanken_Grotesk'] tracking-wider uppercase">
                HOST & ADD NEW COMPETITION
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#b9cacb] hover:text-white rounded-xl hover:bg-[#333539] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Row 1: Competition Name, Sports Name, Level of Competition (3 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Competition Name */}
              <div>
                <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">
                  COMPETITION NAME
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. All-India Inter-State Badminton Masters 2026"
                  className="w-full px-4 py-3 bg-[#333539] border border-white/10 rounded-lg text-sm text-white placeholder-[#b9cacb]/60 font-medium focus:outline-none focus:border-[#00f0ff] transition-colors"
                />
              </div>

              {/* Sports Name */}
              <div>
                <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">
                  SPORTS NAME
                </label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full px-4 py-3 bg-[#333539] border border-white/10 rounded-lg text-sm font-semibold text-white focus:outline-none focus:border-[#00f0ff] cursor-pointer"
                >
                  {SPORTS_CATEGORIES.filter(s => s.name !== "All Sports").map(s => (
                    <option key={s.name} value={s.name} className="bg-[#111318] text-white">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level of Competition */}
              <div>
                <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">
                  LEVEL OF COMPETITION
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-3 bg-[#333539] border border-white/10 rounded-lg text-sm font-semibold text-white focus:outline-none focus:border-[#00f0ff] cursor-pointer"
                >
                  {COMPETITION_LEVELS.map(lvl => (
                    <option key={lvl} value={lvl} className="bg-[#111318] text-white">
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Date of Competition, Registration Deadline, Location/Venue (3 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Date of Competition */}
              <div>
                <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">
                  DATE OF COMPETITION
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#333539] border border-white/10 rounded-lg text-sm font-medium text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              {/* Registration Deadline */}
              <div>
                <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">
                  REGISTRATION DEADLINE
                </label>
                <input
                  type="date"
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="w-full px-4 py-3 bg-[#333539] border border-white/10 rounded-lg text-sm font-medium text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              {/* Location / Venue */}
              <div>
                <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">
                  LOCATION / VENUE
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kanteerava Indoor Stadium, Bengaluru"
                  className="w-full px-4 py-3 bg-[#333539] border border-white/10 rounded-lg text-sm text-white placeholder-[#b9cacb]/60 font-medium focus:outline-none focus:border-[#00f0ff]"
                />
              </div>
            </div>

            {/* Row 3: Description & Guidelines (Full Width) */}
            <div>
              <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">
                DESCRIPTION & GUIDELINES
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe match format, age criteria, rules, schedule, equipment guidelines..."
                className="w-full p-4 bg-[#333539] border border-white/10 rounded-lg text-sm text-white placeholder-[#b9cacb]/60 font-medium focus:outline-none focus:border-[#00f0ff] resize-none leading-relaxed"
              />
            </div>

            {/* Row 4: Prize Pool, Registration Fee, Max Slots (3 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Prize Pool */}
              <div>
                <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">
                  PRIZE POOL
                </label>
                <input
                  type="text"
                  value={prizePool}
                  onChange={(e) => setPrizePool(e.target.value)}
                  placeholder="e.g. ₹1,50,000 + Trophies"
                  className="w-full px-4 py-3 bg-[#333539] border border-white/10 rounded-lg text-sm font-medium text-white placeholder-[#b9cacb]/60 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              {/* Registration Fee */}
              <div>
                <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">
                  REGISTRATION FEE
                </label>
                <input
                  type="text"
                  value={registrationFee}
                  onChange={(e) => setRegistrationFee(e.target.value)}
                  placeholder="Free Entry"
                  className="w-full px-4 py-3 bg-[#333539] border border-white/10 rounded-lg text-sm font-medium text-white placeholder-[#b9cacb]/60 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              {/* Max Slots / Team Size */}
              <div>
                <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">
                  MAX SLOTS / TEAM SIZE
                </label>
                <input
                  type="text"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  placeholder="Open Entry"
                  className="w-full px-4 py-3 bg-[#333539] border border-white/10 rounded-lg text-sm font-medium text-white placeholder-[#b9cacb]/60 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>
            </div>

            {/* Row 5: Organizer Name & Contact (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">
                  ORGANIZER NAME / ACADEMY
                </label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="e.g. Karnataka Sports Association"
                  className="w-full px-4 py-3 bg-[#333539] border border-white/10 rounded-lg text-sm text-white placeholder-[#b9cacb]/60 font-medium focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">
                  ORGANIZER CONTACT / EMAIL
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="e.g. +91 9876543210 or info@karnataka.org"
                  className="w-full px-4 py-3 bg-[#333539] border border-white/10 rounded-lg text-sm text-white placeholder-[#b9cacb]/60 font-medium focus:outline-none focus:border-[#00f0ff]"
                />
              </div>
            </div>

            {/* Row 6: Poster / Banner Image URL (Full Width) */}
            <div>
              <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">
                POSTER / BANNER IMAGE URL (OPTIONAL)
              </label>
              <input
                type="text"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                placeholder="Paste tournament poster image URL (e.g. Unsplash link)..."
                className="w-full px-4 py-3 bg-[#333539] border border-white/10 rounded-lg text-sm text-white placeholder-[#b9cacb]/60 font-medium focus:outline-none focus:border-[#00f0ff]"
              />
            </div>

            {/* Submit Action Bar */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-[#333539] hover:bg-gray-700 text-[#e2e2e8] rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                CANCEL
              </button>

              <button
                type="submit"
                className="px-7 py-3 bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-2.5 cursor-pointer font-['Hanken_Grotesk']"
              >
                <Trophy className="w-5 h-5" />
                <span>PUBLISH COMPETITION</span>
              </button>
            </div>

          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
