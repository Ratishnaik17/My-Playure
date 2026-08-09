import { useState, useEffect, useRef } from "react";
import { 
  X, 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  FileText, 
  Check, 
  CheckCheck, 
  UserPlus, 
  Phone, 
  Video as VideoIcon, 
  Info,
  Download,
  Trash2,
  Volume2,
  VolumeX
} from "lucide-react";

export default function MessagingModal({ isOpen, onClose, onUnreadCountChange }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(1);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All"); // All, Unread, Coaches
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  
  // Attachments & Emoji Picker state
  const [attachment, setAttachment] = useState(null); // { file, previewUrl, name, type }
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Categories of Unicode emojis for quick selection
  const EMOJI_CATEGORIES = [
    { title: "Sports & Trophies", emojis: ["⚽", "🏀", "🏏", "🥇", "🏆", "🎾", "🏋️‍♂️", "🥊", "🎯", "🤼‍♂️", "🏃‍♂️", "💨"] },
    { title: "Smileys & Gestures", emojis: ["🔥", "👏", "💪", "👍", "🙌", "😊", "😎", "🤩", "🚀", "⚡", "💯", "🎯"] },
    { title: "Symbols & Hearts", emojis: ["❤️", "💙", "💚", "⚡", "🌟", "⭐", "🎉", "🤝", "✅", "📍", "⏰", "💬"] }
  ];

  // Fetch conversations on modal open
  useEffect(() => {
    if (!isOpen) return;

    async function fetchConversations() {
      try {
        const res = await fetch("http://localhost:8000/api/v1/messaging/conversations");
        if (res.ok) {
          const data = await res.json();
          setConversations(data.conversations || []);
          if (onUnreadCountChange) {
            onUnreadCountChange(data.total_unread || 0);
          }
        }
      } catch (err) {
        console.warn("Error fetching conversations:", err);
      }
    }

    fetchConversations();
  }, [isOpen]);

  // Fetch messages when active conversation changes & auto mark as read
  useEffect(() => {
    if (!isOpen || !activeConversationId) return;

    async function fetchMessagesAndMarkRead() {
      try {
        // 1. Fetch messages
        const res = await fetch(`http://localhost:8000/api/v1/messaging/conversations/${activeConversationId}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }

        // 2. Auto mark as read (turns ticks to blue ✓✓)
        const readRes = await fetch(`http://localhost:8000/api/v1/messaging/mark-read/${activeConversationId}`, {
          method: "POST"
        });
        if (readRes.ok) {
          setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, unread_count: 0 } : c));
          if (onUnreadCountChange) {
            onUnreadCountChange(0);
          }
        }
      } catch (err) {
        console.warn("Error fetching messages:", err);
      }
    }

    fetchMessagesAndMarkRead();
  }, [isOpen, activeConversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  if (!isOpen) return null;

  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  // Handle Typing Indicator broadcast & 2s auto-inactivity clear
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);

    if (!isTyping) {
      setIsTyping(true);
      fetch("http://localhost:8000/api/v1/messaging/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: activeConversationId, is_typing: true })
      }).catch(console.warn);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      fetch("http://localhost:8000/api/v1/messaging/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: activeConversationId, is_typing: false })
      }).catch(console.warn);
    }, 2000);
  };

  // Handle File Attachment selection & local preview
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert("File size exceeds maximum 20MB limit.");
      return;
    }

    const fileType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
      ? "video"
      : file.type.includes("pdf")
      ? "pdf"
      : "doc";

    setAttachment({
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      type: fileType,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
    });
  };

  // Play subtle notification audio beep
  const playAudioBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 pitch
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (err) {
      console.warn("Audio Context notice:", err);
    }
  };

  // Handle Message Send
  const handleSendMessage = async () => {
    if (!inputText.trim() && !attachment) return;

    let attachmentPayload = null;

    if (attachment) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", attachment.file);

        const uploadRes = await fetch("http://localhost:8000/api/v1/messaging/upload", {
          method: "POST",
          body: formData
        });

        if (uploadRes.ok) {
          attachmentPayload = await uploadRes.json();
        }
      } catch (err) {
        console.warn("Upload fallback to local preview:", err);
        attachmentPayload = {
          url: attachment.previewUrl,
          type: attachment.type,
          name: attachment.name
        };
      } finally {
        setIsUploading(false);
      }
    }

    const payload = {
      conversation_id: activeConversationId,
      text: inputText.trim(),
      attachment_url: attachmentPayload?.url || null,
      attachment_type: attachmentPayload?.type || null,
      attachment_name: attachmentPayload?.name || null
    };

    // Optimistic UI update
    const newMsg = {
      id: "m-" + Date.now(),
      conversation_id: activeConversationId,
      sender_id: 1,
      sender_name: "Ratish Naik",
      sender_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "delivered",
      attachment: attachmentPayload ? {
        url: attachmentPayload.url,
        type: attachmentPayload.type,
        name: attachmentPayload.name
      } : null
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText("");
    setAttachment(null);
    setShowEmojiPicker(false);
    playAudioBeep();

    // Send to backend API
    try {
      await fetch("http://localhost:8000/api/v1/messaging/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn("Backend send notice:", err);
    }
  };

  // Search users to start new chat
  const handleSearchUsers = async (val) => {
    setUserSearchQuery(val);
    if (!val.trim()) {
      setSearchedUsers([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/v1/messaging/users/search?q=${encodeURIComponent(val)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchedUsers(data.results || []);
      }
    } catch (err) {
      console.warn("User search error:", err);
    }
  };

  // Start new conversation from search result
  const handleStartNewChat = (user) => {
    const existing = conversations.find(c => c.recipient.id === user.id);
    if (existing) {
      setActiveConversationId(existing.id);
    } else {
      const newConv = {
        id: Date.now(),
        recipient: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          online: true,
          last_seen: "Online"
        },
        last_message: "Started new conversation",
        timestamp: "Just now",
        unread_count: 0,
        is_typing: false
      };
      setConversations([newConv, ...conversations]);
      setActiveConversationId(newConv.id);
    }
    setShowNewChatModal(false);
    setUserSearchQuery("");
    setSearchedUsers([]);
  };

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.last_message.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (activeFilter === "Unread") return c.unread_count > 0;
    if (activeFilter === "Coaches") return c.recipient.role.toLowerCase().includes("coach");
    return true;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      
      {/* Modal Shell Container */}
      <div className="w-full max-w-[1360px] h-[92vh] max-h-[880px] bg-[#090F1E] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden relative font-['Inter',sans-serif]">
        
        {/* Top Header Bar */}
        <div className="h-[68px] px-6 bg-[#0D1322]/90 backdrop-blur-lg border-b border-white/10 flex items-center justify-between shrink-0 relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <span className="material-symbols-outlined text-xl">chat</span>
            </div>
            <div>
              <h2 className="font-['Hanken_Grotesk'] font-black text-white text-xl leading-tight flex items-center gap-2">
                <span>
                  <span className="text-white font-black">Play</span>
                  <span className="text-[#00f0ff] font-black">ure</span> Direct Messages
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Toggle Button */}
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute notifications" : "Enable notification sound"}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4.5 h-4.5 text-[#7df4ff]" /> : <VolumeX className="w-4.5 h-4.5 text-gray-500" />}
            </button>

            {/* New Message Button */}
            <button 
              onClick={() => setShowNewChatModal(true)}
              className="px-4 py-2 bg-[#00f0ff] text-[#002022] hover:bg-[#7df4ff] font-bold font-['Hanken_Grotesk'] text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-base">edit_square</span>
              <span>New Message</span>
            </button>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2-Column Split Body View */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* ================= LEFT SIDEBAR: CHAT LIST & SEARCH ================= */}
          <div className="w-full sm:w-[320px] md:w-[380px] bg-[#111318] border-r border-white/10 flex flex-col shrink-0">
            
            {/* Search & Filter Chips */}
            <div className="p-4 border-b border-white/10 shrink-0">
              <div className="relative mb-3">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#849495] text-lg">search</span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..." 
                  className="w-full bg-[#282a2e] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#e2e2e8] placeholder-[#849495] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
                />
              </div>

              {/* Filter Chips */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {["All", "Unread", "Coaches"].map(chip => (
                  <button
                    key={chip}
                    onClick={() => setActiveFilter(chip)}
                    className={`px-3 py-1 rounded-full font-['JetBrains_Mono'] text-xs whitespace-nowrap transition-all cursor-pointer ${
                      activeFilter === chip 
                        ? "bg-[#1e2024] text-[#7df4ff] border border-[#7df4ff]/40 font-bold" 
                        : "bg-[#1e2024] text-[#b9cacb] border border-white/5 hover:border-white/20"
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact List Scroll Area */}
            <div className="flex-1 overflow-y-auto chat-scroll p-2 space-y-1">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12 px-4 text-[#b9cacb]">
                  <p className="text-xs">No conversations found.</p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = conv.id === activeConversationId;
                  const isRecipientOnline = conv.recipient.online;

                  return (
                    <div 
                      key={conv.id}
                      onClick={() => setActiveConversationId(conv.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 relative group ${
                        isActive 
                          ? "bg-[#161B22]/90 border border-white/10 shadow-md" 
                          : "hover:bg-[#1a1c20] border border-transparent"
                      }`}
                    >
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#7df4ff] rounded-r-full shadow-[0_0_8px_#7df4ff]" />
                      )}

                      {/* Avatar with Online Green Dot */}
                      <div className="relative shrink-0">
                        <img 
                          src={conv.recipient.avatar} 
                          alt={conv.recipient.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#111318]"
                        />
                        {isRecipientOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00FF41] rounded-full border-2 border-[#111318] shadow-[0_0_8px_#00FF41]" />
                        )}
                      </div>

                      {/* Info & Last Message Snippet */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className={`font-['Hanken_Grotesk'] text-sm font-bold truncate ${isActive ? "text-white" : "text-[#e2e2e8]"}`}>
                            {conv.recipient.name}
                          </h3>
                          <span className={`text-xs font-['JetBrains_Mono'] shrink-0 ${isActive ? "text-[#7df4ff]" : "text-[#b9cacb]"}`}>
                            {conv.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-[#b9cacb] truncate font-['Inter']">
                          {conv.is_typing ? (
                            <span className="text-[#7df4ff] font-semibold italic animate-pulse">Typing...</span>
                          ) : (
                            conv.last_message
                          )}
                        </p>
                      </div>

                      {/* Unread Badge Counter */}
                      {conv.unread_count > 0 && (
                        <div className="w-5 h-5 bg-[#00f0ff] text-[#002022] rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-md shrink-0">
                          {conv.unread_count}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* ================= RIGHT MAIN CHAT WINDOW ================= */}
          <div className="flex-1 flex flex-col bg-[#111318] relative overflow-hidden">
            
            {/* Ambient Sports Background Pattern */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none" 
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&auto=format&fit=crop&q=80')", 
                backgroundSize: "cover", 
                backgroundPosition: "center",
                mixBlendMode: "overlay" 
              }} 
            />

            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex justify-between items-center w-full px-6 h-20 bg-[#0D1117]/90 backdrop-blur-lg border-b border-white/10 z-10 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={activeConversation.recipient.avatar} 
                        alt={activeConversation.recipient.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                      />
                      {activeConversation.recipient.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00FF41] rounded-full border-2 border-[#0D1117]" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#7df4ff]">
                        {activeConversation.recipient.name}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${activeConversation.recipient.online ? "bg-[#00FF41]" : "bg-gray-500"}`} />
                        <span className="text-xs text-[#b9cacb] font-['Inter']">
                          {activeConversation.recipient.role} • {activeConversation.recipient.online ? "Online" : activeConversation.recipient.last_seen}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Header Call / Video / Info Actions */}
                  <div className="flex items-center gap-3 text-[#b9cacb]">
                    <button className="w-10 h-10 rounded-full bg-[#282a2e] flex items-center justify-center hover:text-[#7df4ff] hover:bg-[#37393e] transition-colors cursor-pointer group">
                      <span className="material-symbols-outlined text-xl group-active:opacity-70">call</span>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-[#282a2e] flex items-center justify-center hover:text-[#7df4ff] hover:bg-[#37393e] transition-colors cursor-pointer group">
                      <span className="material-symbols-outlined text-xl group-active:opacity-70">videocam</span>
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <button className="w-10 h-10 rounded-full bg-[#282a2e] flex items-center justify-center hover:text-[#7df4ff] hover:bg-[#37393e] transition-colors cursor-pointer group">
                      <span className="material-symbols-outlined text-xl group-active:opacity-70">info</span>
                    </button>
                  </div>
                </div>

                {/* Message Feed Area */}
                <div className="flex-1 overflow-y-auto chat-scroll p-6 space-y-6 z-10">
                  
                  {/* Timestamp separator */}
                  <div className="flex justify-center">
                    <span className="px-3 py-1 bg-[#1a1c20] rounded-full text-xs text-[#b9cacb] font-['JetBrains_Mono'] border border-white/5">
                      Today, 09:15 AM
                    </span>
                  </div>

                  {/* Render Messages */}
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === 1;

                    return (
                      <div 
                        key={msg.id}
                        className={`flex gap-3 max-w-[80%] ${isMe ? "ml-auto justify-end" : "mr-auto"}`}
                      >
                        {/* Avatar for received messages */}
                        {!isMe && (
                          <img 
                            src={msg.sender_avatar} 
                            alt={msg.sender_name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 mt-auto border border-white/10" 
                          />
                        )}

                        <div className={isMe ? "text-right" : ""}>
                          <div 
                            className={`p-4 rounded-2xl shadow-sm relative overflow-hidden backdrop-blur-sm ${
                              isMe 
                                ? "bg-[#7df4ff] text-[#002022] rounded-br-sm shadow-[0_4px_20px_rgba(0,240,255,0.15)] font-medium" 
                                : "bg-[#282a2e] text-[#e2e2e8] rounded-bl-sm border border-white/5"
                            }`}
                          >
                            {/* Gloss effect for sent messages */}
                            {isMe && (
                              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-50 pointer-events-none" />
                            )}

                            {/* Message Text */}
                            {msg.text && (
                              <p className="font-['Inter'] text-sm leading-relaxed relative z-10 whitespace-pre-wrap">
                                {msg.text}
                              </p>
                            )}

                            {/* Attachment Preview Renderer */}
                            {msg.attachment && (
                              <div className="mt-2 pt-2 border-t border-black/10">
                                {msg.attachment.type === "image" ? (
                                  <div className="rounded-xl overflow-hidden border border-white/10 max-w-[280px]">
                                    <img 
                                      src={msg.attachment.url} 
                                      alt={msg.attachment.name} 
                                      className="w-full h-auto object-cover max-h-[220px]"
                                    />
                                  </div>
                                ) : (
                                  <a 
                                    href={msg.attachment.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2.5 p-2.5 bg-black/20 border border-white/10 rounded-xl hover:bg-black/30 transition-colors text-xs text-current"
                                  >
                                    <FileText className="w-5 h-5 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold truncate text-xs">{msg.attachment.name}</p>
                                      <span className="text-[10px] uppercase opacity-80">{msg.attachment.type}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-base shrink-0">download</span>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Timestamp & Done All Status Checkmarks */}
                          <div className={`flex items-center gap-1.5 mt-1 text-[10px] font-['JetBrains_Mono'] ${isMe ? "justify-end mr-1 text-[#b9cacb]" : "ml-1 text-[#b9cacb]"}`}>
                            <span>{msg.timestamp}</span>
                            {isMe && (
                              <span className="material-symbols-outlined text-[14px] text-[#00f0ff]">
                                done_all
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {activeConversation.is_typing && (
                    <div className="flex items-center gap-2 text-xs text-[#7df4ff] font-['Inter'] italic py-1">
                      <span className="w-2 h-2 rounded-full bg-[#7df4ff] animate-ping" />
                      <span>{activeConversation.recipient.name} is typing...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Attachment Preview Bar before sending */}
                {attachment && (
                  <div className="px-6 py-3 bg-[#0D1117] border-t border-white/10 flex items-center justify-between shrink-0 z-10">
                    <div className="flex items-center gap-3 min-w-0">
                      {attachment.type === "image" ? (
                        <img src={attachment.previewUrl} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-[#00f0ff]/50" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{attachment.name}</p>
                        <p className="text-[10px] text-gray-400">{attachment.size}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setAttachment(null)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Emoji Picker Popover */}
                {showEmojiPicker && (
                  <div className="absolute bottom-20 left-6 z-30 w-72 bg-[#1a1c20] border border-white/10 rounded-2xl p-3 shadow-2xl backdrop-blur-xl animate-fadeIn">
                    <div className="flex justify-between items-center pb-2 mb-2 border-b border-white/10">
                      <span className="text-xs font-bold text-white font-['Hanken_Grotesk']">Select Emoji</span>
                      <button onClick={() => setShowEmojiPicker(false)} className="text-gray-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {EMOJI_CATEGORIES.map((cat, idx) => (
                        <div key={idx}>
                          <span className="text-[10px] font-bold text-[#b9cacb] font-['JetBrains_Mono'] uppercase tracking-wider block mb-1">
                            {cat.title}
                          </span>
                          <div className="grid grid-cols-6 gap-1">
                            {cat.emojis.map((e, eIdx) => (
                              <button 
                                key={eIdx}
                                onClick={() => setInputText(prev => prev + e)}
                                className="text-lg p-1.5 hover:bg-white/10 rounded-lg transition-transform hover:scale-125 cursor-pointer text-center"
                              >
                                {e}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Input Area */}
                <div className="p-4 bg-[#0D1117]/90 backdrop-blur-xl border-t border-white/10 z-10 shrink-0">
                  <div className="max-w-4xl mx-auto flex items-end gap-3 bg-[#0c0e12] border border-white/10 rounded-2xl p-2 shadow-inner focus-within:border-[#7df4ff]/50 transition-colors">
                    
                    {/* Attachment trigger */}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-[#b9cacb] hover:text-[#7df4ff] transition-colors shrink-0 mb-1 cursor-pointer"
                      title="Attach file (Images, PDF, Video, Word up to 20MB)"
                    >
                      <span className="material-symbols-outlined text-xl">attach_file</span>
                    </button>

                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileSelect} 
                      className="hidden" 
                      accept="image/*,video/*,application/pdf,.doc,.docx"
                    />

                    {/* Textarea Input */}
                    <div className="flex-1 min-h-[44px] flex items-center mb-1">
                      <textarea 
                        value={inputText}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..." 
                        rows={1}
                        className="w-full bg-transparent border-none focus:ring-0 text-[#e2e2e8] font-['Inter'] text-sm resize-none placeholder:text-[#849495] max-h-32 overflow-y-auto chat-scroll py-2 focus:outline-none"
                      />
                    </div>

                    {/* Emoji trigger */}
                    <button 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-[#b9cacb] hover:text-[#7df4ff] transition-colors shrink-0 mb-1 cursor-pointer"
                      title="Add Emoji"
                    >
                      <span className="material-symbols-outlined text-xl">sentiment_satisfied</span>
                    </button>

                    {/* Send Button */}
                    <button 
                      onClick={handleSendMessage}
                      disabled={isUploading}
                      className="w-12 h-12 bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-[0_0_10px_rgba(0,240,255,0.2)] cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-xl font-bold">send</span>
                    </button>
                  </div>
                </div>

              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#b9cacb]">
                <span className="material-symbols-outlined text-5xl text-[#00f0ff] mb-3">chat_bubble_outline</span>
                <h3 className="text-base font-bold text-white font-['Hanken_Grotesk']">Select a conversation</h3>
                <p className="text-xs text-[#b9cacb] max-w-xs mt-1">Choose a player or coach from the list to start chatting in real time.</p>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Start New Chat Modal Popover */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#161B22] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
              <h3 className="font-['Hanken_Grotesk'] text-base font-bold text-white">Start New Conversation</h3>
              <button onClick={() => setShowNewChatModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative mb-4">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#849495]">search</span>
              <input 
                type="text" 
                value={userSearchQuery}
                onChange={(e) => handleSearchUsers(e.target.value)}
                placeholder="Type player name or sport (e.g. Neeraj, Badminton)..." 
                className="w-full pl-10 pr-4 py-2.5 bg-[#0c0e12] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#7df4ff]"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto chat-scroll">
              {searchedUsers.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Search players to start a direct message.</p>
              ) : (
                searchedUsers.map(user => (
                  <div 
                    key={user.id}
                    onClick={() => handleStartNewChat(user)}
                    className="p-3 bg-[#1e2024] hover:bg-[#00f0ff]/10 hover:border-[#00f0ff]/40 border border-white/5 rounded-xl cursor-pointer flex items-center gap-3 transition-all"
                  >
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                    <div>
                      <h4 className="text-xs font-bold text-white font-['Hanken_Grotesk']">{user.name}</h4>
                      <p className="text-[11px] text-[#7df4ff]">{user.role}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
