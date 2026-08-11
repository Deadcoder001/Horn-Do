"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ActiveListeners() {
  const [listeners, setListeners] = useState(18245);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // Generate a simple random session ID for this tab/user
    const newSessionId = Math.random().toString(36).substring(2, 15);
    setSessionId(newSessionId);

    const fetchPresence = async () => {
      try {
        const res = await fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: newSessionId })
        });
        const data = await res.json();
        if (data && typeof data.count === 'number') {
          setListeners(data.count);
        }
      } catch (err) {
        console.error("Failed to ping presence API:", err);
      }
    };

    // Initial ping
    fetchPresence();

    // Ping every 15 seconds
    const interval = setInterval(fetchPresence, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="flex items-center gap-3 mt-12 bg-black/40 backdrop-blur-md py-3 px-6 rounded-full border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
      </div>
      <p className="text-text-secondary text-sm font-medium">
        <span className="text-white font-mono tabular-nums text-base mr-1">
          {listeners.toLocaleString()}
        </span>
        People Listening Right Now
      </p>
    </motion.div>
  );
}
