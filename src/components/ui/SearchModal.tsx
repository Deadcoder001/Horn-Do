"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[150] flex items-start justify-center pt-[15vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Search Box */}
          <motion.div 
            className="glass-panel w-full max-w-2xl rounded-2xl relative z-10 overflow-hidden"
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center px-6 py-4 border-b border-white/10">
              <FiSearch className="text-text-secondary mr-4" size={24} />
              <input 
                autoFocus
                type="text" 
                placeholder="Search for songs, artists, or playlists..." 
                className="flex-1 bg-transparent border-none outline-none text-xl text-white placeholder-text-secondary/50 font-light"
              />
              <button 
                onClick={onClose}
                className="text-text-secondary hover:text-white transition-colors p-2 bg-white/5 rounded-full"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">Recent Searches</h4>
              <div className="flex flex-wrap gap-2">
                {["A.R. Rahman", "Lofi Highways", "Monsoon Drives", "Ritviz", "Indie Pop"].map((term) => (
                  <span key={term} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-text-secondary hover:text-white hover:bg-white/10 cursor-pointer transition-colors">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
