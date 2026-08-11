"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ActiveListeners from "./ActiveListeners";
import AppleClock from "../ui/AppleClock";
import TruckShayari from "../ui/TruckShayari";
import { FaPlay, FaCog, FaTrash } from "react-icons/fa";
import { get, set } from 'idb-keyval';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [videoSrc, setVideoSrc] = useState("/horndoplease.mp4");
  
  // Custom Background state
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [customBgType, setCustomBgType] = useState<'video' | 'image' | null>(null);
  const [isParallaxEnabled, setIsParallaxEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  // On mount, load custom background from IndexedDB
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const file = await get('custom-bg-file');
        const type = await get('custom-bg-type');
        if (file && type) {
          const url = URL.createObjectURL(file as Blob);
          setCustomBgUrl(url);
          setCustomBgType(type as 'video' | 'image');
        }
        
        const parallaxSetting = await get('parallax-enabled');
        if (parallaxSetting !== undefined) {
          setIsParallaxEnabled(parallaxSetting);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    loadSettings();
  }, []);

  const toggleParallax = async () => {
    const newValue = !isParallaxEnabled;
    setIsParallaxEnabled(newValue);
    await set('parallax-enabled', newValue);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const isVideo = file.type.startsWith('video/');
      const type = isVideo ? 'video' : 'image';
      
      // Save to IndexedDB
      await set('custom-bg-file', file);
      await set('custom-bg-type', type);
      
      // Update UI
      if (customBgUrl) URL.revokeObjectURL(customBgUrl); // Cleanup old URL
      const newUrl = URL.createObjectURL(file);
      setCustomBgUrl(newUrl);
      setCustomBgType(type);
      setIsSettingsOpen(false);
    } catch (err) {
      console.error("Error saving custom background:", err);
    }
  };

  const clearCustomBackground = async () => {
    try {
      await set('custom-bg-file', null);
      await set('custom-bg-type', null);
      if (customBgUrl) URL.revokeObjectURL(customBgUrl);
      setCustomBgUrl(null);
      setCustomBgType(null);
      setIsSettingsOpen(false);
    } catch (err) {
      console.error("Error clearing custom background:", err);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setVideoSrc(window.innerWidth < 768 ? "/horndopleasemobile.mp4" : "/horndoplease.mp4");
    };
    
    // Set initial source
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate normalized mouse position (-1 to 1)
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;

      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-start pt-32"
    >
      {/* Background Media */}
      <motion.div
        className="absolute inset-[-5%] z-0 w-[110%] h-[110%]"
        style={{
          y: isParallaxEnabled ? y : 0,
        }}
      >
        <motion.div
          className="w-full h-full"
          animate={{
            x: isParallaxEnabled ? mousePosition.x * -30 : 0,
            y: isParallaxEnabled ? mousePosition.y * -30 : 0,
          }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
        >
          {customBgType === 'image' && customBgUrl ? (
            <img src={customBgUrl} alt="Custom Background" className="object-cover w-full h-full" />
          ) : (
            <video
              key={customBgUrl || videoSrc}
              autoPlay
              muted
              loop
              preload="auto"
              playsInline
              className="object-cover w-full h-full"
              src={customBgUrl || videoSrc}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Settings Button */}
      <div className="absolute top-8 left-8 z-[100] pointer-events-auto">
        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-text-secondary hover:text-white transition-colors shadow-lg"
        >
          <FaCog size={16} />
        </button>

        {isSettingsOpen && (
          <div className="absolute top-14 left-0 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-64 shadow-2xl">
            <h4 className="text-white font-medium mb-3 text-sm">Background Settings</h4>
            
            <button 
              onClick={toggleParallax}
              className="w-full text-left px-3 py-2 text-sm text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors mb-2 flex justify-between items-center"
            >
              <span>Parallax Effect</span>
              <span className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors ${isParallaxEnabled ? 'bg-primary' : 'bg-white/30'}`}>
                <span className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${isParallaxEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </span>
            </button>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full text-left px-3 py-2 text-sm text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors mb-2"
            >
              Upload Custom Background
            </button>
            <input 
              type="file" 
              accept="image/*,video/*"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />

            {customBgUrl && (
              <button 
                onClick={clearCustomBackground}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors"
              >
                <FaTrash size={12} /> Reset to Default
              </button>
            )}
          </div>
        )}
      </div>

      {/* Top Center Stack: Clock & Active Listeners */}
      <div className="absolute top-8 flex flex-col items-center w-full gap-2 z-[50] pointer-events-auto">
        <ActiveListeners />
        <AppleClock />
      </div>

      {/* Bottom Center: Truck Shayari */}
      <div className="absolute bottom-32 md:bottom-40 flex justify-center w-full z-[50] pointer-events-none">
        <TruckShayari />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4 w-full h-full pt-16 pointer-events-none"
        style={{ opacity }}
      >
      </motion.div>
    </section>
  );
}
