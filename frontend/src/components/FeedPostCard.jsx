import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageSquare, Share2, Bookmark, MapPin, Award, Send, CheckCircle2, Flame, MoreHorizontal, ShieldCheck, Flag } from "lucide-react";

export default function FeedPostCard({ post }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isTeamedUp, setIsTeamedUp] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([
      ...comments,
      {
        id: Date.now(),
        author: "You",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        text: newComment,
        time: "Just now",
      },
    ]);
    setNewComment("");
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#161B22]/60 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-xl hover:border-[#00f0ff]/30 transition-all duration-300 relative"
    >
      
      {/* Post Header: Avatar, Name, Role, Club, Sport Badge, Location */}
      <div className="flex items-start justify-between gap-3 !mb-5">
        <div className="flex items-center gap-3.5">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-11 h-11 rounded-full object-cover border border-[#00f0ff] shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h4 className="text-sm font-bold text-white hover:text-[#00f0ff] cursor-pointer font-['Hanken_Grotesk','Inter']">
                {post.authorName}
              </h4>
              {post.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-[#00f0ff] fill-[#00f0ff]/20" />
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
                {post.sportIcon ? `${post.sportIcon} ` : ''}{post.sport}
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-[#b9cacb] !mt-2 flex-wrap">
              {post.playerRole && <span>{post.playerRole}</span>}
              {post.club && (
                <>
                  <span>•</span>
                  <span className="text-gray-300 font-medium">{post.club}</span>
                </>
              )}
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#b9cacb]" />
                {post.location}
              </span>
              <span>•</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Team Up Button & Options Menu */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsTeamedUp(!isTeamedUp)}
            className={`font-bold text-xs sm:text-sm px-3.5 py-1 rounded-full transition-all cursor-pointer font-['Hanken_Grotesk'] ${
              isTeamedUp
                ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]"
                : "text-[#00f0ff] hover:bg-[#00f0ff]/10"
            }`}
          >
            {isTeamedUp ? "✔ Teamed Up" : "+ Team Up"}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-[#b9cacb] hover:text-white rounded-lg hover:bg-[#333539] transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 z-20 w-40 bg-[#111318] border border-white/10 rounded-xl shadow-2xl p-1.5 text-xs text-[#e2e2e8]">
                <button 
                  onClick={() => { setIsBookmarked(!isBookmarked); setShowMenu(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-[#333539] rounded-lg flex items-center gap-2"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isBookmarked ? "Remove Bookmark" : "Save Post"}</span>
                </button>
                <button 
                  onClick={() => { alert("Reported to Playure moderation team."); setShowMenu(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-[#333539] text-[#ffb4ab] rounded-lg flex items-center gap-2"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report Post</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Achievement Banner Badge if present */}
      {post.postType === "Achievement" && (
        <div className="mb-3 p-3 bg-gradient-to-r from-[#00f0ff]/15 to-[#006970]/15 border border-[#00f0ff]/30 rounded-xl flex items-center gap-2.5">
          <Award className="w-5 h-5 text-[#00f0ff] shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-[#00f0ff] uppercase tracking-wider text-[10px] block font-['Hanken_Grotesk']">Verified Achievement</span>
            <span className="text-white font-medium">State Level Official Competition Medal</span>
          </div>
        </div>
      )}

      {/* Post Text */}
      <p className="text-sm text-[#e2e2e8] leading-relaxed !mb-5 whitespace-pre-line font-['Inter']">
        {post.text}
      </p>

      {/* Strava Athletic Stats Block if present */}
      {post.activityStats && (
        <div className="mb-4 p-4 bg-[#111318]/80 border border-white/10 rounded-xl flex items-center justify-around text-center shadow-inner">
          <div>
            <div className="text-[10px] text-[#b9cacb] uppercase tracking-wider font-semibold">Distance / Weight</div>
            <div className="text-base font-extrabold text-[#00f0ff] font-['JetBrains_Mono',monospace] mt-0.5">{post.activityStats.distance}</div>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div>
            <div className="text-[10px] text-[#b9cacb] uppercase tracking-wider font-semibold">Pace / Time</div>
            <div className="text-base font-extrabold text-[#00f0ff] font-['JetBrains_Mono',monospace] mt-0.5">{post.activityStats.pace}</div>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div>
            <div className="text-[10px] text-[#b9cacb] uppercase tracking-wider font-semibold">Calories</div>
            <div className="text-base font-extrabold text-[#00f0ff] font-['JetBrains_Mono',monospace] mt-0.5">{post.activityStats.calories}</div>
          </div>
        </div>
      )}

      {/* Professional Sports Photo Image */}
      {post.imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden border border-white/10 bg-gray-950 max-h-[440px] group cursor-pointer">
          <img
            src={post.imageUrl}
            alt="Sports Performance"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          />
        </div>
      )}

      {/* Modern Engagement Bar */}
      <div className="flex items-center justify-between border-t border-white/10 !pt-4.5 !mt-1 text-xs text-[#b9cacb]">
        <div className="flex items-center gap-6">
          
          {/* Animated Like Button */}
          <motion.button
            whileTap={{ scale: 1.25 }}
            onClick={handleLike}
            className={`flex items-center gap-2 font-semibold transition-all cursor-pointer !p-0 ${
              isLiked ? "text-[#00f0ff]" : "hover:text-[#00f0ff]"
            }`}
          >
            <Heart className={`w-[18px] h-[18px] ${isLiked ? "fill-[#00f0ff] text-[#00f0ff]" : ""}`} />
            <span className="font-['JetBrains_Mono',monospace] text-xs translate-y-[0.5px]">{likes}</span>
          </motion.button>

          {/* Comment Drawer Toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 hover:text-[#00f0ff] font-semibold transition-colors cursor-pointer !p-0"
          >
            <MessageSquare className="w-[18px] h-[18px]" />
            <span className="font-['JetBrains_Mono',monospace] text-xs translate-y-[0.5px]">{comments.length}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: post.authorName, text: post.text, url: window.location.href });
              } else {
                alert("Post link copied to clipboard!");
              }
            }}
            className="flex items-center gap-2 hover:text-[#00f0ff] font-semibold transition-colors cursor-pointer !p-0"
          >
            <Share2 className="w-[18px] h-[18px]" />
            <span className="hidden sm:inline text-xs translate-y-[0.5px]">Share</span>
          </button>

        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer !p-1 ${
            isBookmarked ? "text-[#00f0ff] bg-[#00f0ff]/10" : "hover:text-[#00f0ff]"
          }`}
        >
          <Bookmark className={`w-[18px] h-[18px] ${isBookmarked ? "fill-[#00f0ff] text-[#00f0ff]" : ""}`} />
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-3 border-t border-gray-800"
          >
            <div className="space-y-2.5 mb-3 max-h-48 overflow-y-auto pr-1">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2.5 items-start bg-[#111827] p-3 rounded-[14px] border border-gray-800">
                  <img src={comment.avatar} alt={comment.author} className="w-7 h-7 rounded-full object-cover shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white font-['Outfit']">{comment.author}</span>
                      <span className="text-[10px] text-gray-500">{comment.time}</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-0.5">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment or encouragement..."
                className="flex-1 bg-[#111827] border border-gray-700 rounded-[14px] px-3.5 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-[14px] text-xs font-semibold disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.article>
  );
}
