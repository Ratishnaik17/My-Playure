import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import defaultGearImage from "../assets/default_gear.jpg";
import { 
  ShoppingBag, 
  Tag, 
  Heart, 
  Search, 
  ArrowRight, 
  Shield, 
  MessageSquare, 
  MapPin, 
  User, 
  Clock, 
  Plus, 
  X, 
  ExternalLink, 
  Star, 
  Upload, 
  Bookmark, 
  ArrowUpDown, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ThumbsUp,
  Sparkles,
  Zap,
  Info,
  ChevronRight,
  Activity
} from "lucide-react";
import { fetchRePlayListings, createRePlayListing } from "../api/client";

// Category definitions
const REPLAY_CATEGORIES = [
  { name: "Cricket", icon: "🏏" },
  { name: "Football", icon: "⚽" },
  { name: "Basketball", icon: "🏀" },
  { name: "Badminton", icon: "🏸" },
  { name: "Tennis", icon: "🎾" },
  { name: "Hockey", icon: "🏑" },
  { name: "Volleyball", icon: "🏐" },
  { name: "Running", icon: "🏃" },
  { name: "Fitness", icon: "🏋️" },
  { name: "Other", icon: "🏆" }
];

// Fallback high-quality images per sport for listings created by users
const DEFAULT_SPORT_IMAGES = {
  Cricket: "https://images.unsplash.com/photo-1531415080295-5a7f1c674780?w=600&auto=format&fit=crop&q=80",
  Football: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
  Basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80",
  Badminton: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
  Tennis: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&auto=format&fit=crop&q=80",
  Hockey: "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=600&auto=format&fit=crop&q=80",
  Volleyball: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&auto=format&fit=crop&q=80",
  Running: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
  Fitness: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
  Other: "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=80"
};

const getSportIcon = (sport) => {
  const matched = REPLAY_CATEGORIES.find(c => c.name.toLowerCase() === sport.toLowerCase());
  return matched ? matched.icon : "🏆";
};

export default function RePlayView() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All"); // All, For Sale, Free
  const [selectedSport, setSelectedSport] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");
  const [savedListings, setSavedListings] = useState(new Set());
  
  // Listing creation modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("Sell"); // Sell, Donate
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newListingForm, setNewListingForm] = useState({
    name: "",
    sport: "Cricket",
    category: "",
    condition: "Excellent",
    price: "",
    description: "",
    location: "",
    imageFile: null,
    imagePreviewUrl: ""
  });

  // Listing details modal state
  const [selectedListing, setSelectedListing] = useState(null);
  
  // Contact seller state
  const [showContactSuccess, setShowContactSuccess] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  const listingsGridRef = useRef(null);

  // Load marketplace listings from client API
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchRePlayListings();
        setListings(data);
      } catch (err) {
        console.error("Error loading RePlay listings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter and sort listings
  const filteredListings = listings.filter((item) => {
    // Search query match
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Listing Type match (Sell vs Free/Donate)
    const matchesType = 
      filterType === "All" || 
      (filterType === "For Sale" && !item.isFree) || 
      (filterType === "Free" && item.isFree);

    // Sport Category match
    const matchesSport = 
      selectedSport === "All" || 
      item.sport.toLowerCase() === selectedSport.toLowerCase();

    return matchesSearch && matchesType && matchesSport;
  });

  // Sort logic
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === "Price: Low to High") {
      return (a.price || 0) - (b.price || 0);
    }
    if (sortBy === "Price: High to Low") {
      return (b.price || 0) - (a.price || 0);
    }
    if (sortBy === "Newest") {
      return b.id - a.id;
    }
    // "Recommended" (default backend scoring simulation: donations first, then newest)
    if (a.isFree && !b.isFree) return -1;
    if (!a.isFree && b.isFree) return 1;
    return b.id - a.id;
  });

  // Handle bookmarking
  const toggleSaveListing = (id, e) => {
    e.stopPropagation();
    const updatedSaved = new Set(savedListings);
    if (updatedSaved.has(id)) {
      updatedSaved.delete(id);
    } else {
      updatedSaved.add(id);
    }
    setSavedListings(updatedSaved);
  };

  // Open modal and set Sell/Donate type
  const handleOpenListModal = (type) => {
    setModalType(type);
    setNewListingForm({
      name: "",
      sport: "Cricket",
      category: "",
      condition: "Excellent",
      price: "",
      description: "",
      location: "Bangalore, KA",
      imageFile: null,
      imagePreviewUrl: ""
    });
    setIsModalOpen(true);
  };

  // Handle listing form submit
  const handlePublishListing = async (e) => {
    e.preventDefault();
    if (!newListingForm.name.trim() || !newListingForm.sport || !newListingForm.location.trim()) {
      alert("Please fill in Equipment Name, Sport, and Location.");
      return;
    }
    if (modalType === "Sell" && (!newListingForm.price || isNaN(newListingForm.price) || Number(newListingForm.price) <= 0)) {
      alert("Please enter a valid price for selling your equipment.");
      return;
    }

    setIsSubmitting(true);
    
    // Choose default gear placeholder illustration if no custom image was provided
    const finalImage = newListingForm.imagePreviewUrl || defaultGearImage;

    const payload = {
      name: newListingForm.name.trim(),
      sport: newListingForm.sport,
      category: newListingForm.category.trim() || `${newListingForm.sport} Gear`,
      condition: newListingForm.condition,
      price: modalType === "Donate" ? 0 : Number(newListingForm.price),
      isFree: modalType === "Donate",
      location: newListingForm.location.trim(),
      description: newListingForm.description.trim() || `Quality pre-owned ${newListingForm.sport} gear looking for a new athlete.`,
      imageUrl: finalImage
    };

    try {
      const savedItem = await createRePlayListing(payload);
      setListings((prev) => [savedItem, ...prev]);
      setIsModalOpen(false);
      
      // Auto scroll to listings grid to showcase newly added item
      setTimeout(() => {
        listingsGridRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } catch (err) {
      console.error("Publishing error:", err);
      alert("Something went wrong listing your gear. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file preview mock
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewListingForm(prev => ({
        ...prev,
        imageFile: file,
        imagePreviewUrl: URL.createObjectURL(file)
      }));
    }
  };

  // Handle Contacting Seller
  const handleContactSeller = (e) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    
    setShowContactSuccess(true);
    setTimeout(() => {
      setShowContactSuccess(false);
      setContactMessage("");
    }, 4000);
  };

  // Get similar gear based on sport category
  const similarGearListings = selectedListing
    ? listings
        .filter((item) => item.sport === selectedListing.sport && item.id !== selectedListing.id)
        .slice(0, 3)
    : [];

  return (
    <div className="w-full animate-fadeIn pb-12 font-['Inter']">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#111318] via-[#0E121E] to-[#0A1224] border border-white/5 !p-8 sm:!p-12 md:!p-16 lg:!p-20 flex flex-col lg:flex-row items-center gap-12 shadow-2xl">
        {/* Decorative Grid Light Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,240,255,0.12),transparent_50%)] pointer-events-none" />
        
        {/* Left Side: Branding Content */}
        <div className="flex-1 space-y-6 text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[#00f0ff] text-xs font-bold uppercase tracking-widest font-['Hanken_Grotesk']">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PLAYURE COMMUNITY MARKETPLACE</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight font-['Hanken_Grotesk'] tracking-tight">
            Give Your Gear<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-cyan-400 drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              Second Game.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-[#b9cacb] leading-relaxed max-w-xl font-medium">
            Sell the equipment you no longer use, donate it to an athlete who needs it, or discover quality pre-owned sports gear at a better price from the Playure community.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              onClick={() => handleOpenListModal("Sell")}
              className="px-6 py-3.5 bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] font-black text-sm uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_22px_rgba(0,240,255,0.5)] transition-all flex items-center gap-2 cursor-pointer font-['Hanken_Grotesk']"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>List Your Gear</span>
            </button>
            
            <button
              onClick={() => listingsGridRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3.5 bg-[#1F2937]/75 hover:bg-gray-800 text-white font-bold text-sm uppercase tracking-wider rounded-xl border border-white/10 hover:border-[#00f0ff]/30 transition-all flex items-center gap-2 cursor-pointer font-['Hanken_Grotesk']"
            >
              <span>Explore Gear</span>
              <ArrowRight className="w-4 h-4 text-[#00f0ff]" />
            </button>
          </div>
        </div>

        {/* Right Side: Cinematic Image Collage */}
        <div className="flex-1 w-full max-w-md lg:max-w-none relative z-10">
          <div className="relative group">
            {/* Soft Ambient Shadow Glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00f0ff] via-cyan-500 to-blue-600 rounded-3xl blur-2xl opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            {/* Collage Container */}
            <div className="relative bg-[#161B22]/75 backdrop-blur-2xl border border-white/10 rounded-2xl p-2.5 overflow-hidden shadow-2xl">
              <img
                src="/replay_hero_collage_neon.jpg"
                alt="RePlay Sports Equipment Collage"
                className="w-full h-[320px] sm:h-[380px] object-cover rounded-xl transform hover:scale-[1.01] transition-transform duration-500"
              />
              {/* Glass Details Badge overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/55 backdrop-blur-md border border-white/10 flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#00f0ff] block">Featured Asset</span>
                  <span className="text-xs text-white font-bold block mt-0.5">Premium Circular Economy</span>
                </div>
                <div className="px-2.5 py-1 rounded bg-[#00f0ff] text-xs font-black text-[#002022]">
                  100% VERIFIED
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ACTION CARDS */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 !mt-16">
        
        {/* Card 1: Sell */}
        <div 
          onClick={() => handleOpenListModal("Sell")}
          className="group relative bg-[#161B22]/60 hover:bg-[#1C232E]/80 backdrop-blur-xl border border-white/10 hover:border-[#00f0ff]/40 rounded-2xl p-7 shadow-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.12)] cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between text-left h-64 overflow-hidden"
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#00f0ff]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#00f0ff]/10 transition-all duration-300" />
          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#00f0ff]/10 border border-[#00f0ff]/20 rounded-xl text-[#00f0ff] flex items-center justify-center transition-transform group-hover:scale-110">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white font-['Hanken_Grotesk'] tracking-wide">SELL YOUR GEAR</h3>
              <p className="text-xs text-[#b9cacb] mt-1.5 leading-relaxed font-medium">
                Turn unused equipment into extra cash and give your sports gear a fresh run with active players.
              </p>
            </div>
          </div>
          <span className="text-xs text-[#00f0ff] font-bold tracking-wider flex items-center gap-1 group-hover:translate-x-1.5 transition-transform font-['Hanken_Grotesk'] uppercase mt-4">
            Start Selling <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Card 2: Donate */}
        <div 
          onClick={() => handleOpenListModal("Donate")}
          className="group relative bg-[#161B22]/60 hover:bg-[#1C232E]/80 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 rounded-2xl p-7 shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between text-left h-64 overflow-hidden"
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-300" />
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white font-['Hanken_Grotesk'] tracking-wide">DONATE EQUIPMENT</h3>
              <p className="text-xs text-[#b9cacb] mt-1.5 leading-relaxed font-medium">
                Help aspiring local athletes who need the gear. Donate for free and promote sporting access.
              </p>
            </div>
          </div>
          <span className="text-xs text-emerald-400 font-bold tracking-wider flex items-center gap-1 group-hover:translate-x-1.5 transition-transform font-['Hanken_Grotesk'] uppercase mt-4">
            Donate Now <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Card 3: Find */}
        <div 
          onClick={() => listingsGridRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="group relative bg-[#161B22]/60 hover:bg-[#1C232E]/80 backdrop-blur-xl border border-white/10 hover:border-amber-400/40 rounded-2xl p-7 shadow-xl hover:shadow-[0_0_30px_rgba(254,214,57,0.12)] cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between text-left h-64 overflow-hidden"
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/10 transition-all duration-300" />
          <div className="space-y-4">
            <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 rounded-xl text-amber-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <ShoppingBag className="w-6 h-6 text-[#111318]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white font-['Hanken_Grotesk'] tracking-wide">FIND YOUR GEAR</h3>
              <p className="text-xs text-[#b9cacb] mt-1.5 leading-relaxed font-medium">
                Discover pre-loved equipment at great price points or select free donation items from nearby players.
              </p>
            </div>
          </div>
          <span className="text-xs text-amber-400 font-bold tracking-wider flex items-center gap-1 group-hover:translate-x-1.5 transition-transform font-['Hanken_Grotesk'] uppercase mt-4">
            Browse Gear <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </section>



      {/* ========================================================================= */}
      {/* 4. FEATURED LISTINGS */}
      {/* ========================================================================= */}
      <section ref={listingsGridRef} className="text-left !mt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Hanken_Grotesk'] uppercase tracking-wider">
              Trending on RePlay
            </h2>
            <p className="text-xs text-[#b9cacb] mt-1">High-quality pre-owned equipment listed by athletes</p>
          </div>
          
          {/* Main Action creation trigger */}
          <button
            onClick={() => handleOpenListModal("Sell")}
            className="self-start sm:self-auto px-5 py-2.5 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer font-['Hanken_Grotesk']"
          >
            <Plus className="w-4 h-4 stroke-[3.5]" />
            <span>List New Gear</span>
          </button>
        </div>

        {/* Filters and Controls Toolbar */}
        <div className="bg-[#111318]/90 border border-white/10 rounded-2xl !p-4 sm:!p-5 flex flex-col md:flex-row items-center gap-4 justify-between backdrop-blur-md !mt-6 mb-8">
          {/* Listing Type Filter Chips */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: "All", label: "All Items", icon: "🌐" },
              { id: "For Sale", label: "For Sale", icon: "🏷️" },
              { id: "Free", label: "Free", icon: "🎁" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border flex items-center gap-1.5 shrink-0 ${
                  filterType === tab.id
                    ? "bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff]"
                    : "bg-[#161B22]/70 border-transparent text-[#b9cacb] hover:text-white"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search bar & Sort controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment, sports..."
                className="w-full !pl-5 !pr-12 !py-3 bg-[#161B22]/50 border border-white/10 rounded-full text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] transition-all font-medium"
              />
              <Search className="absolute right-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute right-11 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sport Category Filter Dropdown */}
            <div className="relative w-full sm:w-auto shrink-0">
              <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00f0ff] pointer-events-none" />
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full sm:w-auto bg-[#161B22] border border-white/10 rounded-xl !pl-10 !pr-10 !py-3 font-bold text-xs cursor-pointer text-white appearance-none hover:border-[#00f0ff]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
              >
                <option value="All" className="bg-[#111318] text-white">All Sports</option>
                {REPLAY_CATEGORIES.map(sport => (
                  <option key={sport.name} value={sport.name} className="bg-[#111318] text-white">
                    {sport.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                <span className="material-symbols-outlined text-[16px] text-gray-400">expand_more</span>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-auto shrink-0">
              <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00f0ff] pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto bg-[#161B22] border border-white/10 rounded-xl !pl-10 !pr-10 !py-3 font-bold text-xs cursor-pointer text-white appearance-none hover:border-[#00f0ff]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
              >
                <option value="Recommended" className="bg-[#111318] text-white">Recommended</option>
                <option value="Price: Low to High" className="bg-[#111318] text-white">Price: Low to High</option>
                <option value="Price: High to Low" className="bg-[#111318] text-white">Price: High to Low</option>
                <option value="Newest" className="bg-[#111318] text-white">Newest Listings</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                <span className="material-symbols-outlined text-[16px] text-gray-400">expand_more</span>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          /* SKELETON LOADING STATE */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 !mt-6">
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="bg-[#161B22]/40 border border-white/5 rounded-2xl p-4 space-y-4 animate-pulse">
                <div className="w-full h-44 bg-white/5 rounded-xl" />
                <div className="h-4 bg-white/10 rounded w-1/3" />
                <div className="h-5 bg-white/10 rounded w-3/4" />
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-white/10 rounded w-1/4" />
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                </div>
                <div className="h-9 bg-white/10 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : sortedListings.length > 0 ? (
          /* ACTUAL LISTINGS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 !mt-6">
            {sortedListings.map((item) => {
              const isSaved = savedListings.has(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedListing(item)}
                  className="group bg-[#161B22]/50 hover:bg-[#1D2532] border border-white/10 hover:border-[#00f0ff]/40 rounded-2xl !p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transform hover:-translate-y-1 relative animate-fadeIn"
                >
                  <div className="space-y-3.5">
                    {/* Item Image Container with Badges */}
                    <div className="w-full h-44 overflow-hidden rounded-xl bg-gray-900 border border-white/5 relative">
                      <img
                        src={item.imageUrl || defaultGearImage}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Condition Badge Overlay (Top Left) */}
                      <span className={`absolute top-3 left-3 px-2 py-0.75 rounded text-[10px] font-extrabold tracking-wide text-white uppercase ${
                        item.condition.toLowerCase() === "good" ? "bg-emerald-600/90" :
                        item.condition.toLowerCase() === "like new" ? "bg-blue-600/90" :
                        "bg-teal-600/90"
                      }`}>
                        {item.condition}
                      </span>

                      {/* Heart Button Overlay (Top Right) */}
                      <button
                        onClick={(e) => toggleSaveListing(item.id, e)}
                        className="absolute top-2.5 right-2.5 z-10 w-8 h-8 bg-black/60 hover:bg-black/85 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
                        aria-label="Save listing"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-[#00f0ff] text-[#00f0ff]" : "text-white"}`} />
                      </button>
                    </div>

                    {/* Meta info: Category & Sport */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#b9cacb]">
                        <span>{getSportIcon(item.sport)}</span>
                        <span>{item.sport}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-extrabold text-white leading-snug tracking-wide line-clamp-1 group-hover:text-[#00f0ff] transition-colors text-left font-['Hanken_Grotesk']">
                        {item.name}
                      </h3>

                      {/* Price & Location row */}
                      <div className="flex items-center justify-between pt-2">
                        {item.isFree ? (
                          <span className="text-[#00FF41] font-black text-sm uppercase tracking-wider">
                            🎁 FREE
                          </span>
                        ) : (
                          <span className="text-[#00f0ff] font-extrabold text-sm font-['JetBrains_Mono']">
                            ₹{item.price.toLocaleString("en-IN")}
                          </span>
                        )}
                        
                        <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-gray-500" />
                          {item.location.split(",")[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seller details & Handovers */}
                  <div className="space-y-4 mt-5 pt-5 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.sellerAvatar}
                          alt={item.sellerName}
                          className="w-7 h-7 rounded-full object-cover border border-white/15"
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold text-white block leading-tight">
                            {item.sellerName}
                          </span>
                          <span className="text-[9px] text-[#b9cacb] block font-normal flex items-center gap-1 mt-0.5">
                            Verified Athlete
                            <span className="w-2.5 h-2.5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[7px] font-black scale-90">✓</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* View Details Button (Dark outlined) */}
                    <button
                      className="w-full !mt-4.5 !py-3 bg-transparent border border-white/10 hover:border-[#00f0ff] hover:bg-[#00f0ff]/5 text-[#e2e2e8] hover:text-[#00f0ff] rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer font-['Hanken_Grotesk']"
                    >
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-[#161B22]/40 border border-white/10 rounded-2xl p-12 text-center max-w-lg mx-auto my-8">
            <ShoppingBag className="w-12 h-12 text-gray-500 mx-auto mb-3.5" />
            <h3 className="text-base font-extrabold text-white">No listings found</h3>
            <p className="text-xs text-[#b9cacb] mt-1.5 max-w-sm mx-auto">
              We couldn't find any sports gear matching your selected filters. Try adjusting your query or list your own gear to kick things off!
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("All");
                  setSelectedSport("All");
                }}
                className="px-4 py-2.5 bg-[#333539] hover:bg-gray-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
              
              <button
                onClick={() => handleOpenListModal("Sell")}
                className="px-4 py-2.5 bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                + List Your Gear
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 5. DONATION HIGHLIGHT */}
      {/* ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#111318] via-[#0F1421] to-[#161B22] border border-white/10 !py-12 sm:!py-14 md:!py-16 !px-8 sm:!px-12 flex flex-col md:flex-row items-center justify-between gap-8 text-left shadow-2xl !mt-16">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,240,255,0.06),transparent_50%)] pointer-events-none" />
        
        {/* Sports Bag Illustration Overlay (Far Right) */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden md:block pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1421] via-[#0F1421]/60 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1471286853257-cb448d6d2490?w=600&auto=format&fit=crop&q=80"
            alt=""
            className="w-full h-full object-cover opacity-35 filter brightness-75 contrast-125"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 max-w-2xl relative z-10">
          {/* Heart Badge Icon Container */}
          <div className="w-14 h-14 bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[#00f0ff] rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <Heart className="w-6 h-6 fill-[#00f0ff]/10" />
          </div>
          
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Hanken_Grotesk'] tracking-wide">
              Play It Forward
            </h2>
            <p className="text-xs text-[#b9cacb] leading-relaxed max-w-xl font-medium">
              Your old gear could be someone else's opportunity. Donate equipment and help athletes continue their journey.
            </p>
          </div>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            onClick={() => handleOpenListModal("Donate")}
            className="!px-6 !py-3.5 bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] font-black text-sm uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_20px_rgba(0,240,255,0.45)] transition-all flex items-center gap-2 cursor-pointer font-['Hanken_Grotesk']"
          >
            <span>Donate Your Gear</span>
            <ArrowRight className="w-4 h-4 stroke-[3.5]" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOW IT WORKS */}
      {/* ========================================================================= */}
      <section className="text-center bg-[#161B22]/20 border border-white/5 rounded-3xl !pt-8 sm:!pt-10 md:!pt-12 !pb-12 sm:!pb-14 md:!pb-18 !px-6 sm:!px-10 md:!px-14 backdrop-blur-xl !mt-16">
        <div className="w-full flex flex-col items-center text-center justify-center mb-14 md:mb-18">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider font-['Hanken_Grotesk']">
            How It Works
          </h2>
          <p className="text-xs text-[#b9cacb] mt-2">Get your gear back into play in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative !mt-10 md:!mt-14">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center gap-4 relative group">
            <div className="w-14 h-14 bg-[#111318] border border-white/10 rounded-2xl flex items-center justify-center text-[#00f0ff] font-['JetBrains_Mono'] text-lg font-black shadow-lg shadow-black/55 group-hover:border-[#00f0ff]/40 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300">
              01
            </div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-['Hanken_Grotesk']">List Your Gear</h3>
            <p className="text-xs text-[#b9cacb] max-w-xs leading-relaxed font-medium">
              Upload details, photos, and condition of your equipment. Choose to list it as a sale for a custom price or as a free donation.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center gap-4 relative group">
            <div className="w-14 h-14 bg-[#111318] border border-white/10 rounded-2xl flex items-center justify-center text-[#00f0ff] font-['JetBrains_Mono'] text-lg font-black shadow-lg shadow-black/55 group-hover:border-[#00f0ff]/40 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300">
              02
            </div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-['Hanken_Grotesk']">Connect with Athletes</h3>
            <p className="text-xs text-[#b9cacb] max-w-xs leading-relaxed font-medium">
              Communicate securely on Playure’s encrypted Direct Messaging. Answer queries, negotiate details, and schedule pickups.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center gap-4 relative group">
            <div className="w-14 h-14 bg-[#111318] border border-white/10 rounded-2xl flex items-center justify-center text-[#00f0ff] font-['JetBrains_Mono'] text-lg font-black shadow-lg shadow-black/55 group-hover:border-[#00f0ff]/40 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300">
              03
            </div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-['Hanken_Grotesk']">RePlay and Recycle</h3>
            <p className="text-xs text-[#b9cacb] max-w-xs leading-relaxed font-medium">
              Pass your equipment over, collect funds or complete donations, and contribute to sports access and sustainability!
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TRUST / SAFETY SECTION */}
      {/* ========================================================================= */}
      <section className="bg-[#111318]/90 border border-white/10 rounded-2xl !p-6 sm:!p-8 md:!p-10 lg:!p-12 flex flex-col lg:flex-row items-center justify-between gap-6 backdrop-blur-md text-left !mt-16">
        <div className="space-y-2">
          <h2 className="text-base font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00f0ff]" />
            <span>Community Trust & Marketplace Safety</span>
          </h2>
          <p className="text-xs text-[#b9cacb] max-w-2xl leading-relaxed font-medium">
            RePlay is a peer-to-peer athlete portal built on transparency. All listings, communication, and handovers occur directly between verified Playure community members.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
          {[
            { label: "Verified Members", icon: "✓" },
            { label: "Secure Chat", icon: "💬" },
            { label: "Transparent Listings", icon: "🔍" },
            { label: "Report Flagging", icon: "⚠️" }
          ].map((badge) => (
            <div key={badge.label} className="bg-[#1C2433] border border-white/5 rounded-xl p-4 text-center flex flex-col items-center justify-center gap-2 min-h-[90px] min-w-[115px] shadow-md transition-all hover:border-[#00f0ff]/30">
              <span className="text-[#00f0ff] font-extrabold text-sm">{badge.icon}</span>
              <span className="text-[10px] text-[#e2e2e8] font-bold block leading-tight">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SELL/DONATE MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 15 }}
              className="bg-[#0A1224] border border-[#192540] rounded-2xl max-w-2xl w-full !p-6 sm:!p-8 shadow-2xl relative my-6 text-gray-100 text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4.5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#00f0ff]/10 border border-[#00f0ff]/20 rounded-xl text-[#00f0ff]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-white font-['Hanken_Grotesk'] tracking-wider uppercase">
                    List Your Gear on RePlay
                  </h2>
                </div>
                
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-[#b9cacb] hover:text-white rounded-xl hover:bg-[#333539]/60 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handlePublishListing} className="!space-y-4.5">
                
                {/* Choose Listing Type Toggle */}
                <div>
                  <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block !mb-1.5 font-['Hanken_Grotesk']">
                    LISTING TYPE
                  </label>
                  <div className="grid grid-cols-2 gap-3 bg-[#161B22] p-1 border border-white/5 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setModalType("Sell")}
                      className={`!py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                        modalType === "Sell"
                          ? "bg-[#00f0ff] text-[#002022] shadow"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Sell Equipment</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setModalType("Donate")}
                      className={`!py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                        modalType === "Donate"
                          ? "bg-emerald-500 text-slate-950 shadow"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Donate for Free</span>
                    </button>
                  </div>
                </div>

                {/* Field: Equipment name */}
                <div>
                  <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block !mb-1.5 font-['Hanken_Grotesk']">
                    EQUIPMENT NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={newListingForm.name}
                    onChange={(e) => setNewListingForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. SS English Willow Bat, Yonex Racket, etc."
                    className="w-full !px-4 !py-2.5 bg-[#161B22] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-medium focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>

                {/* Row 2: Sport (Select) & Category (Text) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Sport Select */}
                  <div>
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block !mb-1.5 font-['Hanken_Grotesk']">
                      SPORT / SPORT DISCIPLINE
                    </label>
                    <select
                      value={newListingForm.sport}
                      onChange={(e) => setNewListingForm(prev => ({ ...prev, sport: e.target.value }))}
                      className="w-full !px-4 !py-2.5 bg-[#161B22] border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#00f0ff] cursor-pointer"
                    >
                      {REPLAY_CATEGORIES.map(c => (
                        <option key={c.name} value={c.name} className="bg-[#111318] text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Field */}
                  <div>
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block !mb-1.5 font-['Hanken_Grotesk']">
                      SUB-CATEGORY (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={newListingForm.category}
                      onChange={(e) => setNewListingForm(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g. Bats, Footwear, Rackets, Protective"
                      className="w-full !px-4 !py-2.5 bg-[#161B22] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-medium focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                </div>

                {/* Row 3: Condition (Select) & Price (Conditional Input) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Condition Select */}
                  <div>
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block !mb-1.5 font-['Hanken_Grotesk']">
                      EQUIPMENT CONDITION
                    </label>
                    <select
                      value={newListingForm.condition}
                      onChange={(e) => setNewListingForm(prev => ({ ...prev, condition: e.target.value }))}
                      className="w-full !px-4 !py-2.5 bg-[#161B22] border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#00f0ff] cursor-pointer"
                    >
                      {["Like New", "Excellent", "Good", "Fair"].map(cond => (
                        <option key={cond} value={cond} className="bg-[#111318] text-white">{cond}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price (Sell matches only) */}
                  <div>
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block !mb-1.5 font-['Hanken_Grotesk']">
                      PRICE (INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        disabled={modalType === "Donate"}
                        required={modalType === "Sell"}
                        value={modalType === "Donate" ? "" : newListingForm.price}
                        onChange={(e) => setNewListingForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder={modalType === "Donate" ? "FREE (DONATION)" : "e.g. 1500"}
                        className={`w-full !pl-8 !pr-4 !py-2.5 bg-[#161B22] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-bold focus:outline-none focus:border-[#00f0ff] ${
                          modalType === "Donate" ? "opacity-55 cursor-not-allowed bg-[#0B1120] border-white/5" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block !mb-1.5 font-['Hanken_Grotesk']">
                    DESCRIPTION / DETAILS
                  </label>
                  <textarea
                    rows="3"
                    value={newListingForm.description}
                    onChange={(e) => setNewListingForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Specify sizing, brand details, years used, wear-and-tear info, etc. Help buyers choose."
                    className="w-full !px-4 !py-2.5 bg-[#161B22] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-medium focus:outline-none focus:border-[#00f0ff] resize-none"
                  />
                </div>

                {/* Row 4: Image Mock Upload & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Photo Upload Mock */}
                  <div>
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block !mb-1.5 font-['Hanken_Grotesk']">
                      UPLOAD EQUIPMENT PHOTOS
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id="replay-upload"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="replay-upload"
                        className="flex items-center gap-2 !px-4 !py-2.5 bg-[#161B22] hover:bg-[#1E2530] text-xs font-bold text-white border border-dashed border-white/15 hover:border-[#00f0ff]/30 rounded-xl cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4 text-[#00f0ff]" />
                        <span className="truncate">
                          {newListingForm.imageFile ? newListingForm.imageFile.name : "Select Image from Disk"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Location field */}
                  <div>
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block !mb-1.5 font-['Hanken_Grotesk']">
                      CITY / LOCATION
                    </label>
                    <input
                      type="text"
                      required
                      value={newListingForm.location}
                      onChange={(e) => setNewListingForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Bangalore, KA"
                      className="w-full !px-4 !py-2.5 bg-[#161B22] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-medium focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="!pt-4.5 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="!px-5 !py-2.5 bg-[#333539] hover:bg-gray-700 text-[#e2e2e8] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`!px-6 !py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 cursor-pointer font-['Hanken_Grotesk'] ${
                      modalType === "Donate"
                        ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse"
                        : "bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>PUBLISHING...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>PUBLISH LISTING</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 9. LISTING DETAILS OVERLAY */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 15 }}
              className="bg-[#0A1224] border border-[#192540] rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-6 text-gray-100 text-left overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedListing(null)}
                className="absolute top-5 right-5 z-20 p-2 text-[#b9cacb] hover:text-white rounded-xl hover:bg-[#333539]/60 transition-colors cursor-pointer"
              >
                <X className="w-5.5 h-5.5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative z-10">
                {/* Left Side: Image Gallery */}
                <div className="space-y-4">
                  <div className="w-full h-72 sm:h-96 overflow-hidden rounded-2xl bg-gray-900 border border-white/10 relative">
                    <img
                      src={selectedListing.imageUrl || defaultGearImage}
                      alt={selectedListing.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/75 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#00f0ff]">
                      {selectedListing.condition}
                    </div>
                  </div>
                  
                  {/* Small Thumbnails Row Mock */}
                  <div className="grid grid-cols-4 gap-2.5">
                    <div className="h-16 overflow-hidden rounded-lg bg-gray-900 border-2 border-[#00f0ff] cursor-pointer">
                      <img src={selectedListing.imageUrl || defaultGearImage} className="w-full h-full object-cover" />
                    </div>
                    {[1, 2, 3].map((idx) => (
                      <div key={idx} className="h-16 overflow-hidden rounded-lg bg-gray-900 border border-white/5 opacity-55 hover:opacity-85 transition-opacity cursor-pointer">
                        <img src={selectedListing.imageUrl || defaultGearImage} className="w-full h-full object-cover saturate-50 blur-[0.5px]" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: details specs */}
                <div className="space-y-5 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    {/* Header tags */}
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 text-[10px] font-extrabold uppercase tracking-wide">
                        {selectedListing.sport}
                      </span>
                      <span className="px-2.5 py-1 rounded bg-white/5 text-[#b9cacb] border border-white/15 text-[10px] font-medium">
                        {selectedListing.category}
                      </span>
                    </div>

                    {/* Product title */}
                    <h1 className="text-xl sm:text-2xl font-black text-white leading-tight font-['Hanken_Grotesk'] tracking-wide !mt-3.5">
                      {selectedListing.name}
                    </h1>

                    {/* Price and post details */}
                    <div className="flex items-center justify-between !py-3.5 border-y border-white/10 !mt-4.5">
                      <div>
                        {selectedListing.isFree ? (
                          <span className="text-emerald-400 font-black text-xl tracking-wider uppercase">
                            🎁 FREE DONATION
                          </span>
                        ) : (
                          <span className="text-[#00f0ff] font-extrabold text-xl font-['JetBrains_Mono']">
                            ₹{selectedListing.price.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Posted {selectedListing.postedDate}</span>
                      </div>
                    </div>

                    {/* Description text */}
                    <div className="space-y-2.5 !mt-5">
                      <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-[#b9cacb] font-['Hanken_Grotesk']">
                        Product Details
                      </h4>
                      <p className="text-xs text-[#e2e2e8] leading-relaxed font-medium">
                        {selectedListing.description}
                      </p>
                    </div>

                    {/* Seller details card */}
                    <div className="bg-[#161B22] border border-white/10 rounded-xl !p-4.5 flex items-center justify-between !mt-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedListing.sellerAvatar}
                          alt={selectedListing.sellerName}
                          className="w-10 h-10 rounded-full object-cover border border-[#00f0ff]"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-1">
                            <span>{selectedListing.sellerName}</span>
                            <span className="w-3 h-3 bg-[#00f0ff] text-[#002022] text-[8px] flex items-center justify-center rounded-full font-black">✓</span>
                          </h4>
                          <p className="text-[10px] text-[#b9cacb] mt-0.5">{selectedListing.sellerRole}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-[#b9cacb] block font-medium">Handovers at</span>
                        <span className="text-xs text-white font-bold block flex items-center gap-1 mt-0.5 justify-end">
                          <MapPin className="w-3 h-3 text-[#00f0ff]" />
                          {selectedListing.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messaging contact box */}
                  <div className="!pt-4">
                    {showContactSuccess ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/35 rounded-xl p-4 flex items-center gap-3.5 text-left text-emerald-400">
                        <CheckCircle className="w-6 h-6 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wide">MESSAGE DISPATCHED!</h4>
                          <p className="text-[10px] text-[#b9cacb] mt-0.5 leading-relaxed font-medium">
                            We've notified {selectedListing.sellerName} regarding your request. You can check communications in your Direct Messages tab.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSeller} className="space-y-2.5">
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder={`Send a quick message to ${selectedListing.sellerName}...`}
                            className="w-full !pl-4 !pr-16 !py-3.5 bg-[#161B22] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] font-medium"
                          />
                          <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 !px-3.5 !py-2 bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors"
                          >
                            Send
                          </button>
                        </div>
                        
                        {/* Bookmark / Save CTA */}
                        <div className="flex gap-2.5 pt-1.5">
                          <button
                            type="button"
                            onClick={(e) => toggleSaveListing(selectedListing.id, e)}
                            className="flex-1 !py-3.5 bg-[#1F2937]/75 hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-[#00f0ff]/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${savedListings.has(selectedListing.id) ? "fill-[#00f0ff] text-[#00f0ff]" : ""}`} />
                            <span>
                              {savedListings.has(selectedListing.id) ? "Gear Saved" : "Save Listing"}
                            </span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>



            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
