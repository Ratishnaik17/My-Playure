import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { Lock, User, ArrowRight, X, Zap } from "lucide-react";

export default function SignInModal({ isOpen, onClose, onSuccess, onSwitchToSignUp }) {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLoaded && signIn) {
        const result = await signIn.create({
          identifier: email,
          password: password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          if (onSuccess) onSuccess();
          onClose();
        } else {
          setError("Sign in incomplete. Please verify your credentials.");
        }
      } else {
        setTimeout(() => {
          setLoading(false);
          if (onSuccess) onSuccess();
          onClose();
        }, 600);
      }
    } catch (err) {
      console.error("Clerk Sign In Error:", err);
      const errMsg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || "Invalid credentials.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10 md:p-14 bg-[#0d1117]/85 backdrop-blur-xl animate-fadeIn font-inter overflow-y-auto">
      {/* Background Image with Gradient Mask */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/sports-hero-bg.png"
          alt="Playure Sports Backdrop"
          className="w-full h-full object-cover opacity-25 filter contrast-125 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/80 to-transparent" />
      </div>

      {/* Main Authentication Card */}
      <main 
        className="relative z-10 w-full max-w-[460px] my-auto py-6"
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
          <div className="p-8 pb-6 text-center border-b border-white/10 relative">
            {/* Logo Badge */}
            <div className="flex justify-center items-center gap-3 mb-3">
              <div className="bg-[#0b0e14] p-1 rounded-xl border border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center justify-center overflow-hidden">
                <img src="/playure-logo.png" alt="Playure Logo" className="h-8 w-8 object-cover rounded-lg" />
              </div>
              <h1 className="font-hanken text-2xl font-black text-white tracking-tight">
                Play<span className="text-[#00f0ff]">ure</span>
              </h1>
            </div>

            <h2 className="font-hanken text-xl font-bold text-white mb-1 tracking-tight">
              Sign In to Playure
            </h2>
            <p className="font-inter text-xs text-[#b9cacb]">
              Elevate your sports career across India
            </p>
          </div>

          {/* Form Area */}
          <div className="p-8 pt-6 flex flex-col gap-6">
            {error && (
              <div className="bg-[#93000a]/50 border border-[#ffb4ab]/40 text-[#ffdad6] text-xs px-4 py-2.5 rounded-xl text-center font-inter">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Email / Username Input */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="font-mono-data text-[11px] font-semibold text-[#b9cacb] uppercase tracking-wider" htmlFor="username">
                  Email or Username
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-[#b9cacb] absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="username"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manager"
                    className="input-ghost w-full py-2.5 text-sm text-white font-inter focus:outline-none transition-colors placeholder:text-[#b9cacb]/40"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5 relative">
                <div className="flex justify-between items-baseline">
                  <label className="font-mono-data text-[11px] font-semibold text-[#b9cacb] uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                  <a href="#" onClick={(e) => e.preventDefault()} className="font-mono-data text-[11px] text-[#00f0ff] hover:text-[#7df4ff] hover:underline transition-colors">
                    Forgot?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#b9cacb] absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-ghost w-full py-2.5 text-sm text-white font-inter focus:outline-none transition-colors placeholder:text-[#b9cacb]/40"
                  />
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-hanken text-sm font-black uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] btn-glow cursor-pointer active:scale-95"
              >
                <span>{loading ? "Signing In..." : "Sign In To Playure"}</span>
                <ArrowRight className="w-4 h-4 text-[#00363a]" />
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="pt-4 border-t border-white/10 text-center">
              <p className="font-inter text-xs text-[#b9cacb]">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onSwitchToSignUp) onSwitchToSignUp();
                  }}
                  className="font-hanken text-xs font-bold text-[#00f0ff] hover:underline cursor-pointer ml-1"
                >
                  Sign Up
                </button>
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
