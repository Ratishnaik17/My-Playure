import { useState } from "react";
import SignUpModal from "../components/SignUpModal";
import SignInModal from "../components/SignInModal";
import {
  Trophy,
  Users,
  ArrowRight,
  Play,
  Bot,
  Sparkles,
  ChevronRight,
  User,
  Menu,
  X,
  BarChart2,
  LogIn,
  Globe,
  Zap,
  Activity,
  Heart,
  Dumbbell,
  ClipboardCheck
} from "lucide-react";

export default function Home({ onSignInSuccess }) {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#0c0e12] text-[#e2e2e8] flex flex-col relative overflow-x-hidden font-['Inter',sans-serif] selection:bg-[#00f0ff] selection:text-[#00363a]">

      {/* Floating AI Coach Sidekick (Explicitly Styled Pill Capsule Widget) */}
      <div className="fixed right-8 bottom-8 z-[100] hidden lg:block transition-all hover:scale-105 duration-300">
        <div
          onClick={() => setShowSignInModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: 'rgba(12, 16, 23, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: '9999px',
            paddingLeft: '16px',
            paddingRight: '36px',
            paddingTop: '12px',
            paddingBottom: '12px',
            border: '2px solid #00f0ff',
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.45)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box'
          }}
        >
          {/* Circular Bot Icon Avatar */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '9999px',
            border: '2px solid rgba(0, 240, 255, 0.6)',
            backgroundColor: 'rgba(0, 240, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Bot style={{ width: '26px', height: '26px', color: '#00f0ff' }} />
          </div>

          {/* Vertical Divider */}
          <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255, 255, 255, 0.2)', flexShrink: 0 }} />

          {/* Label Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0, paddingRight: '4px' }}>
            <div style={{ display: 'flex', items: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: '#00FF41', boxShadow: '0 0 8px #00FF41', flexShrink: 0 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#00FF41', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                AI COACH
              </span>
            </div>
            <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: '17px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#080a0f]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.6)] flex flex-col items-center">
        {/* Subtle accent light bar along the top edge */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/60 to-transparent" />

        <div className="w-full py-4 flex items-center justify-between px-8 md:px-14 lg:px-16" style={{ maxWidth: '1360px', marginLeft: 'auto', marginRight: 'auto' }}>
          {/* Left Brand / Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setShowSignInModal(true)}>
            <div className="bg-[#0b0e14] p-1 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.25)] border border-[#00f0ff]/30 flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-[#00f0ff]/70 overflow-hidden">
              <img
                src="/playure-logo.png"
                alt="Playure Logo"
                className="h-8 w-8 object-cover rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-['Hanken_Grotesk'] text-2xl font-black tracking-tight text-white drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                Play<span className="text-[#00f0ff]">ure</span>
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            <button
              onClick={() => setShowSignInModal(true)}
              className="flex items-center gap-2.5 text-sm font-bold font-hanken text-white hover:text-[#00f0ff] transition-colors cursor-pointer group"
            >
              <Trophy className="w-4 h-4 text-[#00f0ff] group-hover:scale-110 transition-transform" />
              <span>Tournaments</span>
            </button>
            <button
              onClick={() => setShowSignInModal(true)}
              className="flex items-center gap-2.5 text-sm font-bold font-hanken text-white hover:text-[#00f0ff] transition-colors cursor-pointer group"
            >
              <Users className="w-4 h-4 text-[#00f0ff] group-hover:scale-110 transition-transform" />
              <span>Athletes</span>
            </button>
            <button
              onClick={() => setShowSignInModal(true)}
              className="flex items-center gap-2.5 text-sm font-bold font-hanken text-white hover:text-[#00f0ff] transition-colors cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-[#00f0ff] group-hover:scale-110 transition-transform" />
              <span>Collab</span>
            </button>
            <button
              onClick={() => setShowSignInModal(true)}
              className="flex items-center gap-2.5 text-sm font-bold font-hanken text-white hover:text-[#00f0ff] transition-colors cursor-pointer group"
            >
              <BarChart2 className="w-4 h-4 text-[#00f0ff] group-hover:scale-110 transition-transform" />
              <span>Rankings</span>
            </button>
          </div>

          {/* Right Action CTA Buttons */}
          <div className="hidden sm:flex items-center gap-5">
            <button
              onClick={() => setShowSignInModal(true)}
              className="flex items-center gap-2 text-sm font-bold font-hanken text-white hover:text-[#00f0ff] transition-colors cursor-pointer py-1"
            >
              <LogIn className="w-4 h-4 text-[#00f0ff]" />
              <span>Log In</span>
            </button>
            <button
              onClick={() => setShowSignUpModal(true)}
              style={{
                borderRadius: '6px',
                paddingLeft: '16px',
                paddingRight: '14px',
                paddingTop: '6px',
                paddingBottom: '6px',
                backgroundColor: '#00f0ff',
                color: '#00262b',
                fontWeight: 900,
                fontSize: '11px',
                letterSpacing: '0.05em',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                border: 'none',
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="hover:bg-[#7df4ff] hover:scale-105 active:scale-95 font-hanken uppercase shrink-0"
            >
              <span>REGISTER</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00262b] shrink-0" />
            </button>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#00f0ff]" /> : <Menu className="w-5 h-5 text-[#00f0ff]" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden w-full bg-[#090c12]/95 backdrop-blur-2xl border-t border-white/10 px-6 py-4 flex flex-col gap-3">
            <button
              onClick={() => { setShowSignInModal(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 text-sm font-semibold text-gray-200 hover:text-[#00f0ff] py-2.5 border-b border-white/5"
            >
              <Trophy className="w-4 h-4 text-[#00f0ff]" />
              Tournaments
            </button>
            <button
              onClick={() => { setShowSignInModal(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 text-sm font-semibold text-gray-200 hover:text-[#00f0ff] py-2.5 border-b border-white/5"
            >
              <Users className="w-4 h-4 text-[#00f0ff]" />
              Athletes
            </button>
            <button
              onClick={() => { setShowSignInModal(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 text-sm font-semibold text-gray-200 hover:text-[#00f0ff] py-2.5 border-b border-white/5"
            >
              <Sparkles className="w-4 h-4 text-[#00f0ff]" />
              Collab
            </button>
            <button
              onClick={() => { setShowSignInModal(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 text-sm font-semibold text-gray-200 hover:text-[#00f0ff] py-2.5 border-b border-white/5"
            >
              <BarChart2 className="w-4 h-4 text-[#00f0ff]" />
              Rankings
            </button>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => { setShowSignInModal(true); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 rounded-full text-xs font-bold text-center text-white bg-white/10 border border-white/10 hover:bg-white/20"
              >
                Log In
              </button>
              <button
                onClick={() => { setShowSignUpModal(true); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 rounded-full text-xs font-extrabold text-center text-[#00262b] bg-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.5)] uppercase tracking-wider"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col relative w-full overflow-hidden items-center">

        {/* HERO SECTION */}
        <section className="relative w-full min-h-screen flex items-center justify-center pt-32 pb-24 md:pt-40 md:pb-32 border-b border-white/5">

          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src="/sports-hero-bg.png"
              alt="Dynamic sports collage"
              className="w-full h-full object-cover object-top opacity-65 filter contrast-110 saturate-125"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0c0e12]/50 via-[#0c0e12]/80 to-[#0c0e12]" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#00f0ff]/15 rounded-full blur-[150px] pointer-events-none" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 w-full px-8 md:px-14 lg:px-16 text-center flex flex-col items-center gap-8 mt-12 md:mt-0" style={{ maxWidth: '1360px', marginLeft: 'auto', marginRight: 'auto' }}>

            <h1 className="font-['Hanken_Grotesk'] text-[44px] sm:text-[64px] md:text-[80px] text-white font-extrabold leading-[1.0] tracking-tight uppercase drop-shadow-2xl max-w-4xl">
              Building the <span className="text-[#00f0ff] italic pr-2 shadow-[0_0_20px_rgba(0,240,255,0.6)]">Future</span><br />
              for Sports Players
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-[#b9cacb] max-w-3xl mx-auto font-light leading-relaxed">
              One platform to elevate your sports career across India. Discover tournaments, connect with athletes, and compete.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4 w-full">
              <button
                onClick={() => setShowSignUpModal(true)}
                className="bg-[#00f0ff] text-[#00363a] font-['Hanken_Grotesk'] text-base sm:text-lg font-bold px-10 py-4 rounded-full shadow-[0_0_25px_rgba(0,240,255,0.45)] hover:shadow-[0_0_40px_rgba(0,240,255,0.8)] hover:-translate-y-0.5 transition-all w-full sm:w-auto flex items-center justify-center gap-3 uppercase tracking-wider cursor-pointer active:scale-95"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowDemoModal(true)}
                className="bg-[#111318]/60 backdrop-blur-xl text-white font-['Hanken_Grotesk'] text-base sm:text-lg px-10 py-4 rounded-full hover:bg-white/10 border border-white/10 transition-all w-full sm:w-auto flex items-center justify-center gap-3 cursor-pointer active:scale-95"
              >
                <Play className="w-5 h-5 text-[#00f0ff] fill-[#00f0ff]" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* 18 Sports Showcase Grid (Compact 2 Rows) */}
            <div className="w-full max-w-7xl mx-auto mt-28 sm:mt-40 md:mt-52 px-4 sm:px-8 pb-8">
              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-1.5 sm:gap-2">
                {[
                  "Cricket",
                  "Field Hockey",
                  "Football (Soccer)",
                  "Basketball",
                  "Volleyball",
                  "Wrestling",
                  "Kabaddi",
                  "Athletics",
                  "Cycling",
                  "Badminton",
                  "Boxing",
                  "Archery",
                  "Shooting (Rifle)",
                  "Golf",
                  "Weightlifting",
                  "Table Tennis",
                  "Judo",
                  "Chess"
                ].map((sport, index) => (
                  <div
                    key={index}
                    onClick={() => setShowSignUpModal(true)}
                    className="bg-transparent hover:bg-[#00f0ff]/10 backdrop-blur-md rounded-xl border border-[#00f0ff]/35 hover:border-[#00f0ff] px-2 py-2.5 sm:px-3 sm:py-3 flex items-center justify-center text-center hover:shadow-[0_0_18px_rgba(0,240,255,0.35)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer min-h-[52px] sm:min-h-[58px] group"
                  >
                    <span className="font-hanken font-extrabold text-white group-hover:text-[#00f0ff] text-xs sm:text-sm md:text-base leading-tight whitespace-pre-line transition-colors tracking-tight">
                      {sport}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* FEATURE 1: DISCOVERY & TOURNAMENTS SECTION */}
        <section className="w-full min-h-screen py-32 md:py-44 flex items-center justify-center relative bg-[#0c0e12] border-b border-white/5 overflow-hidden">
          {/* Background Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#00f0ff]/10 rounded-full blur-[160px] pointer-events-none" />

          <div className="w-full px-8 sm:px-14 lg:px-16 relative z-10" style={{ maxWidth: '1360px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Left Column (Content Stack) */}
              <div className="w-full flex flex-col items-start gap-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10">
                  <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-[#00f0ff] uppercase tracking-widest">
                    TOURNAMENTS
                  </span>
                </div>

                <h2 className="font-['Hanken_Grotesk'] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight uppercase tracking-tight">
                  DISCOVER <br />
                  ELITE <span className="text-[#00f0ff]">ARENA</span><span className="text-[#fed639]">S</span>
                </h2>

                <p className="text-base sm:text-lg text-[#b9cacb] max-w-lg font-light leading-relaxed">
                  Join 500+ players finding the best arenas for every sport and level. From casual matches to championship tournaments.
                </p>

                <button
                  onClick={() => setShowSignInModal(true)}
                  className="bg-[#161B22] text-white font-['Hanken_Grotesk'] font-semibold px-8 py-3.5 rounded-xl border border-white/10 hover:border-[#00f0ff]/50 hover:bg-[#21262d] transition-all flex items-center gap-3 group mt-2 cursor-pointer shadow-lg active:scale-95"
                >
                  <span>Explore Arenas</span>
                  <ArrowRight className="w-4 h-4 text-[#00f0ff] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="w-full flex justify-center lg:justify-end">
                <div 
                  className="w-full max-w-[660px] bg-[#040812] border border-[#00f0ff]/30 rounded-3xl p-8 sm:p-10 flex flex-col gap-5 shadow-[0_0_40px_rgba(0,240,255,0.1)] relative overflow-hidden backdrop-blur-2xl"
                  style={{ padding: "2.5rem 2rem" }}
                >

                  {/* Header Section */}
                  <div className="flex items-center justify-between border-b border-[#00f0ff]/15 pb-4 mb-1">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center shrink-0">
                        <Trophy className="w-6 h-6 text-[#00f0ff]" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-bold text-white text-2xl font-['Hanken_Grotesk'] tracking-tight">
                          Active Competitions
                        </h3>
                        <p className="text-xs font-['JetBrains_Mono',monospace] font-bold text-[#00f0ff] tracking-widest mt-0.5">
                          3 MATCHES LIVE NOW
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowSignInModal(true)}
                      className="text-sm font-semibold font-['Hanken_Grotesk'] text-[#00f0ff] hover:text-[#7df4ff] flex items-center gap-1.5 cursor-pointer transition-colors group"
                    >
                      <span>View All Matches</span>
                      <ArrowRight className="w-4 h-4 text-[#00f0ff] group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Mini Competition Cards Stack */}
                  <div className="flex flex-col gap-3.5">

                    {/* Mini Card 1 */}
                    <div
                      onClick={() => setShowSignInModal(true)}
                      className="rounded-2xl border border-[#00f0ff]/20 bg-[#080e18] p-4 flex items-center justify-between gap-4 hover:border-[#00f0ff]/50 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Date Box */}
                        <div className="w-16 h-16 rounded-xl border border-[#00f0ff]/30 bg-[#00f0ff]/5 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[11px] font-bold font-['JetBrains_Mono',monospace] text-[#00f0ff] tracking-widest uppercase">
                            JUL
                          </span>
                          <span className="text-xl font-bold font-['Hanken_Grotesk'] text-white leading-none mt-1">
                            28
                          </span>
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex flex-col min-w-0">
                          <h4 className="font-bold text-white text-lg font-['Hanken_Grotesk'] group-hover:text-[#00f0ff] transition-colors truncate">
                            Monrovia Masters 2024
                          </h4>
                          <p className="text-xs font-medium text-[#9aa0a6] mt-1 truncate">
                            Badminton <span className="text-[#00f0ff]">•</span> 32 Teams <span className="text-[#00f0ff]">•</span> Pro Level <span className="text-[#00f0ff]">•</span> Delhi
                          </p>
                        </div>
                      </div>

                      {/* Circular Arrow Button */}
                      <div className="w-10 h-10 rounded-full border border-[#00f0ff]/30 bg-transparent flex items-center justify-center text-[#00f0ff] group-hover:bg-[#00f0ff] group-hover:text-[#00262b] transition-all shrink-0">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Mini Card 2 */}
                    <div
                      onClick={() => setShowSignInModal(true)}
                      className="rounded-2xl border border-[#00f0ff]/20 bg-[#080e18] p-4 flex items-center justify-between gap-4 hover:border-[#00f0ff]/50 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Date Box */}
                        <div className="w-16 h-16 rounded-xl border border-[#00f0ff]/30 bg-[#00f0ff]/5 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[11px] font-bold font-['JetBrains_Mono',monospace] text-[#00f0ff] tracking-widest uppercase">
                            JUL
                          </span>
                          <span className="text-xl font-bold font-['Hanken_Grotesk'] text-white leading-none mt-1">
                            30
                          </span>
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex flex-col min-w-0">
                          <h4 className="font-bold text-white text-lg font-['Hanken_Grotesk'] group-hover:text-[#00f0ff] transition-colors truncate">
                            Weekend Warriors Championship
                          </h4>
                          <p className="text-xs font-medium text-[#9aa0a6] mt-1 truncate">
                            Football <span className="text-[#00f0ff]">•</span> 16 Teams <span className="text-[#00f0ff]">•</span> Amateur <span className="text-[#00f0ff]">•</span> Mumbai
                          </p>
                        </div>
                      </div>

                      {/* Circular Arrow Button */}
                      <div className="w-10 h-10 rounded-full border border-[#00f0ff]/30 bg-transparent flex items-center justify-center text-[#00f0ff] group-hover:bg-[#00f0ff] group-hover:text-[#00262b] transition-all shrink-0">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Mini Card 3 */}
                    <div
                      onClick={() => setShowSignInModal(true)}
                      className="rounded-2xl border border-[#00f0ff]/20 bg-[#080e18] p-4 flex items-center justify-between gap-4 hover:border-[#00f0ff]/50 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Date Box */}
                        <div className="w-16 h-16 rounded-xl border border-[#00f0ff]/30 bg-[#00f0ff]/5 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[11px] font-bold font-['JetBrains_Mono',monospace] text-[#00f0ff] tracking-widest uppercase">
                            AUG
                          </span>
                          <span className="text-xl font-bold font-['Hanken_Grotesk'] text-white leading-none mt-1">
                            02
                          </span>
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex flex-col min-w-0">
                          <h4 className="font-bold text-white text-lg font-['Hanken_Grotesk'] group-hover:text-[#00f0ff] transition-colors truncate">
                            3x3 Street Basketball League
                          </h4>
                          <p className="text-xs font-medium text-[#9aa0a6] mt-1 truncate">
                            Basketball <span className="text-[#00f0ff]">•</span> 24 Teams <span className="text-[#00f0ff]">•</span> All Levels <span className="text-[#00f0ff]">•</span> Bengaluru
                          </p>
                        </div>
                      </div>

                      {/* Circular Arrow Button */}
                      <div className="w-10 h-10 rounded-full border border-[#00f0ff]/30 bg-transparent flex items-center justify-center text-[#00f0ff] group-hover:bg-[#00f0ff] group-hover:text-[#00262b] transition-all shrink-0">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>

                  </div>

                  {/* FEATURED "UP NEXT" CARD */}
                  <div
                    onClick={() => setShowSignInModal(true)}
                    className="rounded-2xl border-2 border-[#00f0ff]/50 bg-gradient-to-r from-[#00f0ff]/10 via-[#0a111e] to-[#0a101b] p-5 flex items-center justify-between gap-4 mt-2 shadow-[0_0_25px_rgba(0,240,255,0.15)] cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Left Icon Box */}
                      <div className="w-14 h-14 rounded-2xl border border-[#00f0ff]/50 bg-[#00f0ff]/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        <Trophy className="w-7 h-7 text-[#00f0ff]" />
                      </div>

                      {/* Center Info Stack */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                          <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#00f0ff] tracking-widest uppercase">
                            UP NEXT • FEATURED
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-xl font-['Hanken_Grotesk'] group-hover:text-[#00f0ff] transition-colors">
                          3x3 Street League
                        </h4>
                        <p className="text-xs font-medium text-[#9aa0a6]">
                          Registration Open <span className="text-[#00f0ff]">•</span> Starts in 2 Days
                        </p>
                      </div>
                    </div>

                    {/* Right Date Badge & Arrow Stack */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-3 py-1.5 rounded-lg border border-[#00f0ff]/40 bg-[#00f0ff]/10 font-['JetBrains_Mono',monospace] font-bold text-xs text-[#00f0ff] uppercase tracking-wider">
                        AUG 02
                      </span>
                      <div className="w-10 h-10 rounded-full border border-[#00f0ff]/40 bg-transparent flex items-center justify-center text-[#00f0ff] group-hover:bg-[#00f0ff] group-hover:text-[#00262b] transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FEATURE: PLAYURE AI COACH & MULTI-AGENT SYSTEM */}
        <section className="w-full py-16 sm:py-24 relative bg-[#0D1117] border-b border-white/5 overflow-hidden">
          {/* Background Ambient Radial Glow & Grid Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00f0ff]/10 rounded-full blur-[180px] pointer-events-none" />

          <div className="w-full max-w-[1360px] mx-auto px-6 sm:px-12 lg:px-16 relative z-10" style={{ paddingLeft: 'max(1.5rem, 5%)', paddingRight: 'max(1.5rem, 5%)' }}>

            {/* Split Hero Header Layout matching professional redesign */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
              {/* Left Side (Content) */}
              <div className="lg:col-span-7 text-left flex flex-col items-start gap-5">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                  <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#00f0ff] uppercase tracking-wider">
                    AI POWERED • ATHLETE FOCUSED
                  </span>
                </div>

                {/* Heading */}
                <h2 className="font-['Hanken_Grotesk'] text-4xl sm:text-5xl lg:text-[54px] font-black text-white leading-[1.1] tracking-tight">
                  Meet Your Elite <br />
                  <span className="text-[#00f0ff]">AI Training</span> Partner
                </h2>

                {/* Subtitle */}
                <p className="text-[#b9cacb] font-light leading-relaxed max-w-xl text-sm sm:text-base">
                  A multi-agent high-performance suite designed to optimize every facet of your athletic journey. From injury prevention to scouting resume creation.
                </p>

                {/* CTA Button */}
                <div className="pt-2">
                  <button
                    onClick={() => setShowSignInModal(true)}
                    className="bg-[#00f0ff] text-[#002022] font-['Hanken_Grotesk'] font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center gap-2"
                  >
                    <span>Try AI Coach</span>
                    <ArrowRight className="w-4 h-4 text-[#002022]" />
                  </button>
                </div>
              </div>

              {/* Right Side (Visual Mockup - Dynamic Agent Circular Orbs) */}
              <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[400px] flex items-center justify-center select-none">
                {/* Background decorative wave grids */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                
                {/* Cosmic Orbits and Connection SVG */}
                <svg className="absolute w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] text-[#00f0ff]/20 animate-[spin_60s_linear_infinite]" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 4" fill="none" />
                  <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5 2" fill="none" />
                  <circle cx="100" cy="100" r="75" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" strokeDasharray="10 180" fill="none" />
                </svg>

                {/* Additional slow reverse rotation ring for high-fidelity look */}
                <div className="absolute w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] border border-dashed border-[#00f0ff]/10 rounded-full animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />

                {/* Center Core: Glowing Playure P Logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 bg-[#0b0e14]/95 border-2 border-[#00f0ff]/40 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.25)] z-20 group">
                  {/* Subtle inner pulse ring */}
                  <div className="absolute inset-1 border border-[#00f0ff]/20 rounded-full animate-pulse" />
                  <img
                    src="/playure-logo.png"
                    alt="Playure Logo Core"
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow-[0_0_8px_rgba(0,240,255,0.65)]"
                  />
                </div>

                {/* Satellite 1: Top (Training / Activity) */}
                <div className="absolute top-[14%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-[#0c1220]/95 border border-[#00f0ff]/40 hover:border-[#00f0ff] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_22px_rgba(0,240,255,0.55)] transition-all duration-300 z-20 group cursor-pointer">
                  <Activity className="w-5 h-5 text-[#00f0ff] group-hover:scale-110 transition-transform" />
                </div>

                {/* Satellite 2: Top-Right (Pulse / Health) */}
                <div className="absolute top-[32%] left-[84%] -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-[#0c1220]/95 border border-[#00f0ff]/40 hover:border-[#00f0ff] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_22px_rgba(0,240,255,0.55)] transition-all duration-300 z-20 group cursor-pointer">
                  <Heart className="w-5 h-5 text-[#00f0ff] group-hover:scale-110 transition-transform" />
                </div>

                {/* Satellite 3: Bottom-Right (Dumbbell / Strength) */}
                <div className="absolute top-[75%] left-[71%] -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-[#0c1220]/95 border border-[#00f0ff]/40 hover:border-[#00f0ff] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_22px_rgba(0,240,255,0.55)] transition-all duration-300 z-20 group cursor-pointer">
                  <Dumbbell className="w-5 h-5 text-[#00f0ff] group-hover:scale-110 transition-transform" />
                </div>

                {/* Satellite 4: Bottom-Left (Clipboard Checklist / Scouting) */}
                <div className="absolute top-[75%] left-[29%] -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-[#0c1220]/95 border border-[#00f0ff]/40 hover:border-[#00f0ff] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_22px_rgba(0,240,255,0.55)] transition-all duration-300 z-20 group cursor-pointer">
                  <ClipboardCheck className="w-5 h-5 text-[#00f0ff] group-hover:scale-110 transition-transform" />
                </div>

                {/* Satellite 5: Top-Left (Chart / Analytics) */}
                <div className="absolute top-[32%] left-[16%] -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-[#0c1220]/95 border border-[#00f0ff]/40 hover:border-[#00f0ff] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_22px_rgba(0,240,255,0.55)] transition-all duration-300 z-20 group cursor-pointer">
                  <BarChart2 className="w-5 h-5 text-[#00f0ff] group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>

            {/* Compact Bento Grid & Chat Box Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

              {/* Left Side: 4 Compact Agent Bento Cards (7 cols) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* 1. Training Agent Card */}
                <div
                  onClick={() => setShowSignInModal(true)}
                  className="bg-[#161B22]/80 backdrop-blur-md border border-white/10 rounded-xl p-5 flex flex-col justify-between group cursor-pointer hover:bg-[#1e2024] hover:border-[#00f0ff]/40 transition-all duration-300 shadow-xl min-h-[175px] relative overflow-hidden"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1502224562085-639556652f33?w=400&auto=format&fit=crop&q=80" 
                    alt="Track background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none mix-blend-luminosity group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="flex justify-between items-center mb-3 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-xl">directions_run</span>
                    </div>
                    <span className="font-['JetBrains_Mono',monospace] text-[9px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 shrink-0">
                      ACTIVE
                    </span>
                  </div>
                  <div className="relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-white mb-1">
                        Training Agent
                      </h3>
                      <p className="text-xs text-[#b9cacb] leading-relaxed">
                        Adaptive micro-cycles, weekly 1RM calculation, and workload management.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#00f0ff] font-semibold mt-4 transition-colors group-hover:text-[#7df4ff]">
                      <span>Open Agent</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* 2. Physio Agent Card */}
                <div
                  onClick={() => setShowSignInModal(true)}
                  className="bg-[#161B22]/80 backdrop-blur-md border border-white/10 rounded-xl p-5 flex flex-col justify-between group cursor-pointer hover:bg-[#1e2024] hover:border-[#00f0ff]/40 transition-all duration-300 shadow-xl min-h-[175px] relative overflow-hidden"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&auto=format&fit=crop&q=80" 
                    alt="Skeleton background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none mix-blend-luminosity group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="flex justify-between items-center mb-3 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-xl">health_and_safety</span>
                    </div>
                    <span className="font-['JetBrains_Mono',monospace] text-[9px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 shrink-0">
                      STANDBY
                    </span>
                  </div>
                  <div className="relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-white mb-1">
                        Physio Agent
                      </h3>
                      <p className="text-xs text-[#b9cacb] leading-relaxed">
                        Symptom checker, mobility routines, and injury recovery timelines.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#00f0ff] font-semibold mt-4 transition-colors group-hover:text-[#7df4ff]">
                      <span>Open Agent</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* 3. Nutrition Agent Card */}
                <div
                  onClick={() => setShowSignInModal(true)}
                  className="bg-[#161B22]/80 backdrop-blur-md border border-white/10 rounded-xl p-5 flex flex-col justify-between group cursor-pointer hover:bg-[#1e2024] hover:border-[#00f0ff]/40 transition-all duration-300 shadow-xl min-h-[175px] relative overflow-hidden"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&auto=format&fit=crop&q=80" 
                    alt="Salad background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none mix-blend-luminosity group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="flex justify-between items-center mb-3 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-xl">restaurant</span>
                    </div>
                    <span className="font-['JetBrains_Mono',monospace] text-[9px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 shrink-0">
                      STANDBY
                    </span>
                  </div>
                  <div className="relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-white mb-1">
                        Nutrition Agent
                      </h3>
                      <p className="text-xs text-[#b9cacb] leading-relaxed">
                        BMR & TDEE calculation, macronutrient targets, and meal timing.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#00f0ff] font-semibold mt-4 transition-colors group-hover:text-[#7df4ff]">
                      <span>Open Agent</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* 4. Resume Builder Card */}
                <div
                  onClick={() => setShowSignInModal(true)}
                  className="bg-[#161B22]/80 backdrop-blur-md border border-[#00f0ff]/40 hover:border-[#00f0ff] rounded-xl p-5 flex flex-col justify-between group cursor-pointer relative overflow-hidden transition-all duration-300 shadow-xl min-h-[175px]"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&auto=format&fit=crop&q=80" 
                    alt="Resume background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none mix-blend-luminosity group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-0 right-0 w-28 h-28 bg-[#00f0ff]/10 blur-2xl -mr-14 -mt-14 rounded-full pointer-events-none" />

                  <div className="flex justify-between items-center mb-3 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-xl">edit_document</span>
                    </div>
                    <span className="font-['JetBrains_Mono',monospace] text-[9px] font-bold text-[#FFD700] bg-[#FFD700]/10 px-2 py-0.5 rounded flex items-center gap-1 border border-[#FFD700]/30 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
                      HIGHLIGHT
                    </span>
                  </div>

                  <div className="relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-white mb-1">
                        Resume Builder
                      </h3>
                      <p className="text-xs text-[#b9cacb] leading-relaxed">
                        Scouting-ready CV generation, career stats, and objective layout.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#FFD700] font-semibold mt-4 transition-colors group-hover:text-yellow-300">
                      <span>Open Agent</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Side: Compact Chat Mockup (5 cols) */}
              <div className="lg:col-span-5 flex flex-col h-full">

                {/* Interactive Chat Box Mockup */}
                <div className="bg-[#161B22]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-5 flex-1 h-full min-h-[350px] sm:min-h-[360px] flex flex-col justify-between relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent" />

                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]">
                        <span className="material-symbols-outlined text-base">smart_toy</span>
                      </div>
                      <div>
                        <h4 className="font-['Hanken_Grotesk'] font-bold text-white text-sm leading-none mb-0.5">
                          Playure Coach
                        </h4>
                        <span className="font-['JetBrains_Mono',monospace] text-[9px] font-bold text-[#00FF41] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41]" />
                          ONLINE
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#849495] text-base">more_horiz</span>
                  </div>

                  {/* Message Stream */}
                  <div className="space-y-3 mb-3 text-xs flex-1 overflow-y-auto pr-1">

                    {/* User Question */}
                    <div className="flex flex-col items-end">
                      <div className="bg-[#282a2e] text-[#e2e2e8] px-3 py-2 rounded-xl rounded-tr-sm max-w-[88%] font-['Inter',sans-serif]">
                        How is my sprint endurance tracking this week?
                      </div>
                      <span className="font-['JetBrains_Mono',monospace] text-[9px] text-[#849495] mt-0.5">10:42 AM</span>
                    </div>

                    {/* AI Response */}
                    <div className="flex flex-col items-start">
                      <div className="bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-white px-3.5 py-2.5 rounded-xl rounded-tl-sm max-w-[92%] leading-relaxed font-['Inter',sans-serif]">
                        Your VO2 max output has increased by 3.2% compared to last micro-cycle. Recommend shifting today's session to Zone 2 recovery.
                      </div>
                      <span className="font-['JetBrains_Mono',monospace] text-[9px] text-[#849495] mt-0.5">10:43 AM</span>
                    </div>

                    {/* Quick Suggested Prompts */}
                    <div className="pt-3 border-t border-white/5">
                      <span className="font-['JetBrains_Mono',monospace] text-[9px] font-bold text-[#849495] uppercase tracking-wider block mb-2">
                        SUGGESTED AGENT PROMPTS:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span
                          onClick={() => setShowSignInModal(true)}
                          className="text-[10px] bg-[#0c0e12] hover:bg-[#1e2024] text-[#00f0ff] px-2.5 py-1 rounded-md border border-[#00f0ff]/30 hover:border-[#00f0ff] transition-all cursor-pointer font-['Inter']"
                        >
                          "Generate Scouting Resume"
                        </span>
                        <span
                          onClick={() => setShowSignInModal(true)}
                          className="text-[10px] bg-[#0c0e12] hover:bg-[#1e2024] text-gray-300 px-2.5 py-1 rounded-md border border-white/10 hover:border-[#00f0ff]/40 transition-all cursor-pointer font-['Inter']"
                        >
                          "Calculate 1RM Bench"
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Input Mockup Box */}
                  <div
                    onClick={() => setShowSignInModal(true)}
                    className="relative cursor-pointer group mt-auto shrink-0"
                  >
                    <input
                      readOnly
                      type="text"
                      placeholder="Ask your AI agent..."
                      className="w-full bg-[#0c0e12]/90 border border-white/10 group-hover:border-[#00f0ff]/50 text-white text-xs rounded-lg py-2.5 pl-3.5 pr-9 focus:outline-none transition-colors cursor-pointer"
                    />
                    <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#00f0ff] group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-lg">send</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* FEATURE 2: SQUAD BUILDER & COLLABORATION SECTION */}
        <section className="w-full min-h-screen py-32 md:py-44 flex items-center justify-center relative bg-[#0c0e12] border-b border-white/5 overflow-hidden">
          {/* Background Ambient Radial Glow */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[160px] pointer-events-none" />

          <div className="w-full px-8 sm:px-14 lg:px-16 relative z-10" style={{ maxWidth: '1360px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: 'max(1.5rem, 5%)', paddingRight: 'max(1.5rem, 5%)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Left Column (Collaboration Hub Redesigned Card) */}
              <div className="w-full flex justify-center lg:justify-start order-2 lg:order-1">
                <div 
                  className="w-full max-w-[660px] bg-[#040812] border border-[#00f0ff]/30 rounded-3xl p-8 sm:p-10 flex flex-col gap-5 shadow-[0_0_40px_rgba(0,240,255,0.1)] relative overflow-hidden backdrop-blur-2xl"
                  style={{ padding: "2.5rem 2rem" }}
                >

                  {/* Top Neon Ambient Bar */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-80" />

                  {/* Header Section */}
                  <div className="flex items-center justify-between border-b border-[#00f0ff]/15 pb-4 mb-1">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6 text-[#00f0ff]" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-bold text-white text-2xl font-['Hanken_Grotesk'] tracking-tight">
                          Collaboration Hub
                        </h3>
                        <p className="text-xs font-['JetBrains_Mono',monospace] font-bold text-[#00f0ff] tracking-widest mt-0.5">
                          3 ACTIVE SQUAD REQUESTS
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowSignInModal(true)}
                      className="text-sm font-semibold font-['Hanken_Grotesk'] text-[#00f0ff] hover:text-[#7df4ff] flex items-center gap-1.5 cursor-pointer transition-colors group"
                    >
                      <span>Explore All</span>
                      <ArrowRight className="w-4 h-4 text-[#00f0ff] group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Mini Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

                    {/* Mini Card 1: Rahul Dravid */}
                    <div
                      onClick={() => setShowSignInModal(true)}
                      className="rounded-2xl border border-[#00f0ff]/20 bg-[#080e18] p-4 flex flex-col justify-between gap-4 hover:border-[#00f0ff]/50 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl border border-[#00f0ff]/30 bg-[#00f0ff]/10 flex items-center justify-center shrink-0 font-bold text-white text-base font-['Hanken_Grotesk']">
                          RD
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h4 className="font-bold text-white text-base font-['Hanken_Grotesk'] group-hover:text-[#00f0ff] transition-colors truncate">
                            Rahul Dravid
                          </h4>
                          <p className="text-xs font-semibold text-[#00f0ff] mt-0.5 truncate flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5 text-[#00f0ff]" />
                            <span>Football Squad</span>
                          </p>
                          <p className="text-xs font-medium text-[#9aa0a6] mt-0.5 truncate">
                            Turf Park, Koramangala
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowSignInModal(true)}
                        className="w-full bg-[#00f0ff]/10 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#00262b] border border-[#00f0ff]/40 font-bold font-['Hanken_Grotesk'] text-xs py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <span>COLLABORATE</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Mini Card 2: Sneha Reddy (Purple Themed) */}
                    <div
                      onClick={() => setShowSignInModal(true)}
                      className="rounded-2xl border border-purple-500/20 bg-[#080e18] p-4 flex flex-col justify-between gap-4 hover:border-purple-500/50 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl border border-purple-500/30 bg-purple-500/10 flex items-center justify-center shrink-0 font-bold text-white text-base font-['Hanken_Grotesk']">
                          SR
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h4 className="font-bold text-white text-base font-['Hanken_Grotesk'] group-hover:text-purple-400 transition-colors truncate">
                            Sneha Reddy
                          </h4>
                          <p className="text-xs font-semibold text-purple-400 mt-0.5 truncate flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-purple-400" />
                            <span>Badminton Partner</span>
                          </p>
                          <p className="text-xs font-medium text-[#9aa0a6] mt-0.5 truncate">
                            Indiranagar Club
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowSignInModal(true)}
                        className="w-full bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-[#0c0e12] border border-purple-500/40 hover:border-purple-500 font-bold font-['Hanken_Grotesk'] text-xs py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <span>COLLABORATE</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* FEATURED QUICK SQUAD MATCH CARD */}
                  <div
                    onClick={() => setShowSignInModal(true)}
                    className="rounded-2xl border-2 border-[#00f0ff]/50 bg-gradient-to-r from-[#00f0ff]/10 via-[#0a111e] to-[#0a101b] p-5 flex items-center justify-between gap-4 mt-2 shadow-[0_0_25px_rgba(0,240,255,0.15)] cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl border border-[#00f0ff]/50 bg-[#00f0ff]/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        <Users className="w-7 h-7 text-[#00f0ff]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                          <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#00f0ff] tracking-widest uppercase">
                            MATCHFINDER • LIVE
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-xl font-['Hanken_Grotesk'] group-hover:text-[#00f0ff] transition-colors">
                          Create Squad Post
                        </h4>
                        <p className="text-xs font-medium text-[#9aa0a6]">
                          Find players for match today <span className="text-[#00f0ff]">•</span> Koramangala
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-3.5 py-2 rounded-xl bg-[#00f0ff] font-['JetBrains_Mono',monospace] font-bold text-xs text-[#00262b] uppercase tracking-wider whitespace-nowrap shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        POST NOW
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column Content */}
              <div className="w-full flex flex-col items-start gap-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/40 bg-red-500/10">
                  <Users className="w-4 h-4 text-red-400" />
                  <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-red-400 uppercase tracking-widest">
                    SQUAD BUILDER
                  </span>
                </div>

                <h2 className="font-['Hanken_Grotesk'] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight uppercase tracking-tight">
                  BUILD YOUR <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-[#fed639]">DREAM TEAM</span>
                </h2>

                <p className="text-base sm:text-lg text-[#b9cacb] max-w-lg font-light leading-relaxed">
                  Build your squad, scout opponents, and network with professionals. Find the missing piece for your next big match.
                </p>

                <div className="flex flex-wrap gap-4 mt-2">
                  <button
                    onClick={() => setShowSignInModal(true)}
                    className="bg-white text-[#0c0e12] font-['Hanken_Grotesk'] font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-gray-200 transition-all cursor-pointer shadow-lg active:scale-95"
                  >
                    Find Players
                  </button>

                  <button
                    onClick={() => setShowSignInModal(true)}
                    className="bg-[#161B22] text-white font-['Hanken_Grotesk'] font-semibold text-sm px-8 py-3.5 rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer active:scale-95"
                  >
                    Post Request
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FEATURE 3: PRO ATHLETE PROFILES SECTION */}
        <section className="w-full min-h-screen py-32 md:py-44 flex items-center justify-center relative bg-[#0c0e12] overflow-hidden">
          {/* Background Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#00f0ff]/10 rounded-full blur-[170px] pointer-events-none" />

          <div className="w-full px-8 sm:px-14 lg:px-16 relative z-10" style={{ maxWidth: '1360px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Left Column Content */}
              <div className="w-full flex flex-col items-start gap-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10">
                  <User className="w-4 h-4 text-[#00f0ff]" />
                  <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-[#00f0ff] uppercase tracking-widest">
                    PRO ATHLETE RESUME
                  </span>
                </div>

                <h2 className="font-['Hanken_Grotesk'] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight uppercase tracking-tight">
                  PROFESSIONAL <br />
                  <span className="text-[#00f0ff]">PROFILES</span>
                </h2>

                <p className="text-base sm:text-lg text-[#b9cacb] max-w-lg font-light leading-relaxed">
                  Showcase your stats, match history, and achievements. A data-driven resume built for scouts and sponsors.
                </p>

                <div className="flex flex-wrap gap-4 w-full max-w-md mt-2">
                  <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6 backdrop-blur-md flex-1 min-w-[140px] shadow-xl">
                    <div className="font-['JetBrains_Mono',monospace] text-xs text-[#00f0ff] mb-2 uppercase tracking-widest">Win Rate</div>
                    <div className="font-['Hanken_Grotesk'] text-4xl text-white font-black">78.4%</div>
                  </div>

                  <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6 backdrop-blur-md flex-1 min-w-[140px] shadow-xl">
                    <div className="font-['JetBrains_Mono',monospace] text-xs text-[#fed639] mb-2 uppercase tracking-widest">Matches</div>
                    <div className="font-['Hanken_Grotesk'] text-4xl text-white font-black">1,204</div>
                  </div>
                </div>
              </div>

              {/* Right Column Profile Visual */}
              <div className="w-full flex justify-center lg:justify-end">
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 rounded-full border border-[#00f0ff]/20 animate-[spin_20s_linear_infinite]" />
                  <div className="absolute inset-4 rounded-full border border-dashed border-white/20 animate-[spin_30s_linear_infinite_reverse]" />
                  <div className="absolute inset-12 bg-[#161B22] rounded-full flex items-center justify-center p-8 border border-white/15 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#282a2e] to-[#1e2024] flex flex-col items-center justify-center text-center p-6 shadow-inner">
                      <Bot className="w-20 h-20 text-[#00f0ff] mb-3" />
                      <div className="bg-[#00f0ff] text-[#002022] font-['JetBrains_Mono',monospace] px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.5)]">
                        Top 1% Player
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-16 bg-[#080a0d] border-t border-white/5 mt-auto relative z-10 flex justify-center">
        <div className="w-full px-8 sm:px-14 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-8" style={{ maxWidth: '1360px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="font-['Hanken_Grotesk'] text-2xl font-extrabold text-[#00f0ff] tracking-tighter uppercase">
            Playure.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8">
            <a href="#" className="text-xs text-[#b9cacb] hover:text-white transition-colors">About Us</a>
            <a href="#" className="text-xs text-[#b9cacb] hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-[#b9cacb] hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-[#b9cacb] hover:text-white transition-colors">Contact Support</a>
          </div>

          <div className="font-['JetBrains_Mono',monospace] text-xs text-[#b9cacb]/50 uppercase tracking-widest">
            © 2026 Playure. Elevating Sports Excellence.
          </div>
        </div>
      </footer>

      {/* Custom Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSwitchToSignUp={() => {
          setShowSignInModal(false);
          setShowSignUpModal(true);
        }}
        onSuccess={() => {
          setShowSignInModal(false);
          if (onSignInSuccess) onSignInSuccess();
        }}
      />

      {/* Custom Sign Up Modal */}
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSwitchToSignIn={() => {
          setShowSignUpModal(false);
          setShowSignInModal(true);
        }}
        onSuccess={() => {
          setShowSignUpModal(false);
          if (onSignInSuccess) onSignInSuccess();
        }}
      />

      {/* Demo Video Preview Modal */}
      {showDemoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowDemoModal(false)}
        >
          <div
            className="bg-[#161B22] border border-white/10 rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-28 -mx-8 -mt-8 mb-6 overflow-hidden border-b border-white/10">
              <img src="/sports-hero-bg.png" alt="Sports Banner" className="w-full h-full object-cover filter brightness-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] to-transparent" />
            </div>

            <h3 className="text-2xl font-extrabold text-white font-['Hanken_Grotesk'] mb-2">
              Welcome to Playure Platform Demo
            </h3>
            <p className="text-sm text-[#b9cacb] font-['Inter'] mb-6 leading-relaxed">
              Experience seamless tournament tracking, team scouting, and match booking built for Indian sports players.
            </p>
            <div className="bg-[#111318] border border-white/10 rounded-xl p-6 mb-6 text-center">
              <span className="text-4xl block mb-2">🏆 🇮🇳 🏏</span>
              <p className="text-sm text-white font-semibold font-['Hanken_Grotesk']">Interactive Platform Preview</p>
            </div>
            <button
              className="w-full py-3 bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-['Hanken_Grotesk'] font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              onClick={() => {
                setShowDemoModal(false);
                setShowSignUpModal(true);
              }}
            >
              Join Playure Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}