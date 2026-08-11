"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AppleClock() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return { hours, strMinutes };
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const { hours, strMinutes } = formatTime(time);

  return (
    <motion.div 
      className="flex flex-col items-center justify-center select-none"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="text-white/90 text-sm md:text-lg font-semibold tracking-wide mb-[-5px] md:mb-[-8px] drop-shadow-md">
        {formatDate(time)}
      </div>
      <div className="flex items-center justify-center font-bold text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
        {/* Adjusted time text for center placement */}
        <span className="text-[64px] md:text-[96px] leading-none tracking-tighter">
          {hours}:{strMinutes}
        </span>
      </div>
    </motion.div>
  );
}
