"use client";

import { motion } from "framer-motion";
import { FaPlay, FaHeart, FaEllipsisH } from "react-icons/fa";

const songs = [
  { id: 1, title: "Nightcall", artist: "Kavinsky", album: "Drive (OST)", duration: "4:19" },
  { id: 2, title: "Under Your Spell", artist: "Desire", album: "Drive (OST)", duration: "3:52" },
  { id: 3, title: "A Real Hero", artist: "College, Electric Youth", album: "A Real Hero EP", duration: "4:27" },
  { id: 4, title: "Tick of the Clock", artist: "Chromatics", album: "Night Drive", duration: "4:48" },
  { id: 5, title: "Resonance", artist: "HOME", album: "Odyssey", duration: "3:32" },
];

export default function SongList() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 mb-32">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Trending Tracks</h2>
        <p className="text-text-secondary">What the community is listening to on the road right now.</p>
      </div>

      <div className="flex flex-col gap-2">
        {songs.map((song, i) => (
          <motion.div
            key={song.id}
            className="group flex items-center justify-between p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors glass-panel"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
          >
            <div className="flex items-center gap-4 w-1/2">
              <div className="w-8 flex justify-center text-text-secondary font-mono text-sm group-hover:hidden">
                {String(i + 1).padStart(2, '0')}
              </div>
              <button className="w-8 h-8 hidden group-hover:flex items-center justify-center text-primary">
                <FaPlay size={14} />
              </button>
              
              <div>
                <h4 className="text-white font-medium group-hover:text-primary transition-colors">{song.title}</h4>
                <p className="text-sm text-text-secondary">{song.artist}</p>
              </div>
            </div>

            <div className="hidden md:block w-1/3 text-sm text-text-secondary">
              {song.album}
            </div>

            <div className="flex items-center gap-6 text-sm text-text-secondary font-mono w-auto justify-end">
              <button className="opacity-0 group-hover:opacity-100 hover:text-accent transition-all">
                <FaHeart />
              </button>
              <span>{song.duration}</span>
              <button className="opacity-0 group-hover:opacity-100 hover:text-white transition-all">
                <FaEllipsisH />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
