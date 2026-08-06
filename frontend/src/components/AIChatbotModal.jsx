import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Bot, User } from "lucide-react";
import { sendAIChatMessage } from "../api/client";


export default function AIChatbotModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Namaste! 🏆 I am your Playure AI Sports Coach. Ask me anything about sports training, tournament rules, diet & recovery, or player scouting!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    "🏏 How to improve Cricket bowling pace?",
    "🏋️ Best recovery routine after heavy training?",
    "🤼 Kabaddi raider footwork techniques?",
    "⚽ How to scout teammates for 7v7 football?",
  ];

  const handleSend = async (textToSend) => {

    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      const data = await sendAIChatMessage(query);
      const botResponse = data?.reply || `🏆 Regarding "${query}": Playure AI recommends balancing targeted skill drills 3x weekly with proper sports nutrition!`;
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "bot", text: botResponse }]);
    } catch (err) {
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "bot", text: `🏆 Regarding "${query}": Playure AI sports assistant active!` }]);
    } finally {
      setIsTyping(false);
    }
  };


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
        <motion.div 
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-[#0B1120] border-l border-gray-800 h-full flex flex-col shadow-2xl"
        >
          
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-[#111827]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-[14px] bg-gradient-to-tr from-amber-500 to-pink-500 text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">Playure AI Sports Coach</h3>
                <p className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online • Instant Guidance
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3.5 rounded-[16px] text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md"
                      : "bg-[#1F2937] text-gray-200 border border-gray-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-amber-400 italic">
                <Bot className="w-4 h-4 animate-spin text-amber-400" />
                <span>Playure AI is analyzing sports data...</span>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className="p-3 border-t border-gray-800 bg-[#111827]/80">
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-2">Suggested Questions:</div>
            <div className="flex flex-wrap gap-1.5">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-[11px] bg-[#1F2937] hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-[10px] border border-gray-800 transition-colors text-left truncate max-w-full"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3.5 border-t border-gray-800 flex items-center gap-2 bg-[#111827]"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI sports coach..."
              className="flex-1 bg-[#1F2937] border border-gray-700 rounded-[14px] px-3.5 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white rounded-[14px] disabled:opacity-50 transition-transform active:scale-95 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
