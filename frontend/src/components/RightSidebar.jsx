import { MapPin, Bot } from "lucide-react";

export default function RightSidebar({ onOpenChatbot, onNavigateCompetitions }) {
  const upcomingEvents = [
    {
      title: "All-India Badminton Masters 2026",
      sport: "Badminton",
      location: "Bengaluru, KA",
      countdown: "in 3 days",
    },
    {
      title: "Mumbai Open Football 7v7 League",
      sport: "Football",
      location: "Mumbai, MH",
      countdown: "in 7 days",
    },
    {
      title: "Delhi State Kabaddi Championship",
      sport: "Kabaddi",
      location: "Delhi, DL",
      countdown: "in 12 days",
    },
  ];

  return (
    <aside className="w-full space-y-6">
      {/* 1. Upcoming Events Card */}
      <div className="bg-[#161B22]/60 border border-white/10 rounded-xl p-5 shadow-2xl backdrop-blur-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3 mb-4 font-['Hanken_Grotesk','Inter']">
          UPCOMING EVENTS
        </h3>

        <div className="space-y-4 divide-y divide-white/10">
          {upcomingEvents.map((ev, idx) => (
            <div key={idx} className={`${idx !== 0 ? "pt-3.5" : ""} space-y-1`}>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#b9cacb]">{ev.sport}</span>
                <span className="text-[#00f0ff] font-semibold">{ev.countdown}</span>
              </div>
              
              <h4 
                onClick={onNavigateCompetitions}
                className="text-sm font-semibold text-white hover:text-[#00f0ff] cursor-pointer font-['Hanken_Grotesk','Inter'] leading-snug truncate"
              >
                {ev.title}
              </h4>

              <p className="text-xs text-[#b9cacb] flex items-center gap-1 font-normal">
                <MapPin className="w-3.5 h-3.5 text-[#b9cacb] shrink-0" />
                <span>{ev.location}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Playure AI Coach Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#006970]/30 to-[#1e2024] border border-[#00f0ff]/30 rounded-xl p-6 shadow-2xl text-center space-y-4">
        <div className="relative z-10 w-full flex flex-col items-center">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center justify-center gap-2 font-['Hanken_Grotesk']">
            <Bot className="w-5 h-5 text-[#00f0ff]" />
            <span>PLAYURE AI COACH</span>
          </h3>

          <button
            onClick={onOpenChatbot}
            className="w-full bg-transparent border border-[#00f0ff] text-[#00f0ff] font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg hover:bg-[#00f0ff] hover:text-[#002022] transition-colors cursor-pointer font-['Hanken_Grotesk']"
          >
            OPEN AI COACH
          </button>
        </div>
      </div>
    </aside>
  );
}


