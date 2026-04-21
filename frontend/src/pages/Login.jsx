import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login" | "register" | "verify"
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  useEffect(() => {
    if (user) navigate("/aitryon", { replace: true });
  }, [user, navigate]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pwStrength = () => {
    const l = form.password.length;
    if (l === 0) return null;
    if (l >= 10) return { label: "Strong", color: "#22c55e", w: "100%" };
    if (l >= 6) return { label: "Medium", color: "#eab308", w: "65%" };
    return { label: "Weak", color: "#ef4444", w: "30%" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await login(form.email, form.password);
        if (res.success) {
          toast.success(`Welcome back, ${res.user.name}!`);
          navigate("/aitryon");
        } else {
          toast.error(res.message || "Login failed");
        }
      } else {
        if (!form.name.trim()) return toast.error("Name is required");
        if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
        const res = await register(form.name, form.email, form.password);
        if (res.success) {
          setMode("verify");
        } else {
          toast.error(res.message || "Registration failed");
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const strength = pwStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07060f] relative overflow-hidden px-4 py-16">
      {/* Background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-pink-900/15 rounded-full blur-[120px]" />

      <AnimatePresence mode="wait">
        {mode === "verify" ? (
          <motion.div
            key="verify"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 bg-[#0d0b1e] border border-purple-700/40 rounded-3xl p-12 text-center max-w-md w-full shadow-[0_0_80px_rgba(168,85,247,0.2)]"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(168,85,247,0.5)]">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h2 className="text-2xl text-white font-bold mb-3">Check your email</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              We sent a verification link to{" "}
              <span className="text-purple-300">{form.email}</span>. Click it to activate your account.
            </p>
            <button
              onClick={() => setMode("login")}
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 mx-auto transition-colors"
            >
              Back to login <ArrowRight size={14} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-4xl bg-[#0d0b1e] border border-purple-900/40 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.15)] grid md:grid-cols-2"
          >
            {/* Left panel */}
            <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-purple-900/80 via-purple-950 to-pink-950/60 p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/her.png')] bg-cover bg-center opacity-10" />
              <div className="relative z-10">
                <Link to="/" className="flex items-center gap-2 mb-16">
                  <Sparkles size={16} className="text-purple-400" />
                  <span className="text-xl tracking-[0.2em] text-white" style={{ fontFamily: "var(--font-display)" }}>
                    AI<span className="text-purple-400">WEAR</span>
                  </span>
                </Link>
                <h2
                  className="text-5xl text-white leading-tight tracking-wide mb-6"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  VIRTUAL<br />TRY-ON<br />
                  <span className="text-purple-400">AWAITS</span>
                </h2>
                <p className="text-purple-200/70 text-sm leading-relaxed">
                  Upload your photo and any garment. OOTDiffusion AI will dress you in it instantly.
                </p>
              </div>
              <div className="relative z-10 flex gap-3">
                {["Instant", "Realistic", "Free"].map((tag) => (
                  <span key={tag} className="text-xs bg-white/10 border border-white/10 text-purple-200 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right panel — form */}
            <div className="p-10 md:p-12 flex flex-col justify-center">
              {/* Mode toggle */}
              <div className="flex bg-purple-950/40 border border-purple-900/40 rounded-xl p-1 mb-8">
                {["login", "register"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      mode === m
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {m === "login" ? "Login" : "Sign Up"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {mode === "register" && (
                    <motion.div
                      key="name"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative overflow-hidden"
                    >
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Full name"
                        value={form.name}
                        onChange={set("name")}
                        required
                        className="w-full bg-purple-950/30 border border-purple-900/40 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-10 py-3 text-sm outline-none transition-colors"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={set("email")}
                    required
                    className="w-full bg-purple-950/30 border border-purple-900/40 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-10 py-3 text-sm outline-none transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={set("password")}
                    required
                    className="w-full bg-purple-950/30 border border-purple-900/40 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-10 pr-11 py-3 text-sm outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password strength (register mode) */}
                {mode === "register" && strength && (
                  <div>
                    <div className="h-1 bg-purple-950/60 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: strength.w }}
                        className="h-full rounded-full"
                        style={{ background: strength.color }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: strength.color }}>
                      {strength.label} password
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {mode === "login" ? "Login" : "Create Account"}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-gray-600 mt-6">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  {mode === "login" ? "Sign Up" : "Login"}
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
