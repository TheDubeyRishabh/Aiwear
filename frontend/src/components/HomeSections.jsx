import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, MousePointer, Sparkles, Star, ArrowRight } from "lucide-react";
import jacket from "../assets/jacket.png";
import dress from "../assets/dress.png";
import hoodie from "../assets/hoodie.png";


const products = [
  { id: 1, name: "Canvas Jacket", price: "₹1,599", image: jacket, tag: "SALE" },
  { id: 2, name: "Silk Slip Dress", price: "₹999", image:dress, tag: "NEW" },
  { id: 3, name: "Navy Hoodie", price: "₹799", image: hoodie, tag: "SALE" },
];

const steps = [
  { icon: Upload, title: "Upload Photo", desc: "Take or upload a clear photo of yourself standing straight." },
  { icon: MousePointer, title: "Pick a Garment", desc: "Choose from our collection or upload your own clothing image." },
  { icon: Sparkles, title: "See the Magic", desc: "OOTDiffusion AI renders you wearing the outfit in seconds." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" } }),
};

const HomeSections = () => {
  return (
    <div className="bg-[#07060f]">
      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-purple-400 text-xs tracking-[0.25em] mb-3 font-medium">THE PROCESS</p>
          <h2
            className="text-[clamp(2.5rem,5vw,4rem)] text-white leading-none tracking-wider"
            style={{ fontFamily: "var(--font-display)" }}
          >
            HOW IT WORKS
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-gradient-to-r from-transparent via-purple-700/50 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative flex flex-col items-center text-center p-8 rounded-2xl border border-purple-900/30 bg-purple-950/10 hover:bg-purple-950/20 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                <step.icon size={24} className="text-white" />
              </div>
              <span className="absolute top-6 right-6 text-[10px] tracking-widest text-purple-600 font-bold">
                0{i + 1}
              </span>
              <h3 className="text-white font-semibold text-lg mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/aitryon"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-[0_0_30px_rgba(168,85,247,0.35)]"
          >
            <Sparkles size={16} />
            Start Your Try-On
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ── BEFORE / AFTER DEMO ───────────────────────────── */}
      <section className="border-y border-purple-900/20 bg-gradient-to-r from-purple-950/20 via-[#07060f] to-pink-950/20 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {[
            { src: "/images/model1.jpg", label: "Your Photo" },
            { src: "/images/model2.jpg", label: "AI Result" },
            { src: "/images/model3.jpg", label: "Multiple Styles" },
          ].map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl aspect-[3/4] group"
            >
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.parentElement.style.background = "linear-gradient(135deg, #1e1030, #2d1b69)";
                  e.target.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5">
                <span className="bg-purple-600/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full tracking-wider">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED COLLECTION ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-purple-400 text-xs tracking-[0.25em] mb-3">CURATED FOR YOU</p>
            <h2
              className="text-[clamp(2.5rem,5vw,4rem)] text-white leading-none tracking-wider"
              style={{ fontFamily: "var(--font-display)" }}
            >
              FEATURED
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-1.5 text-sm text-gray-400 hover:text-purple-400 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="group bg-[#0d0b1e] border border-purple-900/20 hover:border-purple-700/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]"
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden bg-gradient-to-br from-purple-950/50 to-[#0d0b1e]">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                {p.tag && (
                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-[10px] tracking-widest px-2.5 py-1 rounded-md font-semibold">
                    {p.tag}
                  </span>
                )}
                {/* Try-On overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link
                    to="/aitryon"
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-sm px-5 py-2.5 rounded-full transition-colors font-medium"
                  >
                    <Sparkles size={14} /> Try On
                  </Link>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-white font-semibold mb-1">{p.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} className="text-yellow-500 fill-yellow-500" />
                  ))}
                  <span className="text-gray-600 text-xs ml-1">(4.8)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-300 font-bold text-lg">{p.price}</span>
                  <button className="text-xs bg-purple-900/40 hover:bg-purple-800/60 border border-purple-800/50 text-purple-300 px-4 py-1.5 rounded-full transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────── */}
      <section className="mx-6 mb-16 rounded-3xl bg-gradient-to-r from-purple-900/60 via-pink-900/40 to-purple-900/60 border border-purple-700/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/images/her.png')] bg-right bg-no-repeat bg-contain opacity-10" />
        <div className="relative max-w-3xl mx-auto py-16 px-8 text-center">
          <h2
            className="text-[clamp(2rem,5vw,3.5rem)] text-white tracking-wider mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            TRY BEFORE YOU BUY
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Upload your photo and any outfit — see yourself wearing it instantly with AI.
          </p>
          <Link
            to="/aitryon"
            className="inline-flex items-center gap-2 bg-white text-purple-900 hover:bg-purple-50 px-8 py-3.5 rounded-full font-bold transition-all shadow-xl"
          >
            <Sparkles size={16} />
            Launch AI Try-On
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomeSections;
