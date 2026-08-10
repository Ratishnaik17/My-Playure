import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { User, AtSign, Mail, Lock, Calendar, ArrowRight, X, Eye, EyeOff, Check } from "lucide-react";

export default function SignUpModal({ isOpen, onClose, onSuccess, onSwitchToSignIn }) {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [role, setRole] = useState("player"); // "player" or "organization"
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [age, setAge] = useState("");
  const [selectedSports, setSelectedSports] = useState(["Cricket", "Badminton"]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const indianSportsList = [
    { name: "Cricket", icon: "🏏" },
    { name: "Field Hockey", icon: "🏑" },
    { name: "Football (Soccer)", icon: "⚽" },
    { name: "Basketball", icon: "🏀" },
    { name: "Volleyball", icon: "🏐" },
    { name: "Wrestling", icon: "🤼‍♂️" },
    { name: "Kabaddi", icon: "🤼" },
    { name: "Athletics", icon: "🏃" },
    { name: "Cycling", icon: "🚴" },
    { name: "Badminton", icon: "🏸" },
    { name: "Boxing", icon: "🥊" },
    { name: "Archery", icon: "🎯" },
    { name: "Shooting (Rifle)", icon: "🎯" },
    { name: "Golf", icon: "⛳" },
    { name: "Weightlifting", icon: "🏋️" },
    { name: "Table Tennis", icon: "🏓" },
    { name: "Judo", icon: "🥋" },
    { name: "Chess", icon: "♟️" }
  ];

  if (!isOpen) return null;

  const toggleSport = (sportName) => {
    if (selectedSports.includes(sportName)) {
      setSelectedSports(selectedSports.filter((s) => s !== sportName));
    } else {
      setSelectedSports([...selectedSports, sportName]);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !username || !age) {
      setError("Please fill in all required fields.");
      return;
    }

    if (selectedSports.length === 0) {
      setError("Please select at least one sport.");
      return;
    }

    setLoading(true);

    try {
      if (isLoaded && signUp) {
        const nameParts = name.trim().split(" ");
        const firstName = nameParts[0] || name;
        const lastName = nameParts.slice(1).join(" ") || "";

        const metadata = {
          username: username,
          age: Number(age),
          role: role,
          sports: selectedSports,
        };

        let result;
        try {
          result = await signUp.create({
            emailAddress: email,
            password: password,
            username: username,
            firstName: firstName,
            lastName: lastName,
            unsafeMetadata: metadata,
          });
        } catch (createErr) {
          result = await signUp.create({
            emailAddress: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            unsafeMetadata: metadata,
          });
        }

        if (result?.status === "complete") {
          localStorage.setItem("playure_demo_user_name", name);
          localStorage.setItem("playure_demo_user_email", email);
          await setActive({ session: result.createdSessionId });
          if (onSuccess) onSuccess();
          onClose();
        } else {
          try {
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setPendingVerification(true);
          } catch (verErr) {
            if (result?.createdSessionId) {
              localStorage.setItem("playure_demo_user_name", name);
              localStorage.setItem("playure_demo_user_email", email);
              await setActive({ session: result.createdSessionId });
              if (onSuccess) onSuccess();
              onClose();
            } else {
              setPendingVerification(true);
            }
          }
        }
      } else {
        setTimeout(() => {
          localStorage.setItem("playure_demo_user_name", name);
          localStorage.setItem("playure_demo_user_email", email);
          setLoading(false);
          if (onSuccess) onSuccess();
          onClose();
        }, 800);
      }
    } catch (err) {
      console.error("Sign Up Error:", err);
      setError(err.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLoaded && signUp) {
        const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
        if (completeSignUp.status === "complete") {
          localStorage.setItem("playure_demo_user_name", name);
          localStorage.setItem("playure_demo_user_email", email);
          await setActive({ session: completeSignUp.createdSessionId });
          if (onSuccess) onSuccess();
          onClose();
        } else {
          setError("Verification incomplete. Please check your code.");
        }
      } else {
        localStorage.setItem("playure_demo_user_name", name);
        localStorage.setItem("playure_demo_user_email", email);
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setError("Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10 md:p-14 bg-[#0d1117]/85 backdrop-blur-xl animate-fadeIn overflow-y-auto font-inter">
      {/* Background Image with Mask */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/sports-hero-bg.png"
          alt="Playure Sports Background"
          className="w-full h-full object-cover opacity-25 filter contrast-125 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/90 to-[#0d1117]" />
      </div>

      {/* Main Form Card */}
      <main 
        className="relative z-10 w-full max-w-2xl my-auto py-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-panel rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(0,240,255,0.18)] flex flex-col relative border border-white/10">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 sm:top-6 sm:right-6 text-gray-400 hover:text-white bg-black/40 hover:bg-black/70 p-2 rounded-full transition-all cursor-pointer z-20 border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Area */}
          <div className="px-8 sm:px-12 pt-10 pb-6 text-center border-b border-white/10 relative">
            <div className="inline-flex items-center gap-2 bg-[#0b0e14] px-2.5 py-1 rounded-xl border border-[#00f0ff]/30 shadow-[0_0_12px_rgba(0,240,255,0.2)] mb-3">
              <img src="/playure-logo.png" alt="Playure Logo" className="h-5 w-5 object-cover rounded-md" />
              <span className="font-hanken text-xs font-black text-white tracking-widest uppercase">
                Play<span className="text-[#00f0ff]">ure</span>
              </span>
            </div>

            <h1 className="font-hanken text-2xl sm:text-3xl font-black text-white tracking-tight">
              Create Your Account
            </h1>
            <p className="font-inter text-xs sm:text-sm text-[#b9cacb] mt-1">
              Join the elite network of sports professionals across India.
            </p>
          </div>

          {/* Form Body */}
          <div className="p-8 sm:p-10 flex flex-col gap-6">
            
            {error && (
              <div className="bg-[#93000a]/50 border border-[#ffb4ab]/40 text-[#ffdad6] text-xs px-4 py-2.5 rounded-xl text-center font-inter">
                {error}
              </div>
            )}

            {!pendingVerification ? (
              <form onSubmit={handleSignUp} className="flex flex-col gap-6">
                
                {/* Account Type Toggle (Segmented Pill) */}
                <div className="flex justify-center mb-2">
                  <div className="bg-[#282a2e]/90 rounded-full p-1 inline-flex w-full max-w-xs border border-[#3b494b]">
                    <button
                      type="button"
                      onClick={() => setRole("player")}
                      className={`flex-1 py-2 px-4 rounded-full font-mono-data text-xs font-bold transition-all cursor-pointer ${
                        role === "player"
                          ? "bg-[#434957] text-white shadow-md"
                          : "text-[#b9cacb] hover:text-white"
                      }`}
                    >
                      Player
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("organization")}
                      className={`flex-1 py-2 px-4 rounded-full font-mono-data text-xs font-bold transition-all cursor-pointer ${
                        role === "organization"
                          ? "bg-[#434957] text-white shadow-md"
                          : "text-[#b9cacb] hover:text-white"
                      }`}
                    >
                      Organization
                    </button>
                  </div>
                </div>

                {/* Personal Info Grid (2 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5 relative">
                    <label className="font-mono-data text-[11px] font-semibold text-[#b9cacb] uppercase tracking-wider" htmlFor="name">
                      Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-[#849495] absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        className="input-ghost w-full py-2.5 text-sm text-white font-inter focus:outline-none transition-colors placeholder:text-[#b9cacb]/40"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="flex flex-col gap-1.5 relative">
                    <label className="font-mono-data text-[11px] font-semibold text-[#b9cacb] uppercase tracking-wider" htmlFor="username">
                      Create Username
                    </label>
                    <div className="relative flex items-center">
                      <AtSign className="w-4 h-4 text-[#849495] absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g., pro_athlete99"
                        className="input-ghost w-full py-2.5 text-sm text-white font-inter focus:outline-none transition-colors placeholder:text-[#b9cacb]/40"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="font-mono-data text-[11px] font-semibold text-[#b9cacb] uppercase tracking-wider" htmlFor="email">
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-[#849495] absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="input-ghost w-full py-2.5 text-sm text-white font-inter focus:outline-none transition-colors placeholder:text-[#b9cacb]/40"
                    />
                  </div>
                </div>

                {/* Password Grid (2 Columns: Password & Age) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div className="flex flex-col gap-1.5 relative">
                    <label className="font-mono-data text-[11px] font-semibold text-[#b9cacb] uppercase tracking-wider" htmlFor="password">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-[#849495] absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-ghost w-full py-2.5 pr-8 text-sm text-white font-inter focus:outline-none transition-colors placeholder:text-[#b9cacb]/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 text-[#b9cacb] hover:text-white transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Age */}
                  <div className="flex flex-col gap-1.5 relative">
                    <label className="font-mono-data text-[11px] font-semibold text-[#b9cacb] uppercase tracking-wider" htmlFor="age">
                      Age
                    </label>
                    <div className="relative flex items-center">
                      <Calendar className="w-4 h-4 text-[#849495] absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="age"
                        type="number"
                        min="5"
                        max="100"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Years"
                        className="input-ghost w-full py-2.5 text-sm text-white font-inter focus:outline-none transition-colors placeholder:text-[#b9cacb]/40"
                      />
                    </div>
                  </div>
                </div>

                {/* Sports Selection */}
                <div className="flex flex-col gap-2 pt-1">
                  <label className="font-mono-data text-[11px] font-semibold text-[#00f0ff] uppercase tracking-wider">
                    Which sports do you play?
                  </label>

                  <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto p-2.5 bg-[#111318]/70 rounded-xl border border-white/5 custom-scrollbar">
                    {indianSportsList.map((sport) => {
                      const isSelected = selectedSports.includes(sport.name);
                      return (
                        <button
                          key={sport.name}
                          type="button"
                          onClick={() => toggleSport(sport.name)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-inter font-medium transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.3)] font-bold"
                              : "bg-[#161B22] text-[#b9cacb] border border-white/10 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          <span>{sport.icon}</span>
                          <span>{sport.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#00f0ff]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-hanken text-sm font-black uppercase tracking-wider py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_22px_rgba(0,240,255,0.45)] btn-glow cursor-pointer active:scale-98"
                  >
                    <span>{loading ? "Creating Account..." : "Create Account"}</span>
                    <ArrowRight className="w-4 h-4 text-[#00363a]" />
                  </button>
                </div>
              </form>
            ) : (
              /* Email Verification Code Step */
              <form onSubmit={handleVerify} className="flex flex-col gap-6 text-center py-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-3xl mb-2">
                    📩
                  </div>
                  <h3 className="font-hanken text-xl font-bold text-white">
                    Verify Your Email
                  </h3>
                  <p className="font-inter text-xs text-[#b9cacb]">
                    We sent a 6-digit verification code to <strong className="text-white">{email}</strong>
                  </p>
                </div>

                <div className="flex flex-col gap-2 max-w-xs mx-auto w-full">
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-[#111318] border border-[#00f0ff]/50 text-center text-xl font-bold text-[#00f0ff] font-mono-data tracking-widest py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-hanken text-sm font-black uppercase tracking-wider py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] btn-glow cursor-pointer"
                >
                  {loading ? "Verifying..." : "Complete Sign Up"}
                </button>
              </form>
            )}

            {/* Footer Link */}
            <div className="pt-4 border-t border-white/10 text-center">
              <p className="font-inter text-xs text-[#b9cacb]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onSwitchToSignIn) onSwitchToSignIn();
                  }}
                  className="font-hanken text-xs font-bold text-[#00f0ff] hover:underline cursor-pointer ml-1"
                >
                  Sign In
                </button>
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
