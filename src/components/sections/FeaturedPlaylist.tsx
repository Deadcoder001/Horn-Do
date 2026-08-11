"use client";

import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";

export default function FeaturedPlaylist() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
      <motion.div 
        className="glass-panel rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-10 group transition-all duration-500 hover:bg-white/10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.pexels.com/photos/1578105/pexels-photo-1578105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Highway Drive"
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h3 className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-2">Featured Playlist</h3>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Midnight Highway</h2>
            <p className="text-text-secondary text-lg mb-8 max-w-xl leading-relaxed">
              A curated collection of deep house and chillwave tracks perfectly tuned for your late-night drives. Let the rhythm sync with the rolling road.
            </p>
            
            <div className="flex items-center gap-6 mb-8 text-sm text-text-secondary font-mono">
              <span>Electronic / Chillwave</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span>42 Songs</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span>2h 15m</span>
            </div>
            
            <button className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary transition-colors group/btn">
              <FaPlay className="text-black group-hover/btn:scale-110 transition-transform" />
              Play Now
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
