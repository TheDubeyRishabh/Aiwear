import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud, Sparkles, Loader2, Download, RefreshCw,
  X, Info, CheckCircle, ImagePlus, Shirt, ChevronDown, Zap
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ─── Garment categories ─────────────────────────────────────────── */
const garments = [
  { id: 1, image: "/samples/cl1.png" },
  { id: 2, image: "/samples/cl2.png" },
  { id: 3, image: "/samples/cl3.png" },
  { id: 4, image: "/samples/cl4.png" },
  { id: 5, image: "/samples/cl5.png" },
  { id: 6, image: "/samples/cl6.png" },
  { id: 7, image: "/samples/cl7.png" },
  { id: 8, image: "/samples/cl8.png" },
  { id: 9, image: "/samples/cl9.png" },
  { id: 10, image: "/samples/cl10.png" },
];
/* ─── Sample human images ────────────────────────────────────────── */
/* Place your model photos in /public/samples/human1.jpg … human12.jpg */
const sampleHumans = [
  { id: 1,  name: "Casual Woman 1",  image: "/samples/human1.jpg"  },
  { id: 2,  name: "Casual Man 1",    image: "/samples/human2.jpg"  },
  { id: 3,  name: "Casual Woman 2",  image: "/samples/human3.jpg"  },
  { id: 4,  name: "Casual Man 2",    image: "/samples/human4.jpg"  },
  { id: 5,  name: "Formal Woman",    image: "/samples/human5.jpg"  },
  { id: 6,  name: "Formal Man",      image: "/samples/human6.jpg"  },
  { id: 7,  name: "Sporty Woman",    image: "/samples/human7.jpg"  },
  { id: 8,  name: "Sporty Man",      image: "/samples/human8.jpg"  },
  { id: 9,  name: "Teen Girl",       image: "/samples/human9.jpg"  },
  { id: 10, name: "Teen Boy",        image: "/samples/human10.jpg" },
  { id: 11, name: "Plus Size Woman", image: "/samples/human11.jpg" },
  { id: 12, name: "Plus Size Man",   image: "/samples/human12.jpg" },
];

/* Demo defaults — first sample human + second garment */
const DEMO_HUMAN   = sampleHumans[0];
const DEMO_GARMENT = garments[1];

/* ─── Step badge ─────────────────────────────────────────────────── */
const StepBadge = ({ n, done, active }) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
      done
        ? "bg-green-600 text-white"
        : active
        ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
        : "bg-purple-950/60 border border-purple-900/50 text-gray-500"
    }`}
  >
    {done ? <CheckCircle size={16} /> : n}
  </div>
);

/* ─── SampleGrid component ───────────────────────────────────────── */
const SampleGrid = ({ selectedId, onSelect }) => (
  <div className="mt-5">
    {/* Divider label */}
    <div className="flex items-center gap-3 mb-3">
      <div className="flex-1 h-px bg-purple-900/30" />
      <span className="text-[10px] tracking-[0.18em] text-gray-600 font-medium whitespace-nowrap">
        OR TRY WITH A SAMPLE PHOTO
      </span>
      <div className="flex-1 h-px bg-purple-900/30" />
    </div>

    {/* Scrollable grid */}
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-52 overflow-y-auto pr-0.5
                    scrollbar-thin scrollbar-thumb-purple-900/60 scrollbar-track-transparent">
      {sampleHumans.map((h) => (
        <motion.div
          key={h.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onSelect(h)}
          title={h.name}
          className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${
            selectedId === h.id
              ? "border-pink-500 shadow-[0_0_16px_rgba(236,72,153,0.5)]"
              : "border-transparent hover:border-purple-700/60"
          }`}
        >
          {/* 3:4 portrait aspect */}
          <div className="aspect-[3/4] bg-purple-950/40 overflow-hidden">
            <img
              src={h.image}
              alt={h.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                /* Fallback: show initials placeholder */
                const parent = e.target.parentElement;
                e.target.style.display = "none";
                if (!parent.querySelector(".sample-fallback")) {
                  const fb = document.createElement("div");
                  fb.className =
                    "sample-fallback w-full h-full flex items-center justify-center text-purple-600 text-sm font-bold";
                  fb.textContent = h.name.charAt(0);
                  parent.appendChild(fb);
                }
              }}
            />
          </div>

          {/* Selected checkmark badge */}
          {selectedId === h.id && (
            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
              <CheckCircle size={10} className="text-white" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

/* ─── Main component ─────────────────────────────────────────────── */
const AiTryOn = () => {
  const { user } = useAuth();

  /* Image state */
  const [personFile, setPersonFile]       = useState(null);
  const [personPreview, setPersonPreview] = useState(null);
  const [clothFile, setClothFile]         = useState(null);
  const [clothPreview, setClothPreview]   = useState(null);
  const [customCloth, setCustomCloth]     = useState(false);
  const [selectedGarment, setSelectedGarment] = useState(null);

  /* Sample selection state */
  const [selectedSampleId, setSelectedSampleId] = useState(null);

  /* Optional VTON-D parameters */
  const [showAdvanced, setShowAdvanced]         = useState(false);
  const [clothingPrompt, setClothingPrompt]     = useState("");
  const [avatarPrompt, setAvatarPrompt]         = useState("");
  const [backgroundPrompt, setBackgroundPrompt] = useState("");
  const [avatarSex, setAvatarSex]               = useState("");

  /* Result state */
  const [result, setResult]     = useState(null);
  const [seedUsed, setSeedUsed] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);

  const personInputRef = useRef();
  const clothInputRef  = useRef();

  /* ── Handlers ────────────────────────────────────────────────── */

  const handlePersonUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPersonFile(file);
    setPersonPreview(URL.createObjectURL(file));
    setSelectedSampleId(null); // clear sample selection
    setResult(null);
  };

  const handleClothUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setClothFile(file);
    setClothPreview(URL.createObjectURL(file));
    setSelectedGarment(null);
    setCustomCloth(true);
    setResult(null);
  };

  const selectGarment = async (g) => {
    setSelectedGarment(g);
    setCustomCloth(false);
    setClothPreview(g.image);
    setResult(null);
    try {
      const blob = await fetch(g.image).then((r) => r.blob());
      const f = new File([blob], "garment.jpg", { type: blob.type || "image/jpeg" });
      setClothFile(f);
    } catch {
      toast.error("Could not load garment image");
    }
  };

  /* Select a sample human — mirrors garment selection logic */
  const selectSampleHuman = async (h) => {
    setSelectedSampleId(h.id);
    setPersonPreview(h.image);
    setResult(null);
    try {
      const blob = await fetch(h.image).then((r) => r.blob());
      const f = new File([blob], `sample-${h.id}.jpg`, {
        type: blob.type || "image/jpeg",
      });
      setPersonFile(f);
    } catch {
      toast.error("Could not load sample image");
    }
  };

  /* "Use Demo" — auto-selects first sample human + second garment */
  const handleUseDemo = () => {
    selectSampleHuman(DEMO_HUMAN);
    selectGarment(DEMO_GARMENT);
    toast("Demo loaded! Hit Generate to try it out.", { icon: "✨" });
  };

  const step1Done   = !!personFile;
  const step2Done   = !!clothFile;
  const canGenerate = step1Done && step2Done && !loading;

  const handleGenerate = async () => {
    if (!canGenerate) {
      if (!personFile) toast.error("Upload or select a person photo first");
      else if (!clothFile) toast.error("Select or upload a garment first");
      return;
    }

    setLoading(true);
    setResult(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => (p < 85 ? p + Math.random() * 12 : p));
    }, 600);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("person", personFile);
      formData.append("cloth",  clothFile);

      if (avatarSex)        formData.append("avatar_sex",        avatarSex);
      if (clothingPrompt)   formData.append("clothing_prompt",   clothingPrompt);
      if (avatarPrompt)     formData.append("avatar_prompt",     avatarPrompt);
      if (backgroundPrompt) formData.append("background_prompt", backgroundPrompt);

      const res = await axios.post(`${API}/tryon`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization:  `Bearer ${token}`,
        },
        timeout: 60000,
      });

      clearInterval(interval);
      setProgress(100);

      if (res.data.success) {
        setResult(res.data.image);
        setSeedUsed(res.data.seed);
        toast.success("AI outfit generated! 🎉");
      } else {
        toast.error(res.data.error || "Generation failed");
      }
    } catch (err) {
      clearInterval(interval);
      const msg = err?.response?.data?.error || err.message || "Server error";
      toast.error(`Failed: ${msg}`);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = result;
    a.download = `aiwear-tryon-${Date.now()}.jpg`;
    a.click();
  };

  const reset = () => {
    setPersonFile(null);      setPersonPreview(null);
    setClothFile(null);       setClothPreview(null);
    setSelectedGarment(null); setCustomCloth(false);
    setSelectedSampleId(null);
    setResult(null);          setSeedUsed(null);
    setClothingPrompt("");    setAvatarPrompt("");
    setBackgroundPrompt("");  setAvatarSex("");
  };

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#07060f] pb-24">

      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-purple-950/30 to-transparent pt-12 pb-16 px-6 text-center">
        <div className="absolute inset-0 bg-[url('/images/her.png')] bg-center bg-cover opacity-5 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <span className="inline-flex items-center gap-2 bg-purple-900/40 border border-purple-700/40 text-purple-300 text-xs tracking-[0.15em] px-4 py-2 rounded-full mb-6">
            <Sparkles size={12} /> VTON-D by Texel.Moda
          </span>
          <h1
            className="text-[clamp(3rem,7vw,5.5rem)] text-white leading-none tracking-wider"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI OUTFIT TRY-ON
          </h1>
          <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
            Upload your photo + a garment → see yourself wearing it in seconds
          </p>

          {/* Demo CTA in header */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleUseDemo}
            className="mt-6 inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-purple-700/40 hover:border-purple-500/60 text-purple-300 hover:text-white text-sm px-5 py-2.5 rounded-full transition-all"
          >
            <Zap size={14} className="text-yellow-400" />
            Quick Demo — auto-fill both steps
          </motion.button>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* ── Step indicators ── */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { n: 1, label: "Your Photo",     done: step1Done, active: !step1Done },
            { n: 2, label: "Choose Garment", done: step2Done, active: step1Done && !step2Done },
            { n: 3, label: "Generate",       done: !!result,  active: step1Done && step2Done },
          ].map((s, i, arr) => (
            <React.Fragment key={s.n}>
              <div className="flex items-center gap-2">
                <StepBadge {...s} />
                <span className={`text-sm hidden sm:block ${s.active ? "text-white" : s.done ? "text-green-400" : "text-gray-600"}`}>
                  {s.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className={`w-12 h-px transition-colors ${s.done ? "bg-green-600" : "bg-purple-900/40"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">

          {/* ── STEP 1: Upload person ── */}
          <div className="bg-[#0d0b1e] border border-purple-900/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-700/60 flex items-center justify-center text-xs font-bold text-white">1</div>
                <h2 className="text-white font-semibold">Your Photo</h2>
              </div>
              <div className="flex items-center gap-2">
                {/* Inline "Use Demo" pill */}
                {!personPreview && !clothPreview && (
                  <button
                    onClick={handleUseDemo}
                    className="flex items-center gap-1.5 text-xs bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-700/40 text-yellow-400 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <Zap size={11} /> Demo
                  </button>
                )}
                {personPreview && (
                  <button
                    onClick={() => {
                      setPersonFile(null);
                      setPersonPreview(null);
                      setSelectedSampleId(null);
                      setResult(null);
                    }}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Upload / preview area */}
            {personPreview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-64 rounded-xl overflow-hidden border border-purple-800/30 cursor-pointer"
                onClick={() => personInputRef.current?.click()}
              >
                <img src={personPreview} alt="Your photo" className="w-full h-full object-contain bg-purple-950/30" />
                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm bg-black/60 px-4 py-2 rounded-full">Change photo</span>
                </div>
                {/* Sample badge */}
                {selectedSampleId && (
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] bg-pink-600/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                      Sample
                    </span>
                  </div>
                )}
              </motion.div>
            ) : (
              <label className="flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-purple-900/50 hover:border-purple-600 cursor-pointer transition-colors bg-purple-950/10 hover:bg-purple-950/20 group">
                <UploadCloud size={32} className="text-purple-700 group-hover:text-purple-500 transition-colors mb-3" />
                <p className="text-gray-400 text-sm mb-1">Click to upload your photo</p>
                <p className="text-gray-600 text-xs">JPG, PNG, WEBP • Max 12 MB</p>
              </label>
            )}

            {/* Hidden file input (duplicated ref used in label + change handler) */}
            <input ref={personInputRef} type="file" accept="image/*" className="hidden" onChange={handlePersonUpload} />

            {/* ── Sample Human Grid (NEW) ── */}
            <SampleGrid
              selectedId={selectedSampleId}
              onSelect={selectSampleHuman}
            />

            <div className="mt-4 flex items-start gap-2 text-xs text-gray-600">
              <Info size={12} className="mt-0.5 flex-shrink-0 text-purple-700" />
              <span>Best results: frontal photo, good lighting, single person.</span>
            </div>
          </div>

          {/* ── STEP 2: Choose garment ── */}
          <div className="bg-[#0d0b1e] border border-purple-900/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-700/60 flex items-center justify-center text-xs font-bold text-white">2</div>
                <h2 className="text-white font-semibold">Choose Garment</h2>
              </div>
              <button
                onClick={() => clothInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs bg-purple-900/40 hover:bg-purple-800/60 border border-purple-800/40 text-purple-300 px-3 py-1.5 rounded-full transition-colors"
              >
                <ImagePlus size={12} /> Upload Custom
              </button>
            </div>
            <input ref={clothInputRef} type="file" accept="image/*" className="hidden" onChange={handleClothUpload} />

            {customCloth && clothPreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative h-40 rounded-xl overflow-hidden border border-purple-600/50 mb-4 cursor-pointer"
                onClick={() => clothInputRef.current?.click()}
              >
                <img src={clothPreview} alt="garment" className="w-full h-full object-contain bg-purple-950/30" />
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full">Custom</span>
                </div>
                <button
                  className="absolute top-2 left-2 bg-black/60 rounded-full p-1 text-gray-300 hover:text-white"
                  onClick={(e) => { e.stopPropagation(); setClothFile(null); setClothPreview(null); setCustomCloth(false); }}
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[26rem] overflow-y-auto pr-1">
              {garments.map((g) => (
                <motion.div
                  key={g.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => selectGarment(g)}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                    !customCloth && selectedGarment?.id === g.id
                      ? "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      : "border-transparent hover:border-purple-800/60"
                  }`}
                >
                  <div className="aspect-square bg-purple-950/40 overflow-hidden">
                    <img
                      src={g.image}
                      alt={g.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 text-center py-1 px-1 truncate">{g.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Advanced Options ── */}
        <div className="max-w-3xl mx-auto mb-8">
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-colors mx-auto"
          >
            <ChevronDown
              size={16}
              className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}
            />
            Advanced Options (optional prompts &amp; settings)
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 bg-[#0d0b1e] border border-purple-900/30 rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Clothing Prompt <span className="text-gray-700">(override / modify garment)</span>
                    </label>
                    <input
                      type="text"
                      value={clothingPrompt}
                      onChange={(e) => setClothingPrompt(e.target.value)}
                      placeholder="e.g. red sleeveless mini dress"
                      className="w-full bg-purple-950/30 border border-purple-900/40 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-600 placeholder-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Avatar Prompt <span className="text-gray-700">(describe / modify person)</span>
                    </label>
                    <input
                      type="text"
                      value={avatarPrompt}
                      onChange={(e) => setAvatarPrompt(e.target.value)}
                      placeholder="e.g. a fit man with dark beard"
                      className="w-full bg-purple-950/30 border border-purple-900/40 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-600 placeholder-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Background Prompt <span className="text-gray-700">(change background)</span>
                    </label>
                    <input
                      type="text"
                      value={backgroundPrompt}
                      onChange={(e) => setBackgroundPrompt(e.target.value)}
                      placeholder="e.g. in an autumn park"
                      className="w-full bg-purple-950/30 border border-purple-900/40 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-600 placeholder-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Avatar Sex <span className="text-gray-700">(auto-detected if blank)</span>
                    </label>
                    <select
                      value={avatarSex}
                      onChange={(e) => setAvatarSex(e.target.value)}
                      className="w-full bg-purple-950/30 border border-purple-900/40 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-600"
                    >
                      <option value="">Auto-detect</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Generate button ── */}
        <div className="text-center mb-12">
          <motion.button
            whileHover={canGenerate ? { scale: 1.03 } : {}}
            whileTap={canGenerate ? { scale: 0.97 } : {}}
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`inline-flex items-center gap-3 px-12 py-4 rounded-full font-bold text-lg transition-all ${
              canGenerate
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:shadow-[0_0_60px_rgba(168,85,247,0.7)]"
                : "bg-purple-950/40 border border-purple-900/30 text-gray-600 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate AI Outfit
                <Shirt size={20} />
              </>
            )}
          </motion.button>

          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 max-w-md mx-auto"
              >
                <div className="h-1.5 bg-purple-950/60 rounded-full overflow-hidden mb-2">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                  />
                </div>
                <p className="text-gray-500 text-sm">
                  VTON-D is processing — typically 5–10 seconds...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Result ── */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-[#0d0b1e] border border-purple-700/40 rounded-3xl p-8 shadow-[0_0_80px_rgba(168,85,247,0.2)]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-400" />
                    AI Result
                    {seedUsed && (
                      <span className="text-[10px] text-gray-600 font-normal ml-2">seed: {seedUsed}</span>
                    )}
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={reset}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-full transition-all"
                    >
                      <RefreshCw size={12} /> New Try-On
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full hover:opacity-90 transition"
                    >
                      <Download size={12} /> Download
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-start">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 tracking-widest mb-2">YOUR PHOTO</p>
                    <div className="rounded-xl overflow-hidden border border-purple-900/30 aspect-[3/4]">
                      <img src={personPreview} alt="original" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 tracking-widest mb-2">GARMENT</p>
                    <div className="rounded-xl overflow-hidden border border-purple-900/30 aspect-[3/4] bg-purple-950/30">
                      <img src={clothPreview} alt="garment" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-purple-400 tracking-widest mb-2 font-semibold">AI RESULT ✨</p>
                    <div className="rounded-xl overflow-hidden border-2 border-purple-600/60 aspect-[3/4] shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                      <img src={result} alt="AI try-on result" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state ── */}
        {!result && !loading && (
          <div className="max-w-2xl mx-auto bg-[#0d0b1e] border border-purple-900/20 rounded-2xl p-10 text-center">
            <Sparkles size={32} className="text-purple-800 mx-auto mb-4" />
            <p className="text-gray-600 text-sm">Your AI-generated outfit will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTryOn;