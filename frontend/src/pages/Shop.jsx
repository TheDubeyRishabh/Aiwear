import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Sparkles, SlidersHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import jacket from "../assets/jacket.png";
import dress from "../assets/dress.png";
import hoodie from "../assets/hoodie.png";
import formal from "../assets/formal.png";
import casual from "../assets/casual.png";
import party from "../assets/party.png";


const products = [
  { id: 1, name: "Canvas Jacket", price: 1599, category: "Formal", image: jacket, rating: 4.5, sale: true },
  { id: 2, name: "Silk Slip Dress", price: 999, category: "Party", image: dress, rating: 4.7, sale: false },
  { id: 3, name: "Navy Hoodie", price: 799, category: "Streetwear", image: hoodie, rating: 4.3, sale: true },
  { id: 4, name: "Formal Suit", price: 2999, category: "Formal", image: formal, rating: 4.8, sale: false },
  { id: 5, name: "Casual Tee", price: 599, category: "Casual", image: casual, rating: 4.2, sale: false },
  { id: 6, name: "Party Dress", price: 1299, category: "Party", image:party, rating: 4.6, sale: true },
];

const categories = ["All", "Formal", "Casual", "Streetwear", "Party"];

const Shop = () => {
  const [cat, setCat] = useState("All");
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const filtered = products.filter(
    (p) => (cat === "All" || p.category === cat) && p.price <= maxPrice
  );

  const addToCart = (p) => {
    setCart((c) => [...c, p]);
    toast.success(`${p.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-[#07060f] pt-8 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <p className="text-purple-400 text-xs tracking-[0.25em] mb-2">COLLECTION</p>
        <div className="flex items-end justify-between">
          <h1
            className="text-[clamp(3rem,7vw,5rem)] text-white leading-none tracking-wider"
            style={{ fontFamily: "var(--font-display)" }}
          >
            SHOP
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">{filtered.length} items</span>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden flex items-center gap-2 bg-purple-900/40 border border-purple-800/50 text-purple-300 text-xs px-4 py-2 rounded-full"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex gap-10">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } md:block w-56 flex-shrink-0`}
        >
          <div className="sticky top-24 space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-xs tracking-[0.2em] text-gray-500 mb-4 font-semibold">CATEGORIES</h3>
              <div className="flex flex-col gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`text-left px-4 py-2 rounded-lg text-sm transition-all ${
                      cat === c
                        ? "bg-gradient-to-r from-purple-700/80 to-pink-700/60 text-white font-medium shadow"
                        : "text-gray-400 hover:text-white hover:bg-purple-900/20"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="text-xs tracking-[0.2em] text-gray-500 mb-4 font-semibold">MAX PRICE</h3>
              <input
                type="range"
                min={500}
                max={3000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>₹500</span>
                <span className="text-purple-400 font-medium">₹{maxPrice}</span>
                <span>₹3000</span>
              </div>
            </div>

            {/* Try-on CTA */}
            <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/40 border border-purple-700/30 rounded-2xl p-5">
              <Sparkles size={20} className="text-purple-400 mb-3" />
              <p className="text-white text-sm font-semibold mb-2">Try before you buy</p>
              <p className="text-gray-400 text-xs mb-4 leading-relaxed">Use AI to see how any item looks on you.</p>
              <Link
                to="/aitryon"
                className="block text-center text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
              >
                Open AI Try-On
              </Link>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-600">
              <p className="text-lg">No products in this filter</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group bg-[#0d0b1e] border border-purple-900/20 hover:border-purple-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.12)]"
                >
                  {/* Image */}
                  <div className="relative h-64 bg-gradient-to-br from-purple-950/40 to-[#0d0b1e] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    {p.sale && (
                      <span className="absolute top-3 left-3 bg-pink-600 text-white text-[10px] tracking-widest px-2.5 py-1 rounded-md font-bold">
                        SALE
                      </span>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Link
                        to="/aitryon"
                        className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2 rounded-full transition font-medium"
                      >
                        <Sparkles size={12} /> Try On
                      </Link>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-white font-semibold mb-1.5">{p.name}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          size={11}
                          className={j < Math.floor(p.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-700 fill-gray-700"}
                        />
                      ))}
                      <span className="text-gray-600 text-xs ml-1">{p.rating}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-300 font-bold text-xl">₹{p.price}</span>
                      <button
                        onClick={() => addToCart(p)}
                        className="flex items-center gap-1.5 text-xs bg-purple-900/50 hover:bg-purple-700/70 border border-purple-800/50 text-purple-200 hover:text-white px-4 py-2 rounded-full transition-all"
                      >
                        <ShoppingCart size={12} /> Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
