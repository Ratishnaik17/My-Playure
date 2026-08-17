// Playure API Client for FastAPI Backend (http://127.0.0.1:8000/api)
import defaultGearImage from "../assets/default_gear.jpg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export async function fetchHealthStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (err) {
    console.warn("Backend offline, using fallback data:", err);
    return { status: "fallback", service: "client-side" };
  }
}

export async function fetchPosts() {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return await res.json();
  } catch (err) {
    console.warn("API Error, using local posts:", err);
    return null;
  }
}

export async function createPost(postData) {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    return await res.json();
  } catch (err) {
    console.error("Error creating post via API:", err);
    return { status: "error", message: err.message };
  }
}

export async function sendAIChatMessage(message, category = "general") {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, category }),
    });
    return await res.json();
  } catch (err) {
    console.warn("AI API fallback:", err);
    return {
      status: "fallback",
      reply: `Playure AI Coach [${category}]: Response for '${message}'. FastAPI multi-agent engine active!`,
    };
  }
}

// Mock database store for circular marketplace listings (lives in frontend memory)
let mockRePlayListings = [
  {
    id: 1,
    name: "SS English Willow Cricket Bat",
    sport: "Cricket",
    category: "Bats",
    condition: "Excellent",
    price: 4500,
    isFree: false,
    location: "Bangalore, KA",
    description: "Premium English willow bat used for one season. Excellent ping and profile, thick edges, customized grip already fitted. Perfect for league matches.",
    imageUrl: defaultGearImage,
    sellerName: "Arjun Sharma",
    sellerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    sellerRole: "Club Cricketer",
    postedDate: "2 days ago",
  },
  {
    id: 2,
    name: "Yonex Nanoray Badminton Racket",
    sport: "Badminton",
    category: "Rackets",
    condition: "Like New",
    price: 2200,
    isFree: false,
    location: "Mumbai, MH",
    description: "Yonex Nanoray Light 18i carbon graphite racket. Very lightweight (77g), strung with BG65 at 24 lbs. No scratches, sparingly used.",
    imageUrl: defaultGearImage,
    sellerName: "Priya Patel",
    sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    sellerRole: "Badminton Enthusiast",
    postedDate: "1 day ago",
  },
  {
    id: 3,
    name: "Nike Mercurial Football Boots",
    sport: "Football",
    category: "Footwear",
    condition: "Good",
    price: 3000,
    isFree: false,
    location: "Kolkata, WB",
    description: "Nike Mercurial Vapor 14 Club MG boots, UK size 8. Decent studs grip, minor scuffs near toes but otherwise solid condition. Great for synthetic turf and grass fields.",
    imageUrl: defaultGearImage,
    sellerName: "Subhash Bose",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    sellerRole: "Forward / Striker",
    postedDate: "3 days ago",
  },
  {
    id: 4,
    name: "Kipsta Football Size 5",
    sport: "Football",
    category: "Footballs",
    condition: "Excellent",
    price: 0,
    isFree: true,
    location: "Pune, MH",
    description: "Decathlon Kipsta hybrid soccer ball, size 5. Fully inflated, holds air perfectly. Giving away for free to any young footballer/club starting out.",
    imageUrl: defaultGearImage,
    sellerName: "Rohan Joshi",
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    sellerRole: "Youth Coach",
    postedDate: "4 hours ago",
  },
  {
    id: 5,
    name: "Decathlon Kipsta Basketball",
    sport: "Basketball",
    category: "Basketballs",
    condition: "Good",
    price: 800,
    isFree: false,
    location: "Delhi, NCR",
    description: "Size 7 outdoor basketball. Strong rubber grip, durable panel construction. Used on outdoor concrete courts, still has plenty of life left.",
    imageUrl: defaultGearImage,
    sellerName: "Kabir Singh",
    sellerAvatar: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=100&auto=format&fit=crop&q=80",
    sellerRole: "Point Guard",
    postedDate: "5 days ago",
  },
  {
    id: 6,
    name: "Cosco Super Volleyball",
    sport: "Volleyball",
    category: "Balls",
    condition: "Like New",
    price: 0,
    isFree: true,
    location: "Chennai, TN",
    description: "Official size Cosco Super volleyball. Extremely soft touch, perfect for beach or indoor training. Donating to keep the community active!",
    imageUrl: defaultGearImage,
    sellerName: "Divya Nair",
    sellerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    sellerRole: "Volleyball Player",
    postedDate: "6 hours ago",
  },
  {
    id: 7,
    name: "Adidas Ultraboost Running Shoes",
    sport: "Running",
    category: "Footwear",
    condition: "Excellent",
    price: 5500,
    isFree: false,
    location: "Hyderabad, TS",
    description: "Adidas Ultraboost 21, size UK 9. Triple black colorway. Super comfortable cushioning, outsole continental rubber has minimal wear. Only used for morning walks.",
    imageUrl: defaultGearImage,
    sellerName: "Vikrant Mehta",
    sellerAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    sellerRole: "Marathon Runner",
    postedDate: "3 days ago",
  },
  {
    id: 8,
    name: "Nivia Cricket Leather Balls (Pack of 6)",
    sport: "Cricket",
    category: "Balls",
    condition: "Good",
    price: 0,
    isFree: true,
    location: "Hyderabad, TS",
    description: "Box of 6 four-piece leather cricket balls. Slightly used for nets practice (about 5-10 overs each). Great for academy practice sessions.",
    imageUrl: defaultGearImage,
    sellerName: "Naresh Kumar",
    sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    sellerRole: "Academy Captain",
    postedDate: "12 hours ago",
  }
];

export async function fetchRePlayListings() {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/replay/listings`);
    if (!res.ok) throw new Error("Failed to fetch RePlay listings");
    const data = await res.json();
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      sport: item.sport,
      category: item.category,
      condition: item.condition,
      price: item.price,
      isFree: item.is_free,
      location: item.location,
      description: item.description,
      imageUrl: item.image_url || defaultGearImage,
      sellerName: item.user.full_name,
      sellerAvatar: item.user.profile_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      sellerRole: item.user.role || "Athlete",
      postedDate: new Date(item.created_at).toLocaleDateString()
    }));
  } catch (err) {
    console.error("API Error fetching replay listings:", err);
    return [];
  }
}

export async function createRePlayListing(listingData) {
  try {
    const userId = localStorage.getItem("playure_demo_user_id") || "00000000-0000-0000-0000-000000000001";
    const payload = {
      name: listingData.name,
      sport: listingData.sport,
      category: listingData.category,
      condition: listingData.condition,
      price: listingData.price,
      is_free: listingData.isFree,
      location: listingData.location,
      description: listingData.description,
      image_url: listingData.imageUrl,
    };
    const res = await fetch(`${API_BASE_URL}/v1/replay/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": userId,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create RePlay listing");
    const item = await res.json();
    return {
      id: item.id,
      name: item.name,
      sport: item.sport,
      category: item.category,
      condition: item.condition,
      price: item.price,
      isFree: item.is_free,
      location: item.location,
      description: item.description,
      imageUrl: item.image_url || defaultGearImage,
      sellerName: item.user.full_name,
      sellerAvatar: item.user.profile_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      sellerRole: item.user.role || "Athlete",
      postedDate: "Just now"
    };
  } catch (err) {
    console.error("API Error creating replay listing:", err);
    throw err;
  }
}

export async function fetchUserProfile(userId, fullName) {
  try {
    const headers = {};
    if (userId) {
      headers["X-User-Id"] = userId;
    }
    let url = `${API_BASE_URL}/v1/users/me`;
    if (fullName) {
      url += `?full_name=${encodeURIComponent(fullName)}`;
    }
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error("Failed to fetch user profile");
    return await res.json();
  } catch (err) {
    console.warn("API Error, using local profile:", err);
    return null;
  }
}

export async function updateUserProfile(profileData, userId) {
  try {
    const headers = { "Content-Type": "application/json" };
    if (userId) {
      headers["X-User-Id"] = userId;
    }
    const res = await fetch(`${API_BASE_URL}/v1/users/me`, {
      method: "PUT",
      headers,
      body: JSON.stringify(profileData),
    });
    return await res.json();
  } catch (err) {
    console.error("Error updating user profile via API:", err);
    return { status: "error", message: err.message };
  }
}

