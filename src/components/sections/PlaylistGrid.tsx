"use client";

import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";

const playlists = [
  { id: 1, name: "Monsoon Drive", mood: "Nostalgic", songs: 24, duration: "1h 30m", image: "https://images.pexels.com/photos/125514/pexels-photo-125514.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 2, name: "Sunset Horizon", mood: "Uplifting", songs: 18, duration: "1h 10m", image: "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 3, name: "Neon Nights", mood: "Energetic", songs: 32, duration: "2h 5m", image: "https://images.pexels.com/photos/813269/pexels-photo-813269.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 4, name: "Mountain Echoes", mood: "Peaceful", songs: 15, duration: "55m", image: "https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=600" },
];

export default function PlaylistGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Curated Journeys</h2>
          <p className="text-text-secondary">Playlists for every state of mind.</p>
        </div>
        <button className="text-sm font-medium text-white hover:text-primary transition-colors pb-1 border-b border-white/20 hover:border-primary">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {playlists.map((playlist, i) => (
          <motion.div
            key={playlist.id}
            className="group relative rounded-2xl overflow-hidden glass-panel p-4 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
              <img 
                src={playlist.image} 
                alt={playlist.name} 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <button className="w-14 h-14 bg-primary text-black rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_20px_rgba(244,180,0,0.5)]">
                  <FaPlay size={20} className="ml-1" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{playlist.name}</h3>
            <p className="text-sm text-text-secondary mb-3">{playlist.mood}</p>
            
            <div className="flex items-center justify-between text-xs text-text-secondary/70 font-mono border-t border-white/5 pt-3">
              <span>{playlist.songs} Tracks</span>
              <span>{playlist.duration}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
