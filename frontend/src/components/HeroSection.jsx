import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import heroImg from "../assets/her.png";

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.12 } } },
  item: { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } },
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#07060f]">
      {/* Radial glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-purple-900/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-pink-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-900/15 rounded-full blur-[80px] pointer-events-none" />

      {/* Grid lines background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-16 items-center py-24 md:py-0">
        {/* Left — Text */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="show"
          className="flex flex-col"
        >
          {/* Pill badge */}
          <motion.div variants={stagger.item} className="mb-8">
            <span className="inline-flex items-center gap-2 bg-purple-900/40 border border-purple-700/50 text-purple-300 text-xs tracking-[0.12em] px-4 py-2 rounded-full">
              <Zap size={12} className="text-purple-400" fill="currentColor" />
              POWERED BY OOTDIFFUSION AI
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={stagger.item}
            className="leading-none mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="block text-[clamp(3.5rem,8vw,7rem)] text-white tracking-wider">
              WEAR IT
            </span>
            <span className="block text-[clamp(3.5rem,8vw,7rem)] tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              BEFORE
            </span>
            <span className="block text-[clamp(3.5rem,8vw,7rem)] text-white tracking-wider">
              YOU BUY
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={stagger.item}
            className="text-gray-400 text-lg leading-relaxed max-w-md mb-10"
          >
            Upload your photo and any garment — our AI virtually dresses you in seconds. No fitting room needed.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={stagger.item} className="flex flex-wrap gap-4">
            <Link
              to="/aitryon"
              className="group flex items-center gap-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-7 py-3.5 rounded-full font-medium transition-all duration-200 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]"
            >
              <Sparkles size={16} />
              Try AI Now
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/shop"
              className="flex items-center gap-2 border border-gray-700 hover:border-purple-600 text-gray-300 hover:text-white px-7 py-3.5 rounded-full font-medium transition-all duration-200"
            >
              Browse Shop
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={stagger.item}
            className="mt-12 flex gap-8 border-t border-purple-900/30 pt-8"
          >
            {[
              { num: "50K+", label: "Try-ons done" },
              { num: "98%", label: "Accuracy" },
              { num: "< 30s", label: "Per result" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                  {s.num}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
          className="hidden md:flex justify-center items-center relative"
        >
          {/* Decorative ring */}
          <div className="absolute w-[420px] h-[420px] rounded-full border border-purple-800/30 animate-[spin_30s_linear_infinite]" />
          <div className="absolute w-[340px] h-[340px] rounded-full border border-pink-900/20 animate-[spin_20s_linear_infinite_reverse]" />

         {/* Central card */}
<div className="relative w-[300px] h-[400px] rounded-3xl overflow-hidden border border-purple-800/40 shadow-[0_0_80px_rgba(168,85,247,0.2)]">
  
  {/* Image FIRST */}
  <img
    src={heroImg}
    alt="AI Fashion"
    className="w-full h-full object-cover"
    onError={(e) => {
      e.currentTarget.style.display = "none";
    }}
  />

  {/* Overlay AFTER image */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-transparent to-pink-900/30" />

  {/* Overlay badge */}
  <div className="absolute bottom-5 left-5 right-5 bg-black/60 backdrop-blur-md border border-purple-700/40 rounded-xl px-4 py-3">
    <p className="text-xs text-purple-300 tracking-widest mb-1">
      AI GENERATED
    </p>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      <p className="text-sm text-white font-medium">
        Try-On Ready
      </p>
    </div>
  </div>

</div>

          {/* Floating tags */}
          {[
            { label: "OOTDiffusion", top: "10%", right: "-5%", color: "purple" },
            { label: "Instant Results", bottom: "15%", left: "-8%", color: "pink" },
          ].map((tag) => (
            <motion.div
              key={tag.label}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: tag.color === "pink" ? 1.5 : 0 }}
              className={`absolute bg-${tag.color}-900/80 backdrop-blur-sm border border-${tag.color}-700/50 text-${tag.color}-200 text-xs px-3 py-1.5 rounded-full`}
              style={{ top: tag.top, right: tag.right, bottom: tag.bottom, left: tag.left }}
            >
              {tag.label}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-purple-700" />
        <span className="text-[10px] tracking-widest">SCROLL</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
