import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import LeftProfileSidebar from "../components/LeftProfileSidebar";
import CreatePostCard from "../components/CreatePostCard";
import FeedPostCard from "../components/FeedPostCard";
import CompetitionsView from "../components/CompetitionsView";
import CollaborationView from "../components/CollaborationView";
import RightSidebar from "../components/RightSidebar";
import AIChatbotModal from "../components/AIChatbotModal";
import MessagingModal from "../components/MessagingModal";
import NotificationSettingsModal from "../components/NotificationSettingsModal";
import { Trophy, Flame } from "lucide-react";

export default function Dashboard({ onSignOut }) {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("All Sports");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [notificationCount, setNotificationCount] = useState(3);
  const createPostRef = useRef(null);

  // High quality sports updates feed
  const [posts, setPosts] = useState([
    {
      id: 101,
      authorName: "Neeraj Chopra Fan Club",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
      playerRole: "Javelin Thrower",
      sport: "Athletics",
      club: "Athletics Federation of India",
      location: "Panipat, HR",
      timestamp: "2 hours ago",
      postType: "Achievement",
      isVerified: true,
      text: "🥇 Won Gold Medal in State Track & Field Championship! Hit a personal best of 84.5m in Javelin Throw today. Next target: National Games! Huge thanks to my coach and teammates for the constant support. 🇮🇳⚡",
      imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80",
      likes: 342,
      isLiked: true,
      commentsCount: 28,
      comments: [
        { id: 1, author: "Rahul Dravid", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80", text: "Incredible throw! Keep inspiring Indian athletics! 👏", time: "1h ago" }
      ],
      isBookmarked: true,
    },
  ]);

  useEffect(() => {
    async function fetchDatabaseFeed() {
      try {
        const res = await fetch("http://localhost:8000/api/v1/feed");
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            const mappedBackendPosts = data.items.map((p) => ({
              id: p.id,
              authorName: p.user?.full_name || "Ratish Naik",
              authorAvatar: p.user?.profile_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
              playerRole: p.user?.role || "Athlete / Player",
              sport: p.sport || "Cricket",
              sportIcon: "🏆",
              club: "Playure Sports Network",
              location: p.location || "India",
              timestamp: "Recently",
              postType: p.post_type || "normal",
              visibility: p.visibility || "public",
              isVerified: true,
              text: p.content,
              imageUrl: p.media?.[0]?.media_url || null,
              likes: p.likes_count || 0,
              isLiked: p.is_liked_by_me || false,
              commentsCount: p.comments_count || 0,
              comments: [],
              isBookmarked: p.is_saved_by_me || false,
            }));
            
            setPosts((prev) => {
              const existingIds = new Set(prev.map(item => String(item.id)));
              const uniqueNew = mappedBackendPosts.filter(item => !existingIds.has(String(item.id)));
              return [...uniqueNew, ...prev];
            });
          }
        }
      } catch (err) {
        console.warn("Backend feed notice:", err);
      }
    }
    fetchDatabaseFeed();
  }, []);

  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory !== "All Sports" && post.sport !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-[#090F1E] text-gray-100 font-['Inter'] selection:bg-blue-600 selection:text-white flex flex-col items-center">
      
      {/* 1. Header Navigation Bar */}
      <Navbar
        onOpenChatbot={() => setIsChatbotOpen(true)}
        onOpenMessaging={() => setIsMessagingOpen(true)}
        unreadCount={unreadCount}
        isNotificationsOpen={isNotificationsOpen}
        onOpenNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        onCloseNotifications={() => setIsNotificationsOpen(false)}
        notificationCount={notificationCount}
        onOpenNotificationSettings={() => setIsNotificationSettingsOpen(true)}
        onNotificationUnreadCountChange={(cnt) => setNotificationCount(cnt)}
        onNavigateTab={(tab) => {
          if (tab === "messages") {
            setIsMessagingOpen(true);
          } else if (tab === "ai_coach") {
            setIsChatbotOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        activeTab={activeTab}
        onSignOut={onSignOut}
      />

      {/* 2. Main Centered 3-Column Layout Container (1400px Max) */}
      <div className="w-full flex justify-center py-6 px-3 sm:px-5">
        <div className="w-full max-w-[1400px] flex justify-center items-start gap-6">
          {/* Column 1: Left Profile Sidebar (320px) */}
          <div className="w-[300px] xl:w-[320px] shrink-0 hidden lg:block sticky top-[80px]">
            <LeftProfileSidebar 
              activeTab={activeTab}
              onNavigateTab={(tab) => {
                if (tab === "ai_assistant") {
                  setIsChatbotOpen(true);
                } else if (tab === "messages") {
                  setIsMessagingOpen(true);
                } else {
                  setActiveTab(tab);
                }
              }}
              onNavigateCompetitions={() => setActiveTab("competitions")} 
              onSignOut={onSignOut}
            />
          </div>

          {/* Column 2: Center Main Feed */}
          <main className="flex-1 min-w-0 space-y-6">
            
            {activeTab === "competitions" ? (
              /* DEDICATED COMPETITIONS PAGE VIEW */
              <CompetitionsView />
            ) : activeTab === "collaboration" ? (
              /* DEDICATED COLLABORATION HUB VIEW */
              <CollaborationView />
            ) : (
              /* MAIN FEED VIEW */
              <>
                {/* Create Post Section */}
                <div ref={createPostRef} className="mb-4">
                  <CreatePostCard onAddPost={handleAddPost} />
                </div>

                {/* Active Feed Header with generous padding & space */}
                <div className="flex items-center justify-between px-2 py-4 my-3 border-y border-white/5">
                  <div className="flex items-center gap-2 text-sm font-bold text-white font-['Hanken_Grotesk']">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>
                      {activeTab === "collaboration"
                        ? "Player & Coach Collaborations"
                        : `${selectedCategory} Feed`}
                    </span>
                    <span className="text-xs text-[#b9cacb] font-normal font-['JetBrains_Mono']">
                      ({filteredPosts.length} updates)
                    </span>
                  </div>

                  {selectedCategory !== "All Sports" && (
                    <button
                      onClick={() => setSelectedCategory("All Sports")}
                      className="text-xs text-[#00f0ff] hover:underline font-semibold"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>

                {/* Feed Posts with generous 32px empty space gap between cards */}
                {filteredPosts.length > 0 ? (
                  <div className="flex flex-col gap-8 pt-4 pb-8">
                    {filteredPosts.map((post) => (
                      <div key={post.id} className="w-full">
                        <FeedPostCard post={post} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#1F2937] border border-gray-800 rounded-[20px] p-8 text-center my-4">
                    <Trophy className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-white font-['Outfit']">No sports updates found</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                      Be the first athlete to share a post in {selectedCategory}!
                    </p>
                    <button
                      onClick={() => setSelectedCategory("All Sports")}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-[14px] text-xs font-semibold hover:bg-blue-500 transition-colors"
                    >
                      View All Sports Feed
                    </button>
                  </div>
                )}
              </>
            )}

          </main>

          {/* Column 3: Right Sidebar (320px) */}
          <div className="w-[300px] xl:w-[320px] shrink-0 hidden lg:block sticky top-[80px]">
            <RightSidebar 
              activeTab={activeTab}
              onOpenChatbot={() => setIsChatbotOpen(true)} 
              onNavigateCompetitions={() => setActiveTab("competitions")}
            />
          </div>

        </div>
      </div>

      {/* AI Sports Assistant Drawer */}
      <AIChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />

      {/* Real-Time Direct Messaging Suite Modal */}
      <MessagingModal
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        onUnreadCountChange={(cnt) => setUnreadCount(cnt)}
      />

      {/* Notification Preferences Settings Modal */}
      <NotificationSettingsModal
        isOpen={isNotificationSettingsOpen}
        onClose={() => setIsNotificationSettingsOpen(false)}
      />

    </div>
  );
}

