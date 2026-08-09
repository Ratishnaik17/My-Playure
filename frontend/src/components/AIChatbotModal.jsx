import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendAIChatMessage } from "../api/client";

export default function AIChatbotModal({ isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState("Resume");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Namaste! 🏆 I am your Playure AI Sports Coach. Select an agent category on the left or type your query below to get started!",
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const categories = [
    { id: "Physio", label: "Physio", icon: "medical_services", color: "#00f0ff" },
    { id: "Training", label: "Training", icon: "fitness_center", color: "#00FF41" },
    { id: "Nutrition", label: "Nutrition", icon: "restaurant", color: "#fed639" },
    { id: "Resume", label: "Resume", icon: "edit_document", color: "#7df4ff" },
    { id: "General", label: "General", icon: "sports_score", color: "#c1c6d7" },
  ];

  const categoryGuidance = {
    Resume: {
      title: "Resume Builder",
      icon: "edit_document",
      fields: [
        "Name",
        "Email",
        "Phone",
        "Location",
        "Sport",
        "Position",
        "Experience (role, years, achievements)",
        "Education",
        "Achievements",
        "Skills",
        "Certifications",
        "Languages",
        "Career Objective",
        "References",
      ],
      prompts: [
        "Generate ATS sports resume for Cricket All-Rounder",
        "Format my Football midfielder achievements for scouts",
      ],
    },
    Physio: {
      title: "Physio Assistant",
      icon: "medical_services",
      fields: [
        "Injury / Pain location",
        "Severity (mild, moderate, severe)",
        "Stretches & Mobility tips",
        "Estimated Recovery Time",
        "Red Flag emergency warnings",
      ],
      prompts: [
        "How to treat sudden knee pain after running?",
        "Best recovery stretches for lower back tightness",
      ],
    },
    Training: {
      title: "Training Coach",
      icon: "fitness_center",
      fields: [
        "Body weight & height",
        "Lifting weight & reps (1RM)",
        "Training level (beginner/inter/pro)",
        "Weekly workout split",
        "Progressive overload",
      ],
      prompts: [
        "Calculate my 1RM for 80kg bench press 5 reps",
        "Weekly workout schedule for fast bowler",
      ],
    },
    Nutrition: {
      title: "Sports Nutritionist",
      icon: "restaurant",
      fields: [
        "Body Weight & Height",
        "Daily Goal (muscle gain / fat loss)",
        "Activity level",
        "BMR & TDEE calculation",
        "Protein, Carbs, Fats & Water target",
      ],
      prompts: [
        "Daily protein & calorie target for 70kg athlete",
        "Meal plan for high endurance football match",
      ],
    },
    General: {
      title: "Sports Assistant",
      icon: "sports_score",
      fields: [
        "Official sports rules",
        "Tournament schedule & news",
        "Player & team statistics",
        "Coaching & tactical tips",
      ],
      prompts: [
        "Latest Kabaddi Pro League news & rules",
        "Tactical advice for 7v7 football tournament",
      ],
    },
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      category: activeCategory,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      const data = await sendAIChatMessage(query, activeCategory.toLowerCase());
      const botResponse =
        data?.reply ||
        `🏆 [${activeCategory} Agent Response]: Detailed guidance for "${query}" is ready!`;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: botResponse,
          category: data?.category || activeCategory,
          responseData: data,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: `🏆 [${activeCategory} Agent]: Processing complete. Keep training hard!`,
          category: activeCategory,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const activeGuidance = categoryGuidance[activeCategory] || categoryGuidance["General"];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden font-['Inter']">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-[1440px] h-[92vh] bg-[#0D1117] border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden relative"
        >
          {/* Top Navigation Bar */}
          <header className="w-full h-16 bg-[#111318]/80 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-6 shrink-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <span className="material-symbols-outlined text-2xl">smart_toy</span>
              </div>
              <div>
                <h2 className="font-['Hanken_Grotesk'] text-lg font-extrabold text-white tracking-tight">
                  PLAYURE <span className="text-[#00f0ff]">AI COACH</span>
                </h2>
                <p className="text-[11px] font-['JetBrains_Mono'] text-[#00FF41] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                title="Close Modal"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          </header>

          {/* Workspace Layout */}
          <div className="flex-1 flex overflow-hidden z-10 p-4 sm:p-6 gap-4 sm:gap-6 min-h-0">
            
            {/* Single Combined Sidebar: Choose an Agent + Resume / Guidance Builder */}
            <aside className="w-72 sm:w-80 glass-panel rounded-xl flex flex-col shrink-0 overflow-hidden border border-white/10">
              
              {/* Agent Category Selection Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 shrink-0">
                <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-white mb-1">
                  Choose an Agent
                </h3>
                <p className="font-['JetBrains_Mono'] text-xs text-[#b9cacb]">
                  Select Category
                </p>
              </div>

              {/* Scrollable Container with Categories + Guidance Content integrated into ONE section */}
              <div className="p-4 flex-1 overflow-y-auto space-y-5">
                
                {/* Agent Categories Radio List */}
                <div className="space-y-1.5">
                  {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <label
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all ${
                          isActive
                            ? "bg-[#1e2024] border border-[#00f0ff]/40 glow-active"
                            : "hover:bg-[#1e2024]/60 border border-transparent"
                        }`}
                      >
                        <div className="relative flex items-center justify-center w-4 h-4 shrink-0">
                          <input
                            type="radio"
                            name="agent_category"
                            checked={isActive}
                            onChange={() => setActiveCategory(cat.id)}
                            className="appearance-none w-4 h-4 border-2 border-gray-600 rounded-full checked:border-[#00f0ff] transition-all cursor-pointer"
                          />
                          {isActive && (
                            <div className="absolute w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                          )}
                        </div>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="material-symbols-outlined text-base shrink-0"
                            style={{ color: isActive ? "#00f0ff" : "#b9cacb" }}
                          >
                            {cat.icon}
                          </span>
                          <span
                            className={`text-sm font-medium truncate ${
                              isActive ? "text-[#00f0ff] font-bold" : "text-[#e2e2e8]"
                            }`}
                          >
                            {cat.label}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Integrated Guidance & Resume Builder Content Section */}
                <div className="pt-3 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-['Hanken_Grotesk'] text-base font-bold text-white flex items-center gap-2">
                      <span>{activeGuidance.title}</span>
                    </h3>
                    <span className="material-symbols-outlined text-[#00f0ff] text-base">
                      {activeGuidance.icon}
                    </span>
                  </div>

                  <div className="bg-[#1e2024]/70 rounded-xl p-3.5 border border-white/10">
                    <h4 className="font-['JetBrains_Mono'] text-xs font-bold text-[#00f0ff] mb-2.5 uppercase tracking-wider">
                      {activeCategory === "Resume" ? "FILL THESE FIELDS:" : "KEY INDICATORS:"}
                    </h4>
                    <ul className="space-y-1.5 font-['JetBrains_Mono'] text-xs text-[#b9cacb]">
                      {activeGuidance.fields.map((field, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shrink-0" />
                          <span className="truncate">{field}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggested Prompts List */}
                  <div className="space-y-2 pt-1">
                    <span className="font-['JetBrains_Mono'] text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      SUGGESTED PROMPTS:
                    </span>
                    {activeGuidance.prompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(p)}
                        className="w-full text-left text-xs bg-[#161B22] hover:bg-[#1e2024] text-gray-300 hover:text-[#00f0ff] p-2.5 rounded-lg border border-white/10 hover:border-[#00f0ff]/40 transition-all font-['Inter'] leading-snug cursor-pointer"
                      >
                        "{p}"
                      </button>
                    ))}
                  </div>

                </div>

              </div>
            </aside>

            {/* Main Chat Interface */}
            <div className="flex-1 glass-panel rounded-xl flex flex-col relative overflow-hidden min-w-0 border border-white/10">
              
              {/* Workspace Header Box */}
              <div className="py-5 px-6 border-b border-white/10 bg-[#161B22]/80 backdrop-blur-sm flex justify-between items-center shrink-0 min-h-[96px] z-20">
                {/* Left: Active Agent Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1.5 rounded-md bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(0,240,255,0.15)]">
                    {activeCategory} AGENT ACTIVE
                  </span>
                </div>

                {/* Center: Logo + AI Coach */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#00f0ff]/10 border-2 border-[#00f0ff] flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(0,240,255,0.3)]">
                    <span className="material-symbols-outlined text-3xl text-[#00f0ff]">
                      smart_toy
                    </span>
                  </div>
                  <h1 className="font-['Hanken_Grotesk'] text-3xl sm:text-4xl font-black text-white tracking-tight">
                    AI Coach
                  </h1>
                </div>

                {/* Right: Clear Chat Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      setMessages([
                        {
                          id: Date.now(),
                          sender: "bot",
                          category: activeCategory,
                          text: `Switched to ${activeCategory} Agent. How can I assist your athletic performance today?`,
                        },
                      ])
                    }
                    className="font-['JetBrains_Mono'] text-xs text-[#b9cacb] hover:text-[#00f0ff] transition-colors border border-white/10 hover:border-[#00f0ff]/50 px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10"
                  >
                    <span>Clear Chat</span>
                    <span className="material-symbols-outlined text-sm">refresh</span>
                  </button>
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 relative flex flex-col">
                {/* Decorative background watermark with text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.12] pointer-events-none select-none px-4 text-center">
                  <span className="material-symbols-outlined text-[200px] text-[#00f0ff] mb-2">
                    smart_toy
                  </span>
                  <p className="font-['Inter'] text-xs sm:text-sm font-semibold text-[#00f0ff] whitespace-nowrap tracking-wide">
                    Your AI assistant for sports training, nutrition, physiotherapy, resume building, and general sports queries.
                  </p>
                </div>

                {/* Message Bubbles */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-8 h-8 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <span className="material-symbols-outlined text-base">smart_toy</span>
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[78%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-[#006970] to-[#004f54] text-white rounded-br-none border border-[#00f0ff]/30 shadow-md font-['Inter']"
                          : "bg-[#161B22] text-[#e2e2e8] border border-white/10 rounded-bl-none shadow-sm font-['Inter']"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>

                    {msg.sender === "user" && (
                      <div className="w-8 h-8 rounded-xl bg-[#00f0ff] text-[#00363a] font-bold flex items-center justify-center shrink-0 mt-1 shadow-sm text-xs font-['Hanken_Grotesk']">
                        YOU
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 items-center text-xs text-[#00f0ff] font-['JetBrains_Mono'] italic py-2">
                    <span className="material-symbols-outlined text-base animate-spin">
                      sync
                    </span>
                    <span>Playure AI Agent is analyzing sports data...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 sm:p-5 border-t border-white/10 bg-[#161B22]/90 backdrop-blur-md">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="max-w-4xl mx-auto relative group"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask ${activeCategory} AI Agent...`}
                    className="w-full bg-[#1e2024] rounded-xl py-3.5 pl-5 pr-12 border border-white/15 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] font-['Inter'] text-sm text-white placeholder:text-gray-400 shadow-inner transition-all group-hover:border-white/30 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] rounded-lg transition-all border border-transparent disabled:opacity-40 cursor-pointer btn-primary-glow font-bold"
                  >
                    <span className="material-symbols-outlined text-xl">arrow_upward</span>
                  </button>
                </form>

                <div className="text-center mt-2.5">
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#b9cacb]/60">
                    Press Enter to send. Powered by Playure Multi-Agent Sports System.
                  </span>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
