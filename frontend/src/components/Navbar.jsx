import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, Sparkles, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = [
    { label: "HOME", to: "/" },
    { label: "SHOP", to: "/shop" },
    { label: "AI TRY-ON", to: "/aitryon" },
  ];

  return (
    <motion.nav
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#07060f]/80 backdrop-blur-xl border-b border-purple-900/40 shadow-[0_4px_30px_rgba(109,40,217,0.15)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Sparkles size={18} className="text-purple-400 group-hover:rotate-12 transition-transform" />
          <span
            className="text-2xl tracking-[0.2em] text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI<span className="text-purple-400">WEAR</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative text-xs tracking-[0.15em] font-medium transition-colors duration-200 group ${
                location.pathname === link.to ? "text-purple-400" : "text-gray-400 hover:text-white"
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-purple-500 transition-all duration-300 ${
                  location.pathname === link.to ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-purple-900/30 border border-purple-800/50 rounded-full px-3 py-1.5">
                <User size={14} className="text-purple-400" />
                <span className="text-xs text-purple-200">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs tracking-[0.15em] font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-5 py-2 rounded-full transition-all duration-200 text-white"
            >
              LOGIN
            </Link>
          )}

          <Link to="/shop" className="relative group">
            <ShoppingBag size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            <span className="absolute -top-1.5 -right-1.5 bg-purple-600 text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              0
            </span>
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-gray-300 hover:text-white transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0d0b1e]/95 backdrop-blur-xl border-b border-purple-900/40 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm tracking-[0.15em] text-gray-300 hover:text-purple-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <span className="text-xs text-purple-300">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-left text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-sm tracking-[0.15em] text-purple-400">
                  LOGIN / SIGN UP
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
