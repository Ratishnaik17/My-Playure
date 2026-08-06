import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Award, 
  MapPin, 
  Calendar, 
  Send, 
  Globe, 
  Lock, 
  X, 
  ChevronDown,
  Upload 
} from "lucide-react";
import { SPORTS_CATEGORIES } from "./SportsCategoriesBar";

export default function CreatePostCard({ onAddPost }) {
  const [postText, setPostText] = useState("");
  const [selectedSport, setSelectedSport] = useState("Cricket");
  const [postType, setPostType] = useState("General");
  const [visibility, setVisibility] = useState("Public");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef(null);

  const userAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
  const userName = "Ratish Naik";

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      setMediaType(file.type.startsWith("video") ? "video" : "image");
      setIsExpanded(true);
    }
  };

  const triggerFileUpload = (acceptType = "image/*,video/*") => {
    setIsExpanded(true);
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptType;
      fileInputRef.current.click();
    }
  };

  const handlePublish = async (e) => {
    e?.preventDefault();
    if (!postText.trim() && !mediaUrl.trim()) return;

    const selectedSportData = SPORTS_CATEGORIES.find(s => s.name === selectedSport);
    const sportIcon = selectedSportData?.icon || "🏆";

    const payload = {
      content: postText.trim(),
      post_type: postType === "Achievement" ? "achievement" : "normal",
      sport: selectedSport,
      visibility: visibility.toLowerCase(),
      location: "India",
      media: mediaUrl.trim() ? [{ media_type: mediaType, media_url: mediaUrl.trim(), sort_order: 0 }] : []
    };

    try {
      const res = await fetch("http://localhost:8000/api/v1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedPost = await res.json();
        console.log("✅ Post successfully stored in PostgreSQL database:", savedPost);
        const mappedPost = {
          id: savedPost.id,
          authorName: savedPost.user?.full_name || userName,
          authorAvatar: savedPost.user?.profile_image || userAvatar,
          playerRole: savedPost.user?.role || "Athlete / Player",
          sport: savedPost.sport || selectedSport,
          sportIcon: sportIcon,
          club: "Playure Sports Network",
          location: savedPost.location || "India",
          timestamp: "Just now",
          postType: savedPost.post_type || postType,
          visibility: savedPost.visibility || visibility,
          isVerified: true,
          text: savedPost.content,
          imageUrl: savedPost.media?.[0]?.media_url || mediaUrl || null,
          mediaType: mediaType,
          likes: savedPost.likes_count || 0,
          isLiked: savedPost.is_liked_by_me || false,
          commentsCount: savedPost.comments_count || 0,
          comments: [],
          isBookmarked: savedPost.is_saved_by_me || false,
        };
        onAddPost(mappedPost);
      } else {
        throw new Error("Failed to save post to backend DB");
      }
    } catch (err) {
      console.warn("Notice: Storing post locally (backend notice):", err);
      const fallbackPost = {
        id: Date.now(),
        authorName: userName,
        authorAvatar: userAvatar,
        playerRole: "Athlete / Player",
        sport: selectedSport,
        sportIcon: sportIcon,
        club: "Playure Sports Network",
        location: "India",
        timestamp: "Just now",
        postType: postType,
        visibility: visibility,
        isVerified: true,
        text: postText,
        imageUrl: mediaUrl || null,
        mediaType: mediaType,
        likes: 0,
        isLiked: false,
        commentsCount: 0,
        comments: [],
        isBookmarked: false,
      };
      onAddPost(fallbackPost);
    }

    setPostText("");
    setMediaUrl("");
    setIsExpanded(false);
  };

  return (
    <div className="bg-[#161B22]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 mb-6 shadow-2xl relative overflow-hidden transition-all duration-300">
      
      {/* Hidden Device File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {!isExpanded ? (
        /* COLLAPSED INITIAL VIEW: Single Bar */
        <div className="flex items-center gap-4 sm:gap-5">
          {/* User Avatar */}
          <div className="shrink-0">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full border-2 border-[#00f0ff]/60 bg-[#1e2024] flex items-center justify-center overflow-hidden shadow-lg">
              <img
                src={userAvatar}
                alt={userName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Clickable Share Bar */}
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex-1 bg-[#1a212d] hover:bg-[#222c3c] border border-[#00f0ff]/40 hover:border-[#00f0ff] rounded-full px-6 sm:px-7 py-3.5 sm:py-4 text-left text-sm sm:text-base font-semibold text-white font-['Inter'] cursor-pointer transition-all duration-200 flex items-center justify-between group shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_28px_rgba(0,240,255,0.35)]"
          >
            <span className="truncate pr-2 tracking-wide text-gray-100 font-medium">
              Share your training, achievement, competition, or inspire fellow athletes...
            </span>
          </button>

          {/* Quick Action Icons */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => triggerFileUpload("image/*")}
              className="p-2.5 rounded-full hover:bg-white/10 text-[#b9cacb] hover:text-[#00f0ff] transition-all cursor-pointer"
              title="Add Photo"
            >
              <ImageIcon className="w-5 h-5 text-[#00f0ff]" />
            </button>
            <button
              type="button"
              onClick={() => triggerFileUpload("video/*")}
              className="p-2.5 rounded-full hover:bg-white/10 text-[#b9cacb] hover:text-[#00f0ff] transition-all cursor-pointer"
              title="Add Video"
            >
              <VideoIcon className="w-5 h-5 text-[#00f0ff]" />
            </button>
            <button
              type="button"
              onClick={() => { setPostType("Achievement"); setIsExpanded(true); }}
              className="p-2.5 rounded-full hover:bg-white/10 text-[#b9cacb] hover:text-[#FFD700] transition-all cursor-pointer"
              title="Share Achievement"
            >
              <Award className="w-5 h-5 text-[#FFD700]" />
            </button>
          </div>
        </div>
      ) : (
        /* EXPANDED FULL POST CREATOR VIEW */
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6"
        >
          {/* Header Row with Close Button */}
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 rounded-full border border-[#00f0ff]/50 bg-[#1e2024] flex items-center justify-center overflow-hidden">
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              </div>
              <span className="font-hanken font-bold text-sm text-white">{userName}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white bg-black/40 hover:bg-black/70 p-1.5 rounded-full transition-all cursor-pointer border border-white/10"
              title="Close editor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Textarea Input */}
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Share your training, achievement, competition, or inspire fellow athletes..."
            rows={3}
            autoFocus
            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-white font-['Inter'] text-sm sm:text-base placeholder:text-[#b9cacb]/50 p-0 resize-none leading-relaxed"
          />

          {/* Media Preview or Upload Dropzone */}
          {mediaUrl ? (
            <div className="relative rounded-xl overflow-hidden max-h-72 border border-white/10 bg-gray-950">
              {mediaType === "video" ? (
                <video src={mediaUrl} controls className="w-full h-full object-cover max-h-72" />
              ) : (
                <img src={mediaUrl} alt="Media Preview" className="w-full h-full object-cover max-h-72" />
              )}
              <button
                type="button"
                onClick={() => setMediaUrl("")}
                className="absolute top-2.5 right-2.5 bg-black/80 p-1.5 rounded-full text-white hover:bg-red-600 transition-colors shadow-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => triggerFileUpload("image/*,video/*")}
              className="border-2 border-dashed border-white/20 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#00f0ff]/50 hover:bg-[#333539]/30 transition-all duration-300 group"
            >
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-[#00f0ff] group-hover:scale-110 transition-transform duration-300" />
              <p className="font-['Hanken_Grotesk'] text-sm sm:text-base font-semibold text-white mt-1 text-center">
                Click to upload Photo or Video from your device
              </p>
              <p className="font-['JetBrains_Mono',monospace] text-xs text-[#b9cacb] text-center">
                Supports JPG, PNG, MP4, MOV files
              </p>
            </div>
          )}

          {/* Settings & Publish Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-white/10">
            
            {/* Selectors */}
            <div className="flex flex-wrap items-center gap-4">
              
              {/* Sport Selector */}
              <div className="flex items-center gap-2">
                <span className="font-['JetBrains_Mono',monospace] text-xs text-[#b9cacb]">Sport:</span>
                <div className="relative inline-block">
                  <select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    className="appearance-none bg-[#333539] border border-white/10 rounded-full pl-4 pr-8 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-[#00f0ff] cursor-pointer shadow-md font-['Inter']"
                  >
                    {SPORTS_CATEGORIES.filter((s) => s.name !== "All Sports").map((s) => (
                      <option key={s.name} value={s.name} className="bg-[#111318] text-white">
                        {s.icon} {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-white absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Visibility Selector */}
              <div className="flex items-center gap-2">
                <span className="font-['JetBrains_Mono',monospace] text-xs text-[#b9cacb]">Visibility:</span>
                <button
                  type="button"
                  onClick={() => setVisibility(visibility === "Public" ? "Teammates" : "Public")}
                  className="flex items-center gap-1.5 bg-[#333539] border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-[#00f0ff] font-medium hover:bg-[#37393e] transition-colors cursor-pointer shadow-md font-['Inter']"
                >
                  {visibility === "Public" ? (
                    <Globe className="w-3.5 h-3.5 text-[#00f0ff]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#FFD700]" />
                  )}
                  <span className="text-white">{visibility}</span>
                  <ChevronDown className="w-3 h-3 text-white" />
                </button>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="w-full md:w-auto md:ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="py-2.5 px-4 rounded-lg text-xs font-mono-data text-[#b9cacb] hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={!postText.trim() && !mediaUrl.trim()}
                className={`flex-1 md:flex-initial bg-[#00f0ff] text-[#00363a] font-['Hanken_Grotesk'] text-xs sm:text-sm font-bold tracking-wider px-6 py-2.5 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:bg-[#7df4ff] flex items-center justify-center gap-2 uppercase transition-all cursor-pointer active:scale-95 ${
                  !postText.trim() && !mediaUrl.trim() ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <span>PUBLISH</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Action Toolbar Row */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              type="button"
              onClick={() => triggerFileUpload("image/*")}
              className="flex items-center gap-1.5 text-[#b9cacb] hover:text-[#00f0ff] transition-colors group cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-[#b9cacb] group-hover:text-[#00f0ff] group-hover:scale-110 transition-all" />
              <span className="font-['JetBrains_Mono',monospace] text-xs">Photo</span>
            </button>

            <button
              type="button"
              onClick={() => triggerFileUpload("video/*")}
              className="flex items-center gap-1.5 text-[#b9cacb] hover:text-[#00f0ff] transition-colors group cursor-pointer"
            >
              <VideoIcon className="w-4 h-4 text-[#b9cacb] group-hover:text-[#00f0ff] group-hover:scale-110 transition-all" />
              <span className="font-['JetBrains_Mono',monospace] text-xs">Video</span>
            </button>

            <button
              type="button"
              onClick={() => setPostType("Achievement")}
              className="flex items-center gap-1.5 text-[#FFD700]/80 hover:text-[#FFD700] transition-colors group cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#FFD700] group-hover:scale-110 transition-all" />
              <span className="font-['JetBrains_Mono',monospace] text-xs">Achievement</span>
            </button>

            <button
              type="button"
              onClick={() => setPostType("Event")}
              className="flex items-center gap-1.5 text-purple-400/80 hover:text-purple-400 transition-colors group cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-all" />
              <span className="font-['JetBrains_Mono',monospace] text-xs">Tournament</span>
            </button>

            <button
              type="button"
              onClick={() => {}}
              className="flex items-center gap-1.5 text-pink-500/80 hover:text-pink-500 transition-colors group cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-all" />
              <span className="font-['JetBrains_Mono',monospace] text-xs">Check In</span>
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
