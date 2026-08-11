import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { 
  Trophy, Award, Users, ShieldCheck, Mail, MapPin, Globe, Plus, 
  Trash2, PlusCircle, CheckCircle2, ChevronRight, UserPlus, 
  MessageSquare, Star, Calendar, FileText, ChevronDown, Check,
  Target, Zap, Dumbbell, Play, Award as MedalIcon
} from "lucide-react";
import { fetchUserProfile, updateUserProfile } from "../api/client";

// Mock data model
const INITIAL_ATHLETE_DATA = {
  name: localStorage.getItem("playure_demo_user_name") || "Arjun Mehta",
  sport: "Cricket",
  role: "Professional Cricketer",
  location: "Bengaluru, India",
  profileUrl: "playure.com/arjunmehta",
  attributes: ["Right Hand Batsman", "Right Arm Off Break", "All Rounder"],
  jerseyNumber: "07",
  avatarUrl: "/default_avatar.jpg",
  coverUrl: "https://images.unsplash.com/photo-1531415080290-bc9b89980a65?w=1600&auto=format&fit=crop&q=80",
  stats: {
    connections: 325,
    teams: 28,
    tournaments: 42,
    followers: 1205
  },
  about: "Passionate cricketer with 8+ years of experience in competitive cricket. Represented Mumbai in Ranji Trophy and currently playing in the Premier League. Focused on continuous improvement and team success.",
  bioDetails: [
    { id: "age", label: "Age", value: "24", icon: "cake" },
    { id: "height", label: "Height", value: "5'10\"", icon: "straighten" },
    { id: "weight", label: "Weight", value: "72 kg", icon: "fitness_center" },
    { id: "playingSince", label: "Playing Since", value: "2012", icon: "calendar_today" },
    { id: "languages", label: "Languages", value: "English, Hindi, Gujarati", icon: "translate" },
    { id: "education", label: "Education", value: "BBA, Mumbai University", icon: "school" }
  ],
  skills: [],
  highlights: [
    { icon: "🏆", text: "Man of the Series – State Championship 2023" },
    { icon: "🏏", text: "Highest Score: 152*" },
    { icon: "🎯", text: "Best Bowling: 4/28" },
    { icon: "🇮🇳", text: "Represented India U19" }
  ],
  experience: [
    {
      id: 1,
      team: "Mumbai Warriors",
      role: "All Rounder",
      period: "Jan 2023 – Present",
      description: "Playing in the Premier League. Key all-rounder for the team."
    },
    {
      id: 2,
      team: "Rajasthan Royals Academy",
      role: "Player",
      period: "Jun 2020 – Dec 2022",
      description: "Trained and played in domestic tournaments and development matches."
    },
    {
      id: 3,
      team: "Mumbai U19",
      role: "Captain",
      period: "Aug 2018 – May 2020",
      description: "Led the team in the U19 National Championship."
    }
  ],
  strength: {
    percentage: 85,
    level: "Excellent",
    checklist: [
      { id: 1, text: "Add Your Achievements", completed: true },
      { id: 2, text: "Add Media", completed: true },
      { id: 3, text: "Get Endorsements", completed: true },
      { id: 4, text: "Write About Yourself", completed: false }
    ]
  },
  endorsements: [
    { skill: "Batting", count: 42, avatars: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"] },
    { skill: "Leadership", count: 38, avatars: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"] },
    { skill: "Sportsmanship", count: 35, avatars: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"] },
    { skill: "Team Player", count: 30, avatars: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"] },
    { skill: "Fitness", count: 28, avatars: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"] }
  ],
  media: {
    photos: 128,
    videos: 24,
    items: [
      { id: 1, type: "image", url: "https://images.unsplash.com/photo-1540747737956-3787293a9fc4?w=500&auto=format&fit=crop&q=80", caption: "Match action shot" },
      { id: 2, type: "image", url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&auto=format&fit=crop&q=80", caption: "Batting highlight" },
      { id: 3, type: "image", url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&auto=format&fit=crop&q=80", caption: "Team squad celebration" },
      { id: 4, type: "image", url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=80", caption: "Net session training" }
    ]
  },
  activity: [
    { id: 1, type: "achievement", title: "Posted a new achievement", subtitle: "Man of the match trophy in District Trials", time: "2h ago" },
    { id: 2, type: "media", title: "Shared 4 new match photos", subtitle: "Photos from state cricket cup matches", time: "1d ago" },
    { id: 3, type: "award", title: "Won Player of the Match", subtitle: "Final score: 87 runs off 52 balls against Titans", time: "3d ago" }
  ],
  connections: [
    { name: "Rohit Sharma", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
    { name: "Hardik Pandya", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
    { name: "Shreyas Iyer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
    { name: "Rahul Dravid", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" }
  ],
  teams: [
    { name: "Mumbai Warriors", role: "All Rounder", period: "2023 – Present", logo: "🏆" },
    { name: "India U19", role: "All Rounder", period: "2018 – 2020", logo: "🇮🇳" }
  ],
  tournaments: [
    { name: "State Cricket League 2024", matches: 14, runs: 485, wickets: 19, status: "Winner" },
    { name: "Ranji Trophy 2023", matches: 8, runs: 320, wickets: 8, status: "Semi-finalist" },
    { name: "Challenger Trophy 2023", matches: 5, runs: 190, wickets: 6, status: "Runner-up" }
  ],
  reviews: [
    { id: 1, author: "Rahul Dravid", role: "National Scout / Coach", text: "Arjun shows outstanding work ethic and tactical clarity on the field. His batting acceleration in middle overs and accurate off-breaks make him an invaluable all-rounder asset.", rating: 5, date: "May 2026" },
    { id: 2, author: "Mahela Jayawardene", role: "Club Head Coach", text: "Excellent physical conditioning. Highly cooperative in team setups. Led the field placements during U19 very well.", rating: 4.8, date: "Nov 2025" }
  ],
  posts: []
};

export default function AthleteProfileView() {
  const { user } = useUser();
  const [athlete, setAthlete] = useState(INITIAL_ATHLETE_DATA);
  const [activeTab, setActiveTab] = useState("overview");
  const [isOwner, setIsOwner] = useState(true); // Toggle to simulate Owner vs. Visitor view
  const [isConnected, setIsConnected] = useState(false);
  const [isSupporting, setIsSupporting] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  // Posts states
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  
  // Ref for Avatar Upload
  const avatarInputRef = useRef(null);
  
  // Modals / Editing states
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [editedAbout, setEditedAbout] = useState(athlete.about);

  // Bio details individual edit states
  const [editAge, setEditAge] = useState("");
  const [editHeight, setEditHeight] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editPlayingSince, setEditPlayingSince] = useState("");
  const [editLanguages, setEditLanguages] = useState("");
  const [editEducation, setEditEducation] = useState("");

  // Skills add states
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillPercent, setNewSkillPercent] = useState(80);

  const handleToggleConnect = () => {
    const nextConnected = !isConnected;
    setIsConnected(nextConnected);
    setAthlete(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        connections: nextConnected ? prev.stats.connections + 1 : prev.stats.connections - 1
      }
    }));
  };

  const handleToggleSupport = () => {
    const nextSupporting = !isSupporting;
    setIsSupporting(nextSupporting);
    setAthlete(prev => {
      let currentFollowers = typeof prev.stats.followers === 'number' ? prev.stats.followers : 1205;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          followers: nextSupporting ? currentFollowers + 1 : currentFollowers - 1
        }
      };
    });
  };

  // Achievements edit states
  const [isEditingAchievements, setIsEditingAchievements] = useState(false);
  const [editedAchievements, setEditedAchievements] = useState([]);

  const handleStartEditingAbout = () => {
    setEditedAbout(athlete.about);
    
    const ageObj = athlete.bioDetails.find(d => d.label === "Age");
    setEditAge(ageObj ? ageObj.value : "24");

    const heightObj = athlete.bioDetails.find(d => d.label === "Height");
    setEditHeight(heightObj ? heightObj.value : "5'10\"");

    const weightObj = athlete.bioDetails.find(d => d.label === "Weight");
    setEditWeight(weightObj ? weightObj.value : "72 kg");

    const sinceObj = athlete.bioDetails.find(d => d.label === "Playing Since");
    setEditPlayingSince(sinceObj ? sinceObj.value : "2012");

    const langObj = athlete.bioDetails.find(d => d.label === "Languages");
    setEditLanguages(langObj ? langObj.value : "English, Hindi, Gujarati");

    const eduObj = athlete.bioDetails.find(d => d.label === "Education");
    setEditEducation(eduObj ? eduObj.value : "BBA, Mumbai University");

    setIsEditingAbout(true);
  };

  // Edit Profile Details states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editName, setEditName] = useState(athlete.name);
  const [editRole, setEditRole] = useState(athlete.role);
  const [editLocation, setEditLocation] = useState(athlete.location);
  const [editWebsite, setEditWebsite] = useState(athlete.profileUrl);
  const [editAttributes, setEditAttributes] = useState(athlete.attributes.join(", "));

  // Fetch details on mount or session change
  useEffect(() => {
    async function loadProfile() {
      const activeUserId = user?.id || localStorage.getItem("playure_demo_user_id") || "00000000-0000-0000-0000-000000000001";
      const fallbackName = user?.fullName || localStorage.getItem("playure_demo_user_name") || "Arjun Mehta";
      const data = await fetchUserProfile(activeUserId, fallbackName);
      if (data) {
        let parsedBio = { 
          about: INITIAL_ATHLETE_DATA.about, 
          website: INITIAL_ATHLETE_DATA.profileUrl, 
          attributes: INITIAL_ATHLETE_DATA.attributes 
        };
        try {
          if (data.bio) {
            const parsed = JSON.parse(data.bio);
            if (parsed && typeof parsed === "object") {
              parsedBio = { ...parsedBio, ...parsed };
            }
          }
        } catch (e) {
          if (data.bio) {
            parsedBio.about = data.bio;
          }
        }

        const loadedBioDetails = [
          { id: 1, label: "Age", value: parsedBio.bioDetails?.age || "24", icon: "cake" },
          { id: 2, label: "Height", value: parsedBio.bioDetails?.height || "5'10\"", icon: "straighten" },
          { id: 3, label: "Weight", value: parsedBio.bioDetails?.weight || "72 kg", icon: "fitness_center" },
          { id: 4, label: "Playing Since", value: parsedBio.bioDetails?.playingSince || "2012", icon: "calendar_today" },
          { id: 5, label: "Languages", value: parsedBio.bioDetails?.languages || "English, Hindi, Gujarati", icon: "translate" },
          { id: 6, label: "Education", value: parsedBio.bioDetails?.education || "BBA, Mumbai University", icon: "school" }
        ];

        setAthlete(prev => ({
          ...prev,
          name: data.full_name || prev.name,
          role: data.role || prev.role,
          location: (data.city && data.state) ? `${data.city}, ${data.state}` : prev.location,
          about: parsedBio.about,
          profileUrl: parsedBio.website || prev.profileUrl,
          attributes: parsedBio.attributes || prev.attributes,
          bioDetails: loadedBioDetails,
          skills: parsedBio.skills || [],
          highlights: parsedBio.highlights || prev.highlights,
          experience: parsedBio.experience || prev.experience,
          posts: parsedBio.posts || []
        }));
        setEditedAbout(parsedBio.about);
      }
    }
    loadProfile();
    fetchProfilePosts();
  }, [user]);

  const handleSaveAbout = async () => {
    const updatedBioDetails = [
      { id: 1, label: "Age", value: editAge, icon: "cake" },
      { id: 2, label: "Height", value: editHeight, icon: "straighten" },
      { id: 3, label: "Weight", value: editWeight, icon: "fitness_center" },
      { id: 4, label: "Playing Since", value: editPlayingSince, icon: "calendar_today" },
      { id: 5, label: "Languages", value: editLanguages, icon: "translate" },
      { id: 6, label: "Education", value: editEducation, icon: "school" }
    ];

    setAthlete(prev => ({
      ...prev,
      about: editedAbout,
      bioDetails: updatedBioDetails
    }));
    setIsEditingAbout(false);

    let city = "Bengaluru";
    let state = "India";
    const locParts = athlete.location.split(",");
    if (locParts.length > 0) city = locParts[0].trim();
    if (locParts.length > 1) state = locParts.slice(1).join(",").trim();

    const bioObj = {
      about: editedAbout,
      website: athlete.profileUrl,
      attributes: athlete.attributes,
      bioDetails: {
        age: editAge,
        height: editHeight,
        weight: editWeight,
        playingSince: editPlayingSince,
        languages: editLanguages,
        education: editEducation
      },
      skills: athlete.skills,
      highlights: athlete.highlights,
      experience: athlete.experience,
      posts: athlete.posts || []
    };

    const updatePayload = {
      role: athlete.role,
      city: city,
      state: state,
      bio: JSON.stringify(bioObj)
    };
    const activeUserId = user?.id || localStorage.getItem("playure_demo_user_id") || "00000000-0000-0000-0000-000000000001";
    await updateUserProfile(updatePayload, activeUserId);
  };

  const handleSaveProfileDetails = async (e) => {
    e.preventDefault();
    
    let city = "Bengaluru";
    let state = "India";
    const locParts = editLocation.split(",");
    if (locParts.length > 0) city = locParts[0].trim();
    if (locParts.length > 1) state = locParts.slice(1).join(",").trim();

    const attributesArr = editAttributes
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const ageVal = athlete.bioDetails.find(d => d.label === "Age")?.value || "24";
    const heightVal = athlete.bioDetails.find(d => d.label === "Height")?.value || "5'10\"";
    const weightVal = athlete.bioDetails.find(d => d.label === "Weight")?.value || "72 kg";
    const sinceVal = athlete.bioDetails.find(d => d.label === "Playing Since")?.value || "2012";
    const langVal = athlete.bioDetails.find(d => d.label === "Languages")?.value || "English, Hindi, Gujarati";
    const eduVal = athlete.bioDetails.find(d => d.label === "Education")?.value || "BBA, Mumbai University";

    const bioObj = {
      about: athlete.about,
      website: editWebsite.trim(),
      attributes: attributesArr,
      bioDetails: {
        age: ageVal,
        height: heightVal,
        weight: weightVal,
        playingSince: sinceVal,
        languages: langVal,
        education: eduVal
      },
      skills: athlete.skills,
      highlights: athlete.highlights,
      experience: athlete.experience,
      posts: athlete.posts || []
    };

    const updatePayload = {
      full_name: editName.trim(),
      role: editRole.trim(),
      city: city,
      state: state,
      bio: JSON.stringify(bioObj)
    };

    const activeUserId = user?.id || localStorage.getItem("playure_demo_user_id") || "00000000-0000-0000-0000-000000000001";
    const result = await updateUserProfile(updatePayload, activeUserId);
    if (result && result.status === "success") {
      localStorage.setItem("playure_demo_user_name", updatePayload.full_name);
      setAthlete(prev => ({
        ...prev,
        name: updatePayload.full_name,
        role: updatePayload.role,
        location: `${updatePayload.city}, ${updatePayload.state}`,
        profileUrl: bioObj.website,
        attributes: bioObj.attributes
      }));
      setIsProfileModalOpen(false);
    } else {
      alert("Failed to save profile details in database.");
    }
  };

  const syncSkillsToDB = async (skillsList) => {
    let city = "Bengaluru";
    let state = "India";
    const locParts = athlete.location.split(",");
    if (locParts.length > 0) city = locParts[0].trim();
    if (locParts.length > 1) state = locParts.slice(1).join(",").trim();

    const ageVal = athlete.bioDetails.find(d => d.label === "Age")?.value || "24";
    const heightVal = athlete.bioDetails.find(d => d.label === "Height")?.value || "5'10\"";
    const weightVal = athlete.bioDetails.find(d => d.label === "Weight")?.value || "72 kg";
    const sinceVal = athlete.bioDetails.find(d => d.label === "Playing Since")?.value || "2012";
    const langVal = athlete.bioDetails.find(d => d.label === "Languages")?.value || "English, Hindi, Gujarati";
    const eduVal = athlete.bioDetails.find(d => d.label === "Education")?.value || "BBA, Mumbai University";

    const bioObj = {
      about: athlete.about,
      website: athlete.profileUrl,
      attributes: athlete.attributes,
      bioDetails: {
        age: ageVal,
        height: heightVal,
        weight: weightVal,
        playingSince: sinceVal,
        languages: langVal,
        education: eduVal
      },
      skills: skillsList,
      highlights: athlete.highlights,
      posts: athlete.posts || []
    };

    const updatePayload = {
      role: athlete.role,
      city: city,
      state: state,
      bio: JSON.stringify(bioObj)
    };
    const activeUserId = user?.id || localStorage.getItem("playure_demo_user_id") || "00000000-0000-0000-0000-000000000001";
    await updateUserProfile(updatePayload, activeUserId);
  };

  const handleSaveNewSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    if (athlete.skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      alert("This skill is already listed.");
      return;
    }

    const updatedSkills = [
      ...athlete.skills,
      { name: newSkillName.trim(), percentage: newSkillPercent }
    ];

    setAthlete(prev => ({
      ...prev,
      skills: updatedSkills
    }));
    setIsAddingSkill(false);
    setNewSkillName("");
    setNewSkillPercent(80);

    await syncSkillsToDB(updatedSkills);
  };

  const handleDeleteSkill = async (skillName) => {
    const updatedSkills = athlete.skills.filter(s => s.name !== skillName);
    setAthlete(prev => ({
      ...prev,
      skills: updatedSkills
    }));
    await syncSkillsToDB(updatedSkills);
  };

  const fetchProfilePosts = async () => {
    try {
      const activeUserId = user?.id || localStorage.getItem("playure_demo_user_id") || "00000000-0000-0000-0000-000000000001";
      const headers = {};
      headers["X-User-Id"] = activeUserId;
      const res = await fetch(`http://localhost:8000/api/v1/feed?author_id=${activeUserId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          const mappedPosts = data.items.map(p => ({
            id: p.id,
            title: p.sport || "Update",
            content: p.content,
            date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          }));
          setAthlete(prev => ({
            ...prev,
            posts: mappedPosts
          }));
        }
      }
    } catch (err) {
      console.warn("Failed to fetch profile posts:", err);
    }
  };

  const handleSaveNewPost = async (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    try {
      const activeUserId = user?.id || localStorage.getItem("playure_demo_user_id") || "00000000-0000-0000-0000-000000000001";
      const res = await fetch("http://localhost:8000/api/v1/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": activeUserId
        },
        body: JSON.stringify({
          content: newPostContent.trim(),
          post_type: "normal",
          sport: newPostTitle.trim(),
          visibility: "public"
        })
      });

      if (res.ok) {
        setNewPostTitle("");
        setNewPostContent("");
        setIsAddingPost(false);
        await fetchProfilePosts();
      } else {
        alert("Failed to save post to backend DB");
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const activeUserId = user?.id || localStorage.getItem("playure_demo_user_id") || "00000000-0000-0000-0000-000000000001";
      const res = await fetch(`http://localhost:8000/api/v1/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "X-User-Id": activeUserId
        }
      });
      if (res.ok) {
        await fetchProfilePosts();
      } else {
        alert("Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleStartEditingAchievements = () => {
    setEditedAchievements(athlete.highlights.map(h => ({ ...h })));
    setIsEditingAchievements(true);
  };

  const handleAddAchievementField = () => {
    setEditedAchievements(prev => [...prev, { icon: "🏆", text: "" }]);
  };

  const handleRemoveAchievementField = (index) => {
    setEditedAchievements(prev => prev.filter((_, i) => i !== index));
  };

  const handleAchievementChange = (index, field, value) => {
    setEditedAchievements(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSaveAchievements = async () => {
    const validAchievements = editedAchievements.filter(h => h.text.trim().length > 0);
    setAthlete(prev => ({
      ...prev,
      highlights: validAchievements
    }));
    setIsEditingAchievements(false);

    let city = "Bengaluru";
    let state = "India";
    const locParts = athlete.location.split(",");
    if (locParts.length > 0) city = locParts[0].trim();
    if (locParts.length > 1) state = locParts.slice(1).join(",").trim();

    const ageVal = athlete.bioDetails.find(d => d.label === "Age")?.value || "24";
    const heightVal = athlete.bioDetails.find(d => d.label === "Height")?.value || "5'10\"";
    const weightVal = athlete.bioDetails.find(d => d.label === "Weight")?.value || "72 kg";
    const sinceVal = athlete.bioDetails.find(d => d.label === "Playing Since")?.value || "2012";
    const langVal = athlete.bioDetails.find(d => d.label === "Languages")?.value || "English, Hindi, Gujarati";
    const eduVal = athlete.bioDetails.find(d => d.label === "Education")?.value || "BBA, Mumbai University";

    const bioObj = {
      about: athlete.about,
      website: athlete.profileUrl,
      attributes: athlete.attributes,
      bioDetails: {
        age: ageVal,
        height: heightVal,
        weight: weightVal,
        playingSince: sinceVal,
        languages: langVal,
        education: eduVal
      },
      skills: athlete.skills,
      highlights: validAchievements,
      posts: athlete.posts || []
    };

    const updatePayload = {
      role: athlete.role,
      city: city,
      state: state,
      bio: JSON.stringify(bioObj)
    };
    const activeUserId = user?.id || localStorage.getItem("playure_demo_user_id") || "00000000-0000-0000-0000-000000000001";
    await updateUserProfile(updatePayload, activeUserId);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAthlete(prev => ({
        ...prev,
        avatarUrl: url
      }));
    }
  };
  
  // Experience Form
  const [newExpTeam, setNewExpTeam] = useState("");
  const [newExpRole, setNewExpRole] = useState("");
  const [newExpPeriod, setNewExpPeriod] = useState("");
  const [newExpDesc, setNewExpDesc] = useState("");
  const [editingExpId, setEditingExpId] = useState(null);

  const handleStartAddExperience = () => {
    setNewExpTeam("");
    setNewExpRole("");
    setNewExpPeriod("");
    setNewExpDesc("");
    setEditingExpId(null);
    setIsExperienceModalOpen(true);
  };

  const handleStartEditExperience = (exp) => {
    setNewExpTeam(exp.team);
    setNewExpRole(exp.role);
    setNewExpPeriod(exp.period);
    setNewExpDesc(exp.description);
    setEditingExpId(exp.id);
    setIsExperienceModalOpen(true);
  };

  const handleDeleteExperience = async (expId) => {
    const updatedExp = athlete.experience.filter(e => e.id !== expId);
    setAthlete(prev => ({
      ...prev,
      experience: updatedExp
    }));
    await syncExperienceToDB(updatedExp);
  };

  const syncExperienceToDB = async (expList) => {
    let city = "Bengaluru";
    let state = "India";
    const locParts = athlete.location.split(",");
    if (locParts.length > 0) city = locParts[0].trim();
    if (locParts.length > 1) state = locParts.slice(1).join(",").trim();

    const ageVal = athlete.bioDetails.find(d => d.label === "Age")?.value || "24";
    const heightVal = athlete.bioDetails.find(d => d.label === "Height")?.value || "5'10\"";
    const weightVal = athlete.bioDetails.find(d => d.label === "Weight")?.value || "72 kg";
    const sinceVal = athlete.bioDetails.find(d => d.label === "Playing Since")?.value || "2012";
    const langVal = athlete.bioDetails.find(d => d.label === "Languages")?.value || "English, Hindi, Gujarati";
    const eduVal = athlete.bioDetails.find(d => d.label === "Education")?.value || "BBA, Mumbai University";

    const bioObj = {
      about: athlete.about,
      website: athlete.profileUrl,
      attributes: athlete.attributes,
      bioDetails: {
        age: ageVal,
        height: heightVal,
        weight: weightVal,
        playingSince: sinceVal,
        languages: langVal,
        education: eduVal
      },
      skills: athlete.skills,
      highlights: athlete.highlights,
      experience: expList,
      posts: athlete.posts || []
    };

    const updatePayload = {
      role: athlete.role,
      city: city,
      state: state,
      bio: JSON.stringify(bioObj)
    };
    const activeUserId = user?.id || localStorage.getItem("playure_demo_user_id") || "00000000-0000-0000-0000-000000000001";
    await updateUserProfile(updatePayload, activeUserId);
  };

  const handleSaveExperienceForm = async (e) => {
    e.preventDefault();
    if (!newExpTeam.trim() || !newExpRole.trim()) return;

    let updatedExp = [];
    if (editingExpId) {
      updatedExp = athlete.experience.map(exp => {
        if (exp.id === editingExpId) {
          return {
            ...exp,
            team: newExpTeam.trim(),
            role: newExpRole.trim(),
            period: newExpPeriod.trim() || "Present",
            description: newExpDesc.trim()
          };
        }
        return exp;
      });
    } else {
      const newEntry = {
        id: Date.now(),
        team: newExpTeam.trim(),
        role: newExpRole.trim(),
        period: newExpPeriod.trim() || "Present",
        description: newExpDesc.trim()
      };
      updatedExp = [newEntry, ...athlete.experience];
    }

    setAthlete(prev => ({
      ...prev,
      experience: updatedExp
    }));

    setNewExpTeam("");
    setNewExpRole("");
    setNewExpPeriod("");
    setNewExpDesc("");
    setEditingExpId(null);
    setIsExperienceModalOpen(false);

    await syncExperienceToDB(updatedExp);
  };


  const getSkillEndorsementsList = () => {
    return athlete.skills.map(s => {
      const count = s.count !== undefined ? s.count : 0;
      return {
        skill: s.name,
        count: count,
        avatars: s.avatars || []
      };
    });
  };

  const handleEndorseSkill = async (skillName) => {
    const updatedSkills = athlete.skills.map(s => {
      if (s.name.toLowerCase() === skillName.toLowerCase()) {
        const currentCount = s.count !== undefined ? s.count : 0;
        return {
          ...s,
          count: currentCount + 1,
          avatars: s.avatars || []
        };
      }
      return s;
    });

    setAthlete(prev => ({
      ...prev,
      skills: updatedSkills
    }));

    await syncSkillsToDB(updatedSkills);
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "about", label: "About" },
    { id: "stats", label: "Stats" },
    { id: "experience", label: "Experience" },
    { id: "achievements", label: "Achievements" },
    { id: "endorsements", label: "Endorsements" },
    { id: "reviews", label: "Reviews" }
  ];

  return (
    <div className="w-full bg-[#090F1E] text-gray-100 flex flex-col font-['Inter',sans-serif] selection:bg-[#00f0ff] selection:text-black">
      
      {/* Simulation Toolbar Overlay */}
      <div className="w-full bg-[#111318] border-b border-white/5 px-6 py-2 flex items-center justify-between text-xs text-[#b9cacb] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
          <span>Interactive Prototype Mode</span>
        </div>
        <div className="flex items-center gap-3">
          <span>View Profile As:</span>
          <div className="flex bg-[#1e2024] rounded-lg p-0.5 border border-white/10">
            <button 
              onClick={() => setIsOwner(true)} 
              className={`px-3 py-1 rounded-md transition-all font-semibold cursor-pointer ${isOwner ? "bg-[#00f0ff] text-[#002022]" : "hover:text-white"}`}
            >
              Owner
            </button>
            <button 
              onClick={() => setIsOwner(false)} 
              className={`px-3 py-1 rounded-md transition-all font-semibold cursor-pointer ${!isOwner ? "bg-[#00f0ff] text-[#002022]" : "hover:text-white"}`}
            >
              Visitor
            </button>
          </div>
        </div>
      </div>

      {/* 2. PROFILE HERO DETAIL CARD */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 mt-6 relative z-10">
        <div className="bg-[#161B22]/70 backdrop-blur-xl border border-white/10 !p-8 sm:!p-10 lg:!p-12 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center !gap-8 md:!gap-12">
            
            {/* Left Column: Avatar + Profile Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start !gap-8 text-center sm:text-left">
              
              {/* Avatar Box with Glow */}
              <div className="relative shrink-0">
                <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rounded-full p-1 bg-gradient-to-tr from-[#00f0ff] via-[#00f0ff]/30 to-[#090F1E] shadow-[0_0_25px_rgba(0,240,255,0.35)] overflow-hidden">
                  <img 
                    src={athlete.avatarUrl} 
                    alt={user?.fullName || athlete.name} 
                    className="w-full h-full object-cover rounded-full" 
                  />
                </div>
                {/* Add/Edit Profile Image Button */}
                {isOwner && (
                  <>
                    <input 
                      type="file"
                      ref={avatarInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button 
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute bottom-1.5 right-1.5 w-9 h-9 rounded-full bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] border-2 border-[#161B22] flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer"
                      title="Upload Profile Image"
                      style={{ padding: '0px' }}
                    >
                      <span className="material-symbols-outlined text-base">photo_camera</span>
                    </button>
                  </>
                )}
              </div>

              {/* Identity & Tags */}
              <div className="flex-1 mt-2">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white font-['Hanken_Grotesk'] tracking-tight">
                    {user?.fullName || athlete.name}
                  </h1>
                  
                  {/* Verification Tooltip System */}
                  <div className="relative group cursor-pointer">
                    <span className="material-symbols-outlined text-[#00f0ff] fill-[#00f0ff]/10 text-[22px]">verified</span>
                    {/* Tooltip Popup */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-30 w-52 p-3 bg-[#111318] border border-white/10 rounded-xl shadow-2xl scale-0 group-hover:scale-100 transition-all origin-bottom text-xs leading-relaxed pointer-events-none">
                      <div className="font-bold text-[#00f0ff] border-b border-white/5 pb-1 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified Athlete</span>
                      </div>
                      <div className="space-y-1 text-gray-300 font-medium">
                        <div className="flex items-center gap-1">✓ Identity Verified</div>
                        <div className="flex items-center gap-1">✓ Team Verified</div>
                        <div className="flex items-center gap-1">✓ Achievements Verified</div>
                        <div className="flex items-center gap-1">✓ Coach Verified</div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-semibold text-[#00f0ff] uppercase tracking-wider !mt-2.5 font-['Hanken_Grotesk']">
                  {athlete.role}
                </p>

                <div className="flex items-center justify-center sm:justify-start !gap-x-6 !gap-y-2.5 text-xs text-[#b9cacb] !mt-3.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00f0ff]" />
                    {athlete.location}
                  </span>
                  <span className="flex items-center gap-1 text-[#00f0ff]/70 hover:text-[#00f0ff] transition-colors cursor-pointer">
                    <Globe className="w-3.5 h-3.5" />
                    {athlete.profileUrl}
                  </span>
                </div>

                {/* Attributes Tags Grid */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start !gap-x-3.5 !gap-y-2.5 !mt-5">
                  {athlete.attributes.map((attr) => (
                    <span 
                      key={attr} 
                      className="!px-3.5 !py-1.5 bg-[#1e2024]/75 border border-white/10 rounded-full text-[10px] sm:text-xs font-bold text-gray-200 font-['Inter'] shadow-inner"
                    >
                      {attr}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start !gap-x-4 !gap-y-3 !mt-6.5">
                  {isOwner ? (
                    <button 
                      onClick={() => {
                        setEditName(athlete.name);
                        setEditRole(athlete.role);
                        setEditLocation(athlete.location);
                        setEditWebsite(athlete.profileUrl);
                        setEditAttributes(athlete.attributes.join(", "));
                        setIsProfileModalOpen(true);
                      }}
                      className="!px-6 !py-3 bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer font-['Hanken_Grotesk'] flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                      <span>Edit Details</span>
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={handleToggleConnect}
                        className={`!px-6 !py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer font-['Hanken_Grotesk'] flex items-center gap-2 ${
                          isConnected 
                            ? "bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff]" 
                            : "bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                        }`}
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{isConnected ? "Teamed Up" : "Team Up"}</span>
                      </button>

                      <button 
                        onClick={handleToggleSupport}
                        className={`!px-6 !py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer font-['Hanken_Grotesk'] flex items-center gap-2 ${
                          isSupporting 
                            ? "bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff]" 
                            : "bg-[#1e2024] hover:bg-[#333539] border border-white/10 text-white"
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[15px] ${isSupporting ? "text-[#00f0ff]" : "text-gray-400"}`}>favorite</span>
                        <span>{isSupporting ? "Supporting" : "Support"}</span>
                      </button>
                    </>
                  )}

                  {!isOwner && (
                    <button className="!px-6 !py-3 bg-[#1e2024] hover:bg-[#333539] border border-white/10 rounded-full font-bold text-xs uppercase tracking-wider text-white transition-all cursor-pointer font-['Hanken_Grotesk'] flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#b9cacb]" />
                      <span>Message</span>
                    </button>
                  )}

                  <div className="relative">
                    <button 
                      onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                      className="!px-5 !py-3 bg-[#1e2024] hover:bg-[#333539] border border-white/10 rounded-full font-bold text-xs uppercase tracking-wider text-white transition-all cursor-pointer font-['Hanken_Grotesk'] flex items-center gap-1.5"
                    >
                      <span>More</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {isMoreMenuOpen && (
                      <div className="absolute right-0 mt-2 z-20 w-44 bg-[#111318] border border-white/10 rounded-xl shadow-2xl p-1.5 text-xs text-[#e2e2e8]">
                        <button onClick={() => { alert("Saved PDF Sports Resume!"); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-[#333539] rounded-lg">Export Sports CV</button>
                        <button onClick={() => { alert("Reported user profile"); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-[#333539] text-[#ffb4ab] rounded-lg">Report Profile</button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Key Metrics */}
            <div className="w-full lg:w-auto flex items-center justify-around lg:justify-end border-t lg:border-t-0 border-white/5 pt-5 lg:pt-0">
              
              {/* Metrics Row */}
              <div className="flex flex-row items-center gap-8 md:gap-12 text-center sm:text-left">
                <div>
                  <span className="text-[11px] text-[#b9cacb] uppercase tracking-wider block font-bold">Athlete Network</span>
                  <span className="text-xl font-extrabold text-[#00f0ff] font-['JetBrains_Mono'] block mt-0.5">{athlete.stats.connections} athletes</span>
                </div>
                <div className="h-8 w-px bg-white/10 hidden sm:block" />
                <div>
                  <span className="text-[11px] text-[#b9cacb] uppercase tracking-wider block font-bold">Supporters</span>
                  <span className="text-xl font-extrabold text-[#00f0ff] font-['JetBrains_Mono'] block mt-0.5">
                    {typeof athlete.stats.followers === 'number' ? athlete.stats.followers.toLocaleString() : athlete.stats.followers}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* 3. TABS STICKY BAR */}
      <div className="sticky top-[64px] z-40 w-full bg-[#090F1E]/90 backdrop-blur-md border-b border-white/10 mt-6 flex justify-center">
        <div className="max-w-[1400px] w-full px-4 sm:px-6 flex overflow-x-auto no-scrollbar py-0.5 gap-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer relative transition-all ${
                  isActive ? "text-[#00f0ff]" : "text-[#b9cacb] hover:text-[#00f0ff]"
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabGlow"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]" 
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. CONTENT GRID CONTROLLER */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* VIEW 1: OVERVIEW & ABOUT DASHBOARD (Standard 3-Column layout) */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: About, Skills (3 Columns) */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* About card */}
              <div className="bg-[#161B22]/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#00f0ff]/30 transition-all !mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00f0ff] text-lg">info</span>
                    <span>About</span>
                  </h3>
                  {isOwner && (
                    <button 
                      onClick={handleStartEditingAbout}
                      className="p-1 rounded-md text-[#b9cacb] hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                  )}
                </div>

                {isEditingAbout ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Bio / About Description</label>
                      <textarea 
                        value={editedAbout}
                        onChange={(e) => setEditedAbout(e.target.value)}
                        rows={4}
                        className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] leading-relaxed resize-none font-['Inter']"
                        style={{ padding: '12px 14px' }}
                      />
                    </div>

                    <div className="grid grid-cols-2 !gap-x-4 !gap-y-4 !mt-4.5">
                      <div>
                        <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Age</label>
                        <input
                          type="text"
                          value={editAge}
                          onChange={(e) => setEditAge(e.target.value)}
                          className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                          style={{ padding: '10px 14px' }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Height</label>
                        <input
                          type="text"
                          value={editHeight}
                          onChange={(e) => setEditHeight(e.target.value)}
                          className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                          style={{ padding: '10px 14px' }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Weight</label>
                        <input
                          type="text"
                          value={editWeight}
                          onChange={(e) => setEditWeight(e.target.value)}
                          className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                          style={{ padding: '10px 14px' }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Playing Since</label>
                        <input
                          type="text"
                          value={editPlayingSince}
                          onChange={(e) => setEditPlayingSince(e.target.value)}
                          className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                          style={{ padding: '10px 14px' }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Languages</label>
                        <input
                          type="text"
                          value={editLanguages}
                          onChange={(e) => setEditLanguages(e.target.value)}
                          className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                          style={{ padding: '10px 14px' }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Education</label>
                        <input
                          type="text"
                          value={editEducation}
                          onChange={(e) => setEditEducation(e.target.value)}
                          className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                          style={{ padding: '10px 14px' }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3.5 !mt-5 pt-4 border-t border-white/5">
                      <button onClick={() => setIsEditingAbout(false)} className="bg-white/5 hover:bg-white/10 rounded-md text-[10px] font-bold cursor-pointer transition-colors" style={{ padding: '8px 16px' }}>Cancel</button>
                      <button onClick={handleSaveAbout} className="bg-[#00f0ff] hover:bg-[#00dbe9] text-black rounded-md text-[10px] font-bold cursor-pointer transition-colors shadow-[0_0_8px_rgba(0,240,255,0.2)]" style={{ padding: '8px 16px' }}>Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-300 leading-relaxed font-['Inter']">
                      {athlete.about}
                    </p>

                    {/* BIO FIELDS GRID */}
                    <div className="border-t border-white/5 mt-5 pt-5 flex flex-col !gap-4.5">
                      {athlete.bioDetails.map((detail) => (
                        <div key={detail.id} className="flex items-center !gap-4.5 !py-1">
                          <div className="w-9 h-9 rounded-xl bg-[#111318]/80 border border-white/10 flex items-center justify-center text-[#00f0ff] shadow-md shrink-0">
                            <span className="material-symbols-outlined text-lg">{detail.icon}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#b9cacb]/80 uppercase tracking-wider block font-bold leading-none">{detail.label}</span>
                            <span className="text-xs text-white font-semibold block leading-normal">{detail.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Skills card */}
              <div className="bg-[#161B22]/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#00f0ff]/30 transition-all !mt-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00f0ff] text-lg">bolt</span>
                    <span>Skills</span>
                  </h3>
                  {isOwner && !isAddingSkill && (
                    <button 
                      onClick={() => {
                        setNewSkillName("");
                        setNewSkillPercent(80);
                        setIsAddingSkill(true);
                      }}
                      className="p-1 rounded-md text-[#00f0ff] hover:text-white hover:bg-white/5 cursor-pointer flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>Add</span>
                    </button>
                  )}
                </div>

                {isAddingSkill && (
                  <form onSubmit={handleSaveNewSkill} className="p-3.5 bg-[#111318]/50 border border-white/5 rounded-xl space-y-3.5 mb-4">
                    <div>
                      <label className="text-[9px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Skill Name</label>
                      <input
                        type="text"
                        required
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        placeholder="e.g. Batting, Wicketkeeping"
                        className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                        style={{ padding: '10px 14px' }}
                      />
                    </div>
                    <div className="!mt-4.5">
                      <label className="text-[9px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Proficiency ({newSkillPercent}%)</label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={newSkillPercent}
                        onChange={(e) => setNewSkillPercent(Number(e.target.value))}
                        className="w-full accent-[#00f0ff] cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-end gap-3 !mt-5 pt-3.5 border-t border-white/5">
                      <button 
                        type="button" 
                        onClick={() => setIsAddingSkill(false)} 
                        className="bg-white/5 hover:bg-white/10 rounded-md text-[9px] font-bold cursor-pointer transition-colors"
                        style={{ padding: '8px 16px' }}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="bg-[#00f0ff] hover:bg-[#00dbe9] text-black rounded-md text-[9px] font-bold cursor-pointer transition-colors shadow-[0_0_6px_rgba(0,240,255,0.2)]"
                        style={{ padding: '8px 16px' }}
                      >
                        Add
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {athlete.skills.length === 0 && !isAddingSkill && (
                    <p className="text-xs text-gray-500 italic py-2 text-center">No skills added yet.</p>
                  )}
                  {athlete.skills.map((skill) => (
                    <div key={skill.name} className="group/item relative pr-6">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-semibold text-gray-300">{skill.name}</span>
                        <span className="font-bold text-[#00f0ff] font-['JetBrains_Mono']">{skill.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 border border-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#005c61] to-[#00f0ff] rounded-full shadow-[0_0_8px_rgba(0,240,255,0.4)]" 
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                      {isOwner && (
                        <button 
                          onClick={() => handleDeleteSkill(skill.name)}
                          className="absolute right-0 top-0.5 opacity-0 group-hover/item:opacity-100 p-0.5 rounded text-red-400 hover:text-red-500 hover:bg-white/5 cursor-pointer transition-all"
                          title="Delete Skill"
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* CENTER COLUMN: Highlights, Experience (6 Columns) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Career Achievements Card */}
              <div className="bg-[#161B22]/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#00f0ff]/30 transition-all flex flex-col md:flex-row justify-between gap-6 !mb-6">
                
                {isEditingAchievements ? (
                  <div className="space-y-4 w-full">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#00f0ff] text-lg">military_tech</span>
                        <span>Edit Career Achievements</span>
                      </h3>
                    </div>

                    <div className="flex flex-col !gap-3.5 max-h-[300px] overflow-y-auto pr-1">
                      {editedAchievements.map((ach, index) => (
                        <div key={index} className="flex items-center gap-2.5 p-3.5 bg-[#111318]/50 border border-white/5 rounded-xl">
                          <input
                            type="text"
                            value={ach.text}
                            onChange={(e) => handleAchievementChange(index, "text", e.target.value)}
                            placeholder="e.g. Represented India U19"
                            className="flex-1 bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                            style={{ padding: '10px 14px' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveAchievementField(index)}
                            className="p-2.5 rounded-lg text-red-400 hover:text-red-500 hover:bg-white/5 cursor-pointer transition-colors"
                            title="Remove Achievement"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddAchievementField}
                      className="w-full py-2.5 border border-dashed border-[#00f0ff]/30 hover:border-[#00f0ff] rounded-xl text-xs font-bold text-[#00f0ff] hover:bg-[#00f0ff]/5 transition-colors cursor-pointer flex items-center justify-center gap-1.5 !mt-4"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>Add New Achievement</span>
                    </button>

                    <div className="flex justify-end gap-3.5 !mt-5 pt-3.5 border-t border-white/5">
                      <button onClick={() => setIsEditingAchievements(false)} className="bg-white/5 hover:bg-white/10 rounded-md text-[10px] font-bold cursor-pointer transition-colors" style={{ padding: '8px 16px' }}>Cancel</button>
                      <button onClick={handleSaveAchievements} className="bg-[#00f0ff] hover:bg-[#00dbe9] text-black rounded-md text-[10px] font-bold cursor-pointer transition-colors shadow-[0_0_8px_rgba(0,240,255,0.2)]" style={{ padding: '8px 16px' }}>Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* List Items */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#00f0ff] text-lg">military_tech</span>
                          <span>Career Achievements</span>
                        </h3>
                        {isOwner && (
                          <button 
                            onClick={handleStartEditingAchievements}
                            className="p-1 rounded-md text-[#b9cacb] hover:text-white hover:bg-white/5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col gap-3.5">
                        {athlete.highlights.length === 0 && (
                          <p className="text-xs text-gray-500 italic py-2">No achievements added yet.</p>
                        )}
                        {athlete.highlights.map((h, i) => (
                          <div key={i} className="flex items-center !py-2.5 !px-4 bg-[#111318]/40 border border-white/5 rounded-xl hover:border-[#00f0ff]/20 hover:bg-[#111318]/60 transition-all">
                            <span className="text-xs sm:text-sm font-bold text-gray-200 leading-normal">{h.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Trophy Graphic */}
                    <div className="w-36 h-36 border border-white/5 bg-[#111318]/50 rounded-xl p-2 flex items-center justify-center self-center shrink-0 shadow-inner relative overflow-hidden group-hover:border-[#00f0ff]/20 transition-all">
                      <img 
                        src="/trophy.png" 
                        alt="Golden Trophy Award" 
                        className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,240,255,0.25)] transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#00f0ff]/10 to-transparent h-1/3 pointer-events-none" />
                    </div>
                  </>
                )}

              </div>

              {/* Experience Card */}
              <div className="bg-[#161B22]/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#00f0ff]/30 transition-all !mt-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00f0ff] text-lg">history</span>
                    <span>Experience</span>
                  </h3>
                  {isOwner && (
                    <button 
                      onClick={handleStartAddExperience}
                      className="flex items-center gap-1 px-3 py-1 border border-[#00f0ff]/30 hover:border-[#00f0ff] hover:bg-[#00f0ff]/5 rounded-full text-[10px] font-bold text-[#00f0ff] uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Experience</span>
                    </button>
                  )}
                </div>

                {/* Experience Timeline */}
                <div className="flex flex-col !gap-y-4 !mt-5">
                  {athlete.experience.length === 0 && (
                    <p className="text-xs text-gray-500 italic py-2">No experience added yet.</p>
                  )}
                  {athlete.experience.map((exp) => (
                    <div key={exp.id} className="relative group/item p-4.5 bg-[#111318]/40 border border-white/5 rounded-xl hover:border-[#00f0ff]/20 hover:bg-[#111318]/60 transition-all !mb-4.5 last:!mb-0">
                      <div className="flex items-start gap-4">
                        {/* Mock Logo Box */}
                        <div className="w-10 h-10 rounded-lg bg-[#333539] border border-white/10 flex items-center justify-center text-lg shadow-md shrink-0 uppercase font-black text-gray-400">
                          {exp.team.charAt(0)}
                        </div>

                        <div className="flex-1 min-w-0 pr-10">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                            <h4 className="text-xs sm:text-sm font-extrabold text-white font-['Hanken_Grotesk'] leading-tight">
                              {exp.team}
                            </h4>
                            <span className="text-[10px] font-medium text-[#b9cacb]/80 whitespace-nowrap">
                              {exp.period}
                            </span>
                          </div>

                          <p className="text-[11px] font-bold text-[#00f0ff] tracking-wide uppercase mt-1">
                            {exp.role}
                          </p>

                          <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">
                            {exp.description}
                          </p>
                        </div>
                      </div>

                      {isOwner && (
                        <div className="absolute right-3.5 top-3.5 opacity-0 group-hover/item:opacity-100 flex items-center !gap-x-3.5 transition-all">
                          <button 
                            onClick={() => handleStartEditExperience(exp)}
                            className="p-1.5 rounded text-[#b9cacb] hover:text-[#00f0ff] hover:bg-white/5 cursor-pointer"
                            title="Edit Experience"
                          >
                            <span className="material-symbols-outlined text-[15px]">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteExperience(exp.id)}
                            className="p-1.5 rounded text-red-400 hover:text-red-500 hover:bg-white/5 cursor-pointer"
                            title="Delete Experience"
                          >
                            <span className="material-symbols-outlined text-[15px]">delete</span>
                          </button>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>

              {/* Posts Card */}
              <div className="bg-[#161B22]/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#00f0ff]/30 transition-all !mt-6 animate-fadeIn">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00f0ff] text-lg">feed</span>
                    <span>Posts</span>
                  </h3>
                  {isOwner && !isAddingPost && (
                    <button 
                      onClick={() => setIsAddingPost(true)}
                      className="flex items-center gap-1 px-3 py-1 border border-[#00f0ff]/30 hover:border-[#00f0ff] hover:bg-[#00f0ff]/5 rounded-full text-[10px] font-bold text-[#00f0ff] uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Post</span>
                    </button>
                  )}
                </div>

                {isAddingPost && (
                  <form onSubmit={handleSaveNewPost} className="space-y-4 bg-[#111318]/30 border border-white/5 p-4 rounded-xl mb-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Post Title</label>
                      <input 
                        type="text" 
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        placeholder="e.g. Match Highlights, Training Session"
                        className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                        style={{ padding: '10px 14px' }}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Post Content</label>
                      <textarea 
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="What's on your mind? Share updates, matches, achievements..."
                        rows={3}
                        className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] resize-none font-['Inter'] leading-relaxed"
                        style={{ padding: '12px 14px' }}
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setIsAddingPost(false)} className="bg-white/5 hover:bg-white/10 rounded-md text-[10px] font-bold px-4 py-2 cursor-pointer transition-colors text-white">Cancel</button>
                      <button type="submit" className="bg-[#00f0ff] hover:bg-[#00dbe9] text-black rounded-md text-[10px] font-bold px-4 py-2 cursor-pointer transition-colors shadow-[0_0_8px_rgba(0,240,255,0.2)]">Publish</button>
                    </div>
                  </form>
                )}

                {/* Posts List */}
                <div className="flex flex-col !gap-y-4 !mt-5">
                  {(!athlete.posts || athlete.posts.length === 0) ? (
                    <p className="text-xs text-gray-500 italic py-2 text-center">no post</p>
                  ) : (
                    athlete.posts.map((post) => (
                      <div key={post.id} className="relative group/post p-4.5 bg-[#111318]/40 border border-white/5 rounded-xl hover:border-[#00f0ff]/20 hover:bg-[#111318]/60 transition-all">
                        <div className="flex items-start gap-4">
                          {/* User Avatar */}
                          <img 
                            src={athlete.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"} 
                            alt={athlete.name} 
                            className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0" 
                          />
                          <div className="flex-1 min-w-0 animate-fadeIn">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h4 className="text-xs sm:text-sm font-extrabold text-white font-['Hanken_Grotesk'] leading-tight">{athlete.name}</h4>
                                <span className="text-[10px] font-medium text-[#b9cacb]/60 block mt-0.5">{post.date}</span>
                              </div>
                              {isOwner && (
                                <button 
                                  onClick={() => handleDeletePost(post.id)}
                                  className="p-1 rounded text-red-400 hover:text-red-500 hover:bg-white/5 cursor-pointer opacity-0 group-hover/post:opacity-100 transition-opacity"
                                  title="Delete Post"
                                >
                                  <span className="material-symbols-outlined text-[15px]">delete</span>
                                </button>
                              )}
                            </div>
                            <h5 className="text-xs sm:text-sm font-bold text-[#00f0ff] mt-3">{post.title}</h5>
                            <p className="text-xs text-gray-300 mt-1.5 leading-relaxed whitespace-pre-line font-['Inter']">{post.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Stats, Endorsements, Media, Activity, Connections, Teams (3 Columns) */}
            <div className="lg:col-span-3 space-y-6">
              


              {/* Endorsements Card */}
              <div className="bg-[#161B22]/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#00f0ff]/30 transition-all !mb-6">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00f0ff] text-lg">thumb_up</span>
                  <span>Top Endorsements</span>
                </h3>
                <div className="flex flex-col !gap-y-3 mt-3.5">
                  {getSkillEndorsementsList().slice(0, 3).map((item) => (
                    <div key={item.skill} className="flex items-center justify-between gap-3 !py-2.5 !px-3.5 bg-[#111318]/40 border border-white/5 rounded-xl hover:border-[#00f0ff]/10 hover:bg-[#111318]/60 transition-all">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white leading-none">{item.skill}</span>
                          <span className="text-[10px] font-bold text-[#00f0ff] font-['JetBrains_Mono'] leading-none">({item.count})</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleEndorseSkill(item.skill)}
                        className="bg-[#1e2024] hover:bg-[#333539] hover:text-[#00f0ff] border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all"
                        style={{ padding: '6px 12px' }}
                      >
                        Endorse
                      </button>
                    </div>
                  ))}
                  {athlete.skills.length === 0 && (
                    <p className="text-xs text-gray-500 italic py-2">Add skills to see endorsements.</p>
                  )}
                </div>
              </div>





              {/* Connections Card */}
              <div className="bg-[#161B22]/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#00f0ff]/30 transition-all !mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00f0ff] text-lg">group</span>
                    <span>Connections</span>
                  </h3>
                  <button onClick={() => alert("Redirect to Network view")} className="text-[11px] text-[#00f0ff] hover:underline font-bold uppercase tracking-wider cursor-pointer">
                    View all
                  </button>
                </div>
                <div className="flex items-center !gap-x-[18px] !gap-y-3 flex-wrap mt-5">
                  {athlete.connections.map((c) => (
                    <img key={c.name} src={c.avatar} alt={c.name} title={c.name} className="w-10 h-10 rounded-full object-cover border border-white/10 hover:scale-105 transition-transform cursor-pointer" />
                  ))}
                  <div className="w-10 h-10 rounded-full bg-[#1e2024] border border-white/10 flex items-center justify-center text-xs font-bold text-[#b9cacb] cursor-pointer hover:border-white/30 transition-colors">
                    +21
                  </div>
                </div>
              </div>



            </div>

          </div>
        )}

        {/* VIEW 2: ABOUT TAB */}
        {activeTab === "about" && (
          <div className="max-w-4xl mx-auto bg-[#161B22]/60 border border-white/10 rounded-2xl p-6 md:p-8 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Biography</h3>
              {isOwner && !isEditingAbout && (
                <button 
                  onClick={handleStartEditingAbout}
                  className="p-1.5 rounded-md text-[#b9cacb] hover:text-white hover:bg-white/5 cursor-pointer flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>Edit</span>
                </button>
              )}
            </div>

            {isEditingAbout ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Bio / About Description</label>
                  <textarea 
                    value={editedAbout}
                    onChange={(e) => setEditedAbout(e.target.value)}
                    rows={4}
                    className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] leading-relaxed resize-none font-['Inter']"
                    style={{ padding: '12px 14px' }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 !gap-x-6 !gap-y-4 !mt-4.5">
                  <div>
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Age</label>
                    <input
                      type="text"
                      value={editAge}
                      onChange={(e) => setEditAge(e.target.value)}
                      className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                      style={{ padding: '10px 14px' }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Height</label>
                    <input
                      type="text"
                      value={editHeight}
                      onChange={(e) => setEditHeight(e.target.value)}
                      className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                      style={{ padding: '10px 14px' }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Weight</label>
                    <input
                      type="text"
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                      style={{ padding: '10px 14px' }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Playing Since</label>
                    <input
                      type="text"
                      value={editPlayingSince}
                      onChange={(e) => setEditPlayingSince(e.target.value)}
                      className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                      style={{ padding: '10px 14px' }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Languages</label>
                    <input
                      type="text"
                      value={editLanguages}
                      onChange={(e) => setEditLanguages(e.target.value)}
                      className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                      style={{ padding: '10px 14px' }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Education</label>
                    <input
                      type="text"
                      value={editEducation}
                      onChange={(e) => setEditEducation(e.target.value)}
                      className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                      style={{ padding: '10px 14px' }}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3.5 !mt-6 pt-4 border-t border-white/5">
                  <button onClick={() => setIsEditingAbout(false)} className="bg-white/5 hover:bg-white/10 rounded-md text-[10px] font-bold cursor-pointer transition-colors" style={{ padding: '8px 16px' }}>Cancel</button>
                  <button onClick={handleSaveAbout} className="bg-[#00f0ff] hover:bg-[#00dbe9] text-black rounded-md text-[10px] font-bold cursor-pointer transition-colors shadow-[0_0_8px_rgba(0,240,255,0.2)]" style={{ padding: '8px 16px' }}>Save</button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {athlete.about}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t border-white/5 pt-6">
                  {athlete.bioDetails.map((detail) => (
                    <div key={detail.id} className="flex items-center gap-4 bg-[#111318]/50 border border-white/5 p-4 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-[#1e2024] border border-white/10 flex items-center justify-center text-[#00f0ff] shrink-0">
                        <span className="material-symbols-outlined text-lg">{detail.icon}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#b9cacb] uppercase tracking-wider font-bold block">{detail.label}</span>
                        <span className="text-sm text-white font-bold block mt-1">{detail.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* VIEW 3: PERFORMANCE STATS TAB */}
        {activeTab === "stats" && (
          <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
            
            {/* Player Rating Box */}
            <div className="bg-[#161B22]/60 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left flex-1">
                <span className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider block font-['Hanken_Grotesk']">Scout Consensus Rating</span>
                <h3 className="text-2xl font-black text-white font-['Hanken_Grotesk'] mt-1">Class-A Athletic Performance Profile</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-xl">
                  Verified rating generated from past 12 months tournament results, strike rates, bowling accuracy, fitness scores, and coach reviews.
                </p>
              </div>

              {/* Rating Ring */}
              <div className="w-32 h-32 bg-[#111318]/85 border border-[#00f0ff]/30 rounded-full flex flex-col items-center justify-center shadow-inner relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-radial-glow opacity-10 blur-xl pointer-events-none" />
                <span className="text-4xl font-extrabold text-[#00f0ff] font-['JetBrains_Mono']">8.5</span>
                <span className="text-[9px] text-[#00ff41] font-black uppercase tracking-widest mt-1">Excellent</span>
              </div>
            </div>

            {/* Sub Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Fitness Scores Card */}
              <div className="bg-[#161B22]/60 border border-white/10 rounded-2xl p-5">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-[#00f0ff]" />
                  <span>Fitness & Endurance</span>
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-gray-300 font-semibold">VO2 Max Score</span>
                      <span className="text-white font-bold font-['JetBrains_Mono']">92%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00f0ff]" style={{ width: "92%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-gray-300 font-semibold">Sprint Speed (100m)</span>
                      <span className="text-white font-bold font-['JetBrains_Mono']">88%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00f0ff]" style={{ width: "88%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-gray-300 font-semibold">Agility Score</span>
                      <span className="text-white font-bold font-['JetBrains_Mono']">94%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00f0ff]" style={{ width: "94%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tournament History Table */}
              <div className="bg-[#161B22]/60 border border-white/10 rounded-2xl p-5 md:col-span-2">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#00f0ff]" />
                  <span>Tournament performance History</span>
                </h4>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[#b9cacb] uppercase font-bold tracking-wider">
                        <th className="py-2 pb-3">Tournament</th>
                        <th className="py-2 pb-3 text-center">Matches</th>
                        <th className="py-2 pb-3 text-center">Runs</th>
                        <th className="py-2 pb-3 text-center">Wickets</th>
                        <th className="py-2 pb-3 text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-semibold text-gray-200">
                      {athlete.tournaments.map((t, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 font-bold text-white">{t.name}</td>
                          <td className="py-3 text-center">{t.matches}</td>
                          <td className="py-3 text-center font-['JetBrains_Mono']">{t.runs}</td>
                          <td className="py-3 text-center font-['JetBrains_Mono']">{t.wickets}</td>
                          <td className="py-3 text-right text-[#00f0ff]">{t.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 4: EXPERIENCE TIMELINE TAB */}
        {activeTab === "experience" && (
          <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
            <div className="bg-[#161B22]/60 border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Detailed Career Experience</h3>
                {isOwner && (
                  <button 
                    onClick={handleStartAddExperience}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-[0_0_10px_rgba(0,240,255,0.25)]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Experience</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col !gap-y-4 !mt-6">
                {athlete.experience.length === 0 && (
                  <p className="text-xs text-gray-500 italic py-2 text-center">No experience added yet.</p>
                )}
                {athlete.experience.map((exp) => (
                  <div key={exp.id} className="relative group/item2 p-5 bg-[#111318]/40 border border-white/5 rounded-xl hover:border-[#00f0ff]/20 hover:bg-[#111318]/60 transition-all !mb-4.5 last:!mb-0">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-xl bg-[#333539] border border-white/10 flex items-center justify-center text-xl shrink-0 shadow-md uppercase font-black text-gray-400">
                        {exp.team.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0 pr-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                          <h4 className="text-sm sm:text-base font-extrabold text-white font-['Hanken_Grotesk'] leading-tight">
                            {exp.team}
                          </h4>
                          <span className="text-xs font-semibold text-[#b9cacb]">
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#00f0ff] tracking-wide uppercase mt-1">
                          {exp.role}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    </div>

                    {isOwner && (
                      <div className="absolute right-4 top-4 opacity-0 group-hover/item2:opacity-100 flex items-center !gap-x-3.5 transition-all">
                        <button 
                          onClick={() => handleStartEditExperience(exp)}
                          className="p-1.5 rounded text-[#b9cacb] hover:text-[#00f0ff] hover:bg-white/5 cursor-pointer"
                          title="Edit Experience"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="p-1.5 rounded text-red-400 hover:text-red-500 hover:bg-white/5 cursor-pointer"
                          title="Delete Experience"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>

            {/* Posts Card (Detailed tab version) */}
            <div className="bg-[#161B22]/60 border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00f0ff] text-xl">feed</span>
                  <span>Posts</span>
                </h3>
                {isOwner && !isAddingPost && (
                  <button 
                    onClick={() => setIsAddingPost(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-[0_0_10px_rgba(0,240,255,0.25)]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Post</span>
                  </button>
                )}
              </div>

              {isAddingPost && (
                <form onSubmit={handleSaveNewPost} className="space-y-4 bg-[#111318]/30 border border-white/5 p-5 rounded-xl mb-6">
                  <div>
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Post Title</label>
                    <input 
                      type="text" 
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="e.g. Match Highlights, Training Session"
                      className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                      style={{ padding: '10px 14px' }}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider block mb-1.5 font-['Hanken_Grotesk']">Post Content</label>
                    <textarea 
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="What's on your mind? Share updates, matches, achievements..."
                      rows={3}
                      className="w-full bg-[#1e2024] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] resize-none font-['Inter'] leading-relaxed"
                      style={{ padding: '12px 14px' }}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setIsAddingPost(false)} className="bg-white/5 hover:bg-white/10 rounded-md text-[10px] font-bold px-4 py-2 cursor-pointer transition-colors text-white">Cancel</button>
                    <button type="submit" className="bg-[#00f0ff] hover:bg-[#00dbe9] text-black rounded-md text-[10px] font-bold px-4 py-2 cursor-pointer transition-colors shadow-[0_0_8px_rgba(0,240,255,0.2)]">Publish</button>
                  </div>
                </form>
              )}

              {/* Posts List */}
              <div className="flex flex-col !gap-y-4 !mt-5">
                {(!athlete.posts || athlete.posts.length === 0) ? (
                  <p className="text-xs text-gray-500 italic py-4 text-center">no post</p>
                ) : (
                  athlete.posts.map((post) => (
                    <div key={post.id} className="relative group/post p-5 bg-[#111318]/40 border border-white/5 rounded-xl hover:border-[#00f0ff]/20 hover:bg-[#111318]/60 transition-all">
                      <div className="flex items-start gap-4">
                        {/* User Avatar */}
                        <img 
                          src={athlete.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"} 
                          alt={athlete.name} 
                          className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0" 
                        />
                        <div className="flex-1 min-w-0 animate-fadeIn">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="text-sm font-extrabold text-white font-['Hanken_Grotesk'] leading-tight">{athlete.name}</h4>
                              <span className="text-[10px] font-medium text-[#b9cacb]/60 block mt-0.5">{post.date}</span>
                            </div>
                            {isOwner && (
                              <button 
                                onClick={() => handleDeletePost(post.id)}
                                className="p-1.5 rounded text-red-400 hover:text-red-500 hover:bg-white/5 cursor-pointer opacity-0 group-hover/post:opacity-100 transition-opacity"
                                title="Delete Post"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            )}
                          </div>
                          <h5 className="text-sm font-bold text-[#00f0ff] mt-4">{post.title}</h5>
                          <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed whitespace-pre-line font-['Inter']">{post.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}



        {/* VIEW 6: ACHIEVEMENTS TAB */}
        {activeTab === "achievements" && (
          <div className="max-w-4xl mx-auto bg-[#161B22]/60 border border-white/10 rounded-2xl p-6 md:p-8 animate-fadeIn">
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider border-b border-white/5 pb-3">Achievements & Verified Badges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {athlete.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-[#111318]/50 border border-white/5 rounded-xl hover:border-[#00f0ff]/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-2xl shrink-0 shadow-md">
                    {h.icon}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-white font-['Hanken_Grotesk'] leading-tight">
                      {h.text}
                    </h4>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 7: ENDORSEMENTS TAB */}
        {activeTab === "endorsements" && (
          <div className="max-w-4xl mx-auto bg-[#161B22]/60 border border-white/10 rounded-2xl p-6 md:p-8 animate-fadeIn">
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider border-b border-white/5 pb-3">Skill Endorsements</h3>
            <div className="flex flex-col !gap-y-4">
              {athlete.skills.length === 0 && (
                <p className="text-xs text-gray-500 italic py-4 text-center">No skills added yet. Add skills to enable endorsements.</p>
              )}
              {getSkillEndorsementsList().map((item) => (
                <div key={item.skill} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#111318]/50 border border-white/5 rounded-xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-white">{item.skill}</h4>
                      <span className="text-xs font-bold text-[#00f0ff] font-['JetBrains_Mono']">({item.count} endorsements)</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium block mt-1.5">Endorsed by state team scouts and teammates</span>
                  </div>

                  <button 
                    onClick={() => handleEndorseSkill(item.skill)}
                    className="px-5 py-2.5 bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)] cursor-pointer self-start sm:self-center font-['Hanken_Grotesk']"
                  >
                    Endorse Skill
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 8: REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="max-w-4xl mx-auto bg-[#161B22]/60 border border-white/10 rounded-2xl p-6 md:p-8 animate-fadeIn">
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider border-b border-white/5 pb-3">Coach & Scout Recommendations</h3>
            <div className="space-y-5">
              {athlete.reviews.map((r) => (
                <div key={r.id} className="p-5 bg-[#111318]/50 border border-white/5 rounded-xl relative">
                  
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 absolute right-5 top-5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-white font-['JetBrains_Mono']">{r.rating}</span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    {/* Mock Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#1e2024] border border-white/10 flex items-center justify-center font-bold text-[#00f0ff] shrink-0 text-sm">
                      {r.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-white font-['Hanken_Grotesk']">{r.author}</h4>
                      <p className="text-[10px] text-[#00f0ff] uppercase tracking-wide font-bold mt-0.5">{r.role}</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 mt-4 leading-relaxed font-['Inter'] italic">
                    "{r.text}"
                  </p>

                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-4">
                    Date Submitted: {r.date}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 5. ADD EXPERIENCE MODAL WINDOW */}
      <AnimatePresence>
        {isExperienceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-[#0A1224] border border-[#192540] rounded-2xl max-w-xl w-full p-8 shadow-2xl relative text-gray-100 font-['Inter']"
            >
              <h2 className="text-lg sm:text-xl font-black text-white font-['Hanken_Grotesk'] tracking-wider uppercase border-b border-white/10 pb-4 mb-6">
                {editingExpId ? "Edit Career Experience" : "Add Career Experience"}
              </h2>

              <form onSubmit={handleSaveExperienceForm} className="!space-y-5">
                <div>
                  <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">Team / Club Name</label>
                  <input
                    type="text"
                    required
                    value={newExpTeam}
                    onChange={(e) => setNewExpTeam(e.target.value)}
                    placeholder="e.g. Mumbai Warriors"
                    className="w-full bg-[#333539] border border-white/10 rounded-lg text-sm text-white placeholder-[#b9cacb]/60 font-medium focus:outline-none focus:border-[#00f0ff]"
                    style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">Role / Position</label>
                  <input
                    type="text"
                    required
                    value={newExpRole}
                    onChange={(e) => setNewExpRole(e.target.value)}
                    placeholder="e.g. Captain / All Rounder"
                    className="w-full bg-[#333539] border border-white/10 rounded-lg text-sm text-white placeholder-[#b9cacb]/60 font-medium focus:outline-none focus:border-[#00f0ff]"
                    style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">Duration</label>
                  <input
                    type="text"
                    required
                    value={newExpPeriod}
                    onChange={(e) => setNewExpPeriod(e.target.value)}
                    placeholder="e.g. Jan 2023 – Present"
                    className="w-full bg-[#333539] border border-white/10 rounded-lg text-sm text-white placeholder-[#b9cacb]/60 font-medium focus:outline-none focus:border-[#00f0ff]"
                    style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">Description</label>
                  <textarea
                    rows={4}
                    value={newExpDesc}
                    onChange={(e) => setNewExpDesc(e.target.value)}
                    placeholder="Describe your role, match scores, achievements, or training highlights..."
                    className="w-full bg-[#333539] border border-white/10 rounded-lg text-sm text-white placeholder-[#b9cacb]/60 font-medium focus:outline-none focus:border-[#00f0ff] resize-none leading-relaxed"
                    style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '14px', paddingBottom: '14px' }}
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsExperienceModalOpen(false)}
                    className="bg-[#333539] hover:bg-gray-700 text-[#e2e2e8] rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                    style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '10px', paddingBottom: '10px' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.25)]"
                    style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '10px', paddingBottom: '10px' }}
                  >
                    {editingExpId ? "Save Experience" : "Add Experience"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. EDIT PROFILE DETAILS MODAL */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-[#0A1224] border border-[#192540] rounded-2xl max-w-xl w-full p-8 shadow-2xl relative text-gray-100 font-['Inter']"
            >
              <h2 className="text-lg sm:text-xl font-black text-white font-['Hanken_Grotesk'] tracking-wider uppercase border-b border-white/10 pb-4 mb-6">
                Edit Profile Details
              </h2>

              <form onSubmit={handleSaveProfileDetails} className="!space-y-5">
                <div>
                  <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Arjun Mehta"
                    className="w-full bg-[#333539] border border-white/10 rounded-lg text-sm text-white placeholder-[#b9cacb]/60 font-medium focus:outline-none focus:border-[#00f0ff]"
                    style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">Title / Playing Role</label>
                  <input
                    type="text"
                    required
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    placeholder="e.g. Professional Cricketer"
                    className="w-full bg-[#333539] border border-white/10 rounded-lg text-sm text-white placeholder-[#b9cacb]/60 font-medium focus:outline-none focus:border-[#00f0ff]"
                    style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">Location</label>
                  <input
                    type="text"
                    required
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full bg-[#333539] border border-white/10 rounded-lg text-sm text-white placeholder-[#b9cacb]/60 font-medium focus:outline-none focus:border-[#00f0ff]"
                    style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">Profile Website URL</label>
                  <input
                    type="text"
                    required
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    placeholder="e.g. playure.com/arjunmehta"
                    className="w-full bg-[#333539] border border-white/10 rounded-lg text-sm text-white placeholder-[#b9cacb]/60 font-medium focus:outline-none focus:border-[#00f0ff]"
                    style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider block mb-2 font-['Hanken_Grotesk']">Attributes (comma separated tags)</label>
                  <input
                    type="text"
                    value={editAttributes}
                    onChange={(e) => setEditAttributes(e.target.value)}
                    placeholder="e.g. Right Hand Batsman, Right Arm Off Break, All Rounder"
                    className="w-full bg-[#333539] border border-white/10 rounded-lg text-sm text-white placeholder-[#b9cacb]/60 font-medium focus:outline-none focus:border-[#00f0ff]"
                    style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsProfileModalOpen(false)}
                    className="bg-[#333539] hover:bg-gray-700 text-[#e2e2e8] rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                    style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '10px', paddingBottom: '10px' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.25)]"
                    style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '10px', paddingBottom: '10px' }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
