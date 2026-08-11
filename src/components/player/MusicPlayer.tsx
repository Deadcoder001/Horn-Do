"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRandom, FaRedo, FaHeart, FaListUl, FaInfo, FaGithub, FaLinkedin, FaTimes, FaTv, FaGlobe } from "react-icons/fa";
import ReactPlayer from "react-player";
import playlistData from "@/data/data.json";
import { usePlayer } from "@/context/PlayerContext";
import { get, set } from 'idb-keyval';

const DEFAULT_PLAYLISTS = playlistData.playlists;

export default function MusicPlayer() {
  const { isPlaying, setIsPlaying } = usePlayer();
  const [mounted, setMounted] = useState(false);
  const [playlists, setPlaylists] = useState(DEFAULT_PLAYLISTS);
  const [isExpanded, setIsExpanded] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sidebarView, setSidebarView] = useState<'playlists' | 'about' | 'create' | null>(null);
  
  // New States
  const [activePlaylistIndex, setActivePlaylistIndex] = useState(0);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPipMode, setIsPipMode] = useState(false);
  const [isHornCooldown, setIsHornCooldown] = useState(false);

  // Mixtape Creator State
  const [mixName, setMixName] = useState("");
  const [mixCover, setMixCover] = useState("");
  const [mixTracks, setMixTracks] = useState([{ title: "", artist: "", url: "" }]);
  
  const playerRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    get('custom-mixtapes').then((data) => {
      if (data && Array.isArray(data)) {
        setPlaylists([...DEFAULT_PLAYLISTS, ...data]);
      }
    });
  }, []);

  // Safe fallback if active index is out of bounds due to array changes
  const activePlaylist = playlists[activePlaylistIndex] || playlists[0];
  const activeTrack = activePlaylist?.tracks[activeTrackIndex] || activePlaylist?.tracks[0];

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  // Helper to extract YouTube Thumbnail
  const getYoutubeThumbnail = (url: string, fallback: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }
    return fallback;
  };

  // Helper to ensure URL is a clean youtube.com/watch link
  const getCleanYoutubeUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/watch?v=${match[2]}`;
    }
    return url;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const fraction = x / bounds.width;
    playerRef.current.seekTo(fraction);
  };

  const handleNext = () => {
    if (activeTrackIndex < activePlaylist.tracks.length - 1) {
      setActiveTrackIndex(prev => prev + 1);
    } else {
      setActiveTrackIndex(0); // Loop back to start
    }
    setPlayed(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (activeTrackIndex > 0) {
      setActiveTrackIndex(prev => prev - 1);
    } else {
      setActiveTrackIndex(activePlaylist.tracks.length - 1);
    }
    setPlayed(0);
    setIsPlaying(true);
  };

  const playPlaylist = (index: number) => {
    setActivePlaylistIndex(index);
    setActiveTrackIndex(0);
    setPlayed(0);
    setIsPlaying(true);
  };
  
  const playHorn = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isHornCooldown) return;
    
    setIsHornCooldown(true);
    const audio = new Audio("/horn1.mp3");
    audio.volume = 0.5;
    audio.play().catch(err => console.error("Error playing horn:", err));

    setTimeout(() => {
      setIsHornCooldown(false);
    }, 4000);
  };

  const addTrackField = () => {
    setMixTracks([...mixTracks, { title: "", artist: "", url: "" }]);
  };

  const updateTrackField = (index: number, field: string, value: string) => {
    const newTracks = [...mixTracks];
    newTracks[index] = { ...newTracks[index], [field]: value };
    setMixTracks(newTracks);
  };

  const saveMixtape = async () => {
    if (!mixName.trim()) return alert("Please enter a mixtape name.");
    const validTracks = mixTracks.filter(t => t.url.trim());
    if (validTracks.length === 0) return alert("Please add at least one track with a URL.");

    const newMixtape = {
      id: `custom_${Date.now()}`,
      name: mixName,
      cover: mixCover || "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=300",
      tracks: validTracks.map((t, i) => ({
        id: `t_custom_${Date.now()}_${i}`,
        title: t.title || `Custom Track ${i + 1}`,
        artist: t.artist || "Unknown",
        url: t.url
      }))
    };

    try {
      const existing = (await get('custom-mixtapes')) || [];
      const updatedCustom = [...existing, newMixtape];
      await set('custom-mixtapes', updatedCustom);
      
      setPlaylists([...DEFAULT_PLAYLISTS, ...updatedCustom]);
      
      setMixName("");
      setMixCover("");
      setMixTracks([{ title: "", artist: "", url: "" }]);
      setSidebarView('playlists');
    } catch (err) {
      console.error("Failed to save mixtape:", err);
    }
  };

  if (!mounted || !activeTrack) return null;

  return (
    <>
      {/* PIP Video or Hidden Wrapper */}
      <AnimatePresence>
        <motion.div 
          drag={isPipMode}
          dragMomentum={false}
          className={
            isPipMode 
              ? "fixed bottom-36 right-4 md:right-8 w-[calc(100vw-32px)] md:w-96 aspect-video z-[200] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black cursor-move" 
              : "fixed bottom-0 right-0 w-64 h-64 opacity-0 pointer-events-none z-[-10]"
          }
          initial={isPipMode ? { opacity: 0, scale: 0.8, y: 50 } : false}
          animate={isPipMode ? { opacity: 1, scale: 1, y: 0 } : false}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {isPipMode && (
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <button 
                onClick={() => setIsPipMode(false)}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white backdrop-blur-md transition-colors"
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}
          <ReactPlayer
            ref={playerRef}
            url={getCleanYoutubeUrl(activeTrack.url)}
            playing={isPlaying}
            controls={isPipMode}
            width="100%"
            height="100%"
            onProgress={(p: any) => setPlayed(p.played)}
            onDuration={(d: any) => setDuration(d)}
            onEnded={handleNext}
            config={{
              youtube: {
                playerVars: { origin: typeof window !== 'undefined' ? window.location.origin : '' }
              }
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Invisible overlay to collapse player when clicking outside */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 z-[90] cursor-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 left-0 right-0 z-[100] flex flex-col items-center pointer-events-none">
        <motion.div 
          className="glass-panel pointer-events-auto rounded-full overflow-hidden flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.5)] border-white/10"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1, width: isExpanded ? "min(95vw, 580px)" : "min(90vw, 420px)", borderRadius: isExpanded ? "24px" : "9999px" }}
          transition={{ 
            default: { type: "spring", stiffness: 300, damping: 30 },
            y: { type: "spring", stiffness: 300, damping: 30, delay: 1.5 },
            opacity: { delay: 1.5 }
          }}
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          <div className="flex items-center p-2 gap-4 w-full">
            {/* Album Art */}
            <motion.div 
              className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
              }}
            >
              <img 
                src={getYoutubeThumbnail(activeTrack.url, activePlaylist.cover)} 
                alt="Album" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Info */}
            <div className="flex-1 min-w-0 mr-2 cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
              }}>
              <h4 className="text-white font-medium text-sm truncate">{activeTrack.title}</h4>
              <p className="text-text-secondary text-xs truncate">{activeTrack.artist}</p>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-3 pr-2" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }} 
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex items-center gap-3 overflow-hidden mr-2"
                  >
                    <button className="text-text-secondary hover:text-white hover:scale-110 active:scale-90 transition-all duration-300"><FaRandom size={14} /></button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button onClick={handlePrev} className="text-text-secondary hover:text-white hover:scale-110 active:scale-90 transition-all duration-300"><FaStepBackward size={14} /></button>
              
              <button 
                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex-shrink-0"
                onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
              >
                {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-1" />}
              </button>
              
              <button onClick={handleNext} className="text-text-secondary hover:text-white hover:scale-110 active:scale-90 transition-all duration-300"><FaStepForward size={14} /></button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }} 
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex items-center gap-3 overflow-hidden ml-2"
                  >
                    <button className="text-text-secondary hover:text-white hover:scale-110 active:scale-90 transition-all duration-300"><FaRedo size={14} /></button>
                    <div className="w-px h-4 bg-white/20 mx-1" />
                    
                    {/* PIP Toggle Button */}
                    <button 
                      onClick={() => setIsPipMode(!isPipMode)}
                      className={`${isPipMode ? "text-primary" : "text-text-secondary"} hover:text-primary hover:scale-110 active:scale-90 transition-all duration-300`}
                    >
                      <FaTv size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side Buttons */}
            <div className="flex items-center gap-2 pr-2 border-l border-white/10 pl-3">
              <button 
                onClick={playHorn} 
                disabled={isHornCooldown}
                title={isHornCooldown ? "Please wait..." : "Horn OK Please!"}
                className={`w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center group relative hover:scale-110 active:scale-95 transition-all duration-300 ${isHornCooldown ? 'opacity-50 grayscale hover:scale-100' : ''}`}
              >
                <img src="/horn.png" alt="Horn" className="w-5 h-5 object-contain" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setSidebarView('playlists'); }} 
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center group relative text-text-secondary hover:text-white hover:scale-110 active:scale-95 transition-all duration-300"
              >
                <FaListUl size={12} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setSidebarView('about'); }} 
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center group relative text-text-secondary hover:text-white hover:scale-110 active:scale-95 transition-all duration-300"
              >
                <FaInfo size={12} />
              </button>
            </div>
          </div>

          {/* Expanded Progress Bar */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-6 pb-6 pt-2"
                onClick={(e) => e.stopPropagation()}
              >
                  <div 
                    className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative cursor-pointer"
                    onClick={handleSeek}
                  >
                      <motion.div 
                          className="absolute top-0 left-0 h-full bg-primary transition-all duration-100"
                          style={{ width: `${played * 100}%` }}
                      />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-text-secondary font-mono">
                      <span>{formatTime(played * duration)}</span>
                      <span>{formatTime(duration)}</span>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Social Icons */}
        <motion.div 
          className="flex items-center gap-6 mt-6 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <a href="https://github.com/Deadcoder001" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white hover:scale-110 transition-all">
            <FaGithub size={20} />
          </a>
          <a href="https://www.linkedin.com/in/ashif-elahi-1740302b3" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-[#0A66C2] hover:scale-110 transition-all">
            <FaLinkedin size={20} />
          </a>
          <a href="https://ashifelahi.netlify.app" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary hover:scale-110 transition-all">
            <FaGlobe size={20} />
          </a>
        </motion.div>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarView && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarView(null)}
            />
            <motion.div 
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-secondary/90 backdrop-blur-xl border-l border-white/10 z-[200] p-8 overflow-y-auto pointer-events-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white capitalize">{sidebarView}</h2>
                <button 
                  onClick={() => setSidebarView(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              {sidebarView === 'playlists' ? (
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setSidebarView('create')}
                    className="w-full py-4 rounded-xl border-2 border-dashed border-white/20 text-text-secondary hover:text-white hover:border-white/50 hover:bg-white/5 transition-all mb-2 font-medium flex items-center justify-center gap-2"
                  >
                    + Create Custom Mixtape
                  </button>
                  {playlists.map((playlist, idx) => (
                    <div key={playlist.id} className="flex flex-col">
                      <div 
                        onClick={() => playPlaylist(idx)}
                        className={`flex items-center gap-4 p-3 rounded-xl transition-colors cursor-pointer group ${activePlaylistIndex === idx ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5 border border-transparent'}`}
                      >
                        <div className="w-16 h-16 rounded-lg bg-white/10 overflow-hidden relative flex-shrink-0">
                          <img src={getYoutubeThumbnail(playlist.tracks[0]?.url, playlist.cover)} alt={playlist.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <FaPlay className="text-white" size={12} />
                          </div>
                          {activePlaylistIndex === idx && isPlaying && (
                            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{playlist.name}</h4>
                          <p className="text-text-secondary text-sm">{playlist.tracks.length} Tracks</p>
                        </div>
                      </div>

                      <AnimatePresence>
                        {activePlaylistIndex === idx && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-col gap-1 mt-2 mb-2 pl-4 border-l-2 border-white/10 ml-6 overflow-hidden"
                          >
                             {playlist.tracks.map((track, trackIdx) => (
                               <div 
                                 key={track.id}
                                 onClick={() => {
                                   setActiveTrackIndex(trackIdx);
                                   setPlayed(0);
                                   setIsPlaying(true);
                                 }}
                                 className={`p-2 rounded-lg text-sm cursor-pointer hover:bg-white/10 transition-colors flex items-center justify-between group/track ${activeTrackIndex === trackIdx ? 'bg-white/10 text-white font-medium' : 'text-text-secondary'}`}
                               >
                                 <div className="flex flex-col min-w-0 pr-2">
                                   <span className="truncate">{track.title}</span>
                                   <span className="text-xs opacity-60 truncate">{track.artist}</span>
                                 </div>
                                 {activeTrackIndex === trackIdx && isPlaying ? (
                                   <div className="w-3 h-3 rounded-full bg-primary animate-pulse flex-shrink-0" />
                                 ) : (
                                   <FaPlay size={10} className="text-white opacity-0 group-hover/track:opacity-50 transition-opacity flex-shrink-0" />
                                 )}
                               </div>
                             ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ) : sidebarView === 'create' ? (
                <div className="flex flex-col gap-4 text-sm">
                  <p className="text-text-secondary mb-2">Build your own mixtape using YouTube links. It will be saved locally in your browser.</p>
                  
                  <div>
                    <label className="text-white/70 block mb-1">Mixtape Name *</label>
                    <input 
                      type="text" 
                      value={mixName} 
                      onChange={(e) => setMixName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30"
                      placeholder="E.g., Late Night Drives"
                    />
                  </div>
                  
                  <div className="mt-4 mb-2 border-b border-white/10 pb-2">
                    <label className="text-white font-medium block">Tracks</label>
                  </div>
                  
                  {mixTracks.map((track, idx) => (
                    <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col gap-3">
                      <div className="flex justify-between items-center text-xs text-white/50 uppercase tracking-wider font-semibold">
                        <span>Track {idx + 1}</span>
                        {mixTracks.length > 1 && (
                          <button onClick={() => setMixTracks(mixTracks.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-300">Remove</button>
                        )}
                      </div>
                      <input 
                        type="text" 
                        value={track.url} 
                        onChange={(e) => updateTrackField(idx, 'url', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30"
                        placeholder="YouTube URL *"
                      />
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={track.title} 
                          onChange={(e) => updateTrackField(idx, 'title', e.target.value)}
                          className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30"
                          placeholder="Title (optional)"
                        />
                        <input 
                          type="text" 
                          value={track.artist} 
                          onChange={(e) => updateTrackField(idx, 'artist', e.target.value)}
                          className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30"
                          placeholder="Artist (optional)"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={addTrackField}
                    className="w-full py-3 rounded-lg border border-white/10 text-text-secondary hover:text-white hover:bg-white/5 transition-all mt-2"
                  >
                    + Add Another Track
                  </button>
                  
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setSidebarView('playlists')}
                      className="flex-1 py-3 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={saveMixtape}
                      className="flex-1 py-3 rounded-lg bg-white text-black hover:bg-white/90 transition-colors font-medium"
                    >
                      Save Mixtape
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-text-secondary leading-relaxed text-sm">
                  <p className="mb-6">
                    <span className="text-white font-semibold text-lg">हॉर्न do</span>
                    <br/>
                    A cinematic music streaming experience designed for endless roads and nostalgic memories.
                  </p>
                  <p className="mb-6">
                    Built with Next.js, Framer Motion, and Tailwind CSS. The interface is inspired by high-end automotive displays and premium audio products.
                  </p>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 mt-8">
                    <h5 className="text-white font-medium mb-1">Version 1.0</h5>
                    <p className="text-xs mb-3">Made with ❤️ by Ashif Elahi.</p>
                    <p className="text-xs italic border-t border-white/10 pt-3">
                      If someone wants to extend this project, they can contact me via <a href="mailto:asifelahi6@gmail.com" className="text-white hover:underline hover:text-primary transition-colors">asifelahi6@gmail.com</a>
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
