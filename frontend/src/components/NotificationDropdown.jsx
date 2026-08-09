import { useState, useEffect, useRef } from "react";
import { 
  CheckCheck, 
  Settings, 
  Search, 
  Trash2, 
  X
} from "lucide-react";

export default function NotificationDropdown({ 
  isOpen, 
  onClose, 
  onNavigateAction, 
  onOpenSettings,
  onUnreadCountChange 
}) {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All"); // All, Unread, Competitions, Messages, Social, AI Coach, System
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Fetch notifications on open
  useEffect(() => {
    if (!isOpen) return;

    async function fetchNotifications() {
      try {
        const res = await fetch("http://localhost:8000/api/v1/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          if (onUnreadCountChange) {
            onUnreadCountChange(data.unread_count || 0);
          }
        }
      } catch (err) {
        console.warn("Fetch notifications notice:", err);
      }
    }

    fetchNotifications();
  }, [isOpen]);

  if (!isOpen) return null;

  // Mark single as read
  const handleMarkAsRead = async (id, actionUrl) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/notifications/${id}/read`, {
        method: "PATCH"
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        if (onUnreadCountChange) {
          onUnreadCountChange(data.unread_count || 0);
        }
      }
    } catch (err) {
      console.warn("Mark read notice:", err);
    }

    if (actionUrl && onNavigateAction) {
      onNavigateAction(actionUrl);
      onClose();
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/notifications/read-all", {
        method: "PATCH"
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        if (onUnreadCountChange) {
          onUnreadCountChange(0);
        }
      }
    } catch (err) {
      console.warn("Mark all read notice:", err);
    }
  };

  // Delete notification
  const handleDeleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:8000/api/v1/notifications/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(prev => prev.filter(n => n.id !== id));
        if (onUnreadCountChange) {
          onUnreadCountChange(data.unread_count || 0);
        }
      }
    } catch (err) {
      console.warn("Delete notification notice:", err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.message.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === "Unread") return !n.is_read;
    if (activeFilter === "Competitions") return n.category === "competitions";
    if (activeFilter === "Messages") return n.category === "messages";
    if (activeFilter === "Social") return n.category === "social";
    if (activeFilter === "AI Coach") return n.category === "ai_coach";
    if (activeFilter === "System") return n.category === "system";

    return true;
  });

  const getMaterialIcon = (category) => {
    switch (category) {
      case "competitions":
        return "emoji_events";
      case "messages":
        return "chat";
      case "social":
        return "group";
      case "ai_coach":
        return "smart_toy";
      case "system":
        return "warning";
      default:
        return "notifications";
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-[-60px] sm:right-[-100px] top-[calc(100%+14px)] z-[100] w-[350px] sm:w-[440px] bg-[#161B22]/95 border border-white/10 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col overflow-hidden animate-fadeIn font-['Inter',sans-serif]"
    >
      {/* Header Bar */}
      <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#111318]/70 shrink-0">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#00f0ff] text-[26px]">notifications</span>
          <h2 className="font-['Hanken_Grotesk'] text-lg text-[#e2e2e8] font-bold tracking-tight">Notifications</h2>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleMarkAllRead}
            title="Mark all as read"
            className="flex items-center gap-1.5 text-[#00f0ff] hover:text-[#7df4ff] transition-colors text-xs font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">done_all</span>
            <span>Mark all read</span>
          </button>

          <button 
            onClick={() => { onOpenSettings(); onClose(); }}
            title="Notification Settings"
            className="text-[#b9cacb] hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Chips */}
      <div className="p-4 border-b border-white/10 bg-[#111318]/40">
        <div className="relative mb-3">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cacb] text-lg">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts by keyword..." 
            className="w-full bg-[#1e2024]/50 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-[#e2e2e8] placeholder-[#b9cacb]/50 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/50 transition-all font-['Inter']"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
          {["All", "Unread", "Competitions", "Messages", "Social", "AI Coach", "System"].map(chip => (
            <button
              key={chip}
              onClick={() => setActiveFilter(chip)}
              className={`px-3.5 py-1.5 rounded-full font-['JetBrains_Mono'] text-xs whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === chip 
                  ? "border border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10 font-bold" 
                  : "border border-white/10 text-[#b9cacb] hover:border-white/30 hover:text-white"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Stream Feed Area */}
      <div className="max-h-[400px] overflow-y-auto chat-scroll p-3 space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-[#b9cacb]">
            <span className="material-symbols-outlined text-4xl text-gray-500 mb-2 block">notifications_off</span>
            <p className="text-xs">No notifications found.</p>
            <p className="text-[11px] text-gray-500 mt-0.5">You're all caught up on alerts for this category.</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div 
              key={n.id}
              onClick={() => handleMarkAsRead(n.id, n.action_url)}
              className={`p-3.5 rounded-lg cursor-pointer transition-all duration-150 flex gap-3.5 relative group ${
                !n.is_read 
                  ? "bg-[#282a2e]/50 border border-[#00f0ff]/20 hover:bg-[#282a2e]/70" 
                  : "bg-transparent border border-transparent hover:bg-white/5 opacity-85"
              }`}
            >
              {/* Left Indicator Bar for Unread */}
              {!n.is_read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00f0ff] rounded-l-lg" />
              )}

              {/* Category Avatar / Icon Box */}
              <div className="relative shrink-0 mt-0.5">
                {n.image ? (
                  <img src={n.image} alt="Notification Avatar" className="w-10 h-10 rounded object-cover border border-white/10" />
                ) : (
                  <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${
                    !n.is_read 
                      ? "bg-[#00f0ff]/10 text-[#00f0ff]" 
                      : "bg-[#333539] text-[#c1c6d7]"
                  }`}>
                    <span className="material-symbols-outlined text-xl">
                      {getMaterialIcon(n.category)}
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Message Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-['Hanken_Grotesk'] text-sm font-semibold truncate pr-2 ${!n.is_read ? "text-[#e2e2e8]" : "text-[#b9cacb]"}`}>
                    {n.title}
                  </h3>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#b9cacb]/70 whitespace-nowrap shrink-0">
                    {n.time_ago}
                  </span>
                </div>

                <p className="text-xs text-[#b9cacb] line-clamp-2 leading-relaxed">
                  {n.message}
                </p>

                {/* Optional Action Button for System updates */}
                {n.category === "system" && n.type === "security_alert" && (
                  <button className="mt-2 px-3 py-1 bg-[#333539] hover:bg-[#37393e] text-[#e2e2e8] text-[10px] rounded transition-colors uppercase tracking-wider font-semibold">
                    UPDATE NOW
                  </button>
                )}
              </div>

              {/* Delete Hover Button */}
              <button 
                onClick={(e) => handleDeleteNotification(e, n.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all cursor-pointer rounded shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
