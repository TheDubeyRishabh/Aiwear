import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Instagram, Twitter, Github, ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#07060f] border-t border-purple-900/30 pt-16 pb-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-purple-900/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 pb-12 border-b border-purple-900/30">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-purple-400" />
              <span
                className="text-2xl tracking-[0.2em] text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                AI<span className="text-purple-400">WEAR</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Virtual try-on powered by AI. See yourself in any outfit before you buy.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Github].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-full border border-purple-900/60 flex items-center justify-center text-gray-500 hover:text-purple-400 hover:border-purple-600 transition-all"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Product",
              links: [
                { label: "AI Try-On", to: "/aitryon" },
                { label: "Shop", to: "/shop" },
                { label: "How It Works", to: "/" },
              ],
            },
            {
              title: "Categories",
              links: [
                { label: "Formal", to: "/shop" },
                { label: "Casual", to: "/shop" },
                { label: "Streetwear", to: "/shop" },
                { label: "Party Wear", to: "/shop" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About", to: "/" },
                { label: "Privacy Policy", to: "/" },
                { label: "Terms of Service", to: "/" },
                { label: "Contact", to: "/" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="text-xs tracking-[0.15em] text-gray-400 mb-5 font-semibold uppercase">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-1 group"
                    >
                      {l.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© 2025 AI Wear. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Powered by{" "}
            <a
              href="https://huggingface.co/spaces/levihsu/OOTDiffusion"
              target="_blank"
              rel="noreferrer"
              className="text-purple-500 hover:text-purple-400 transition-colors"
            >
              OOTDiffusion
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
