"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SHAYARIS = [
  "हॉर्न प्लीज़ 🚛",
  "देख मगर प्यार से ❤️",
  "बुरी नज़र वाले तेरा मुँह काला 🧿",
  "माँ की दुआ, सफ़र की हवा 🙏",
  "धीरे चलें, सुरक्षित रहें 🛣️",
  "जलने वाले का मुँह काला 🔥",
  "ओके टाटा, फिर मिलेंगे 👋",
  "नज़र हटी, दुर्घटना घटी ⚠️",
  "धीरे चलोगे, बार-बार मिलोगे 😊",
  "हमसे जलोगे तो राख हो जाओगे 😎",
  "सफ़र सुहाना, मंज़िल प्यारी 🌄",
  "मुस्कुराइए, आप भारत में हैं 🇮🇳",
  "रास्ते लंबे हैं, हौसले बुलंद हैं 💪",
  "दिल से चलो, जल्दबाज़ी से नहीं ❤️",
  "सफ़र ही ज़िंदगी है 🚚",
  "ज़िंदगी एक सफ़र है सुहाना 🎶",
  "चलते रहो, मुस्कुराते रहो 😊",
  "रफ़्तार नहीं, समझदारी ज़रूरी है 🚦",
  "खुश रहो, सुरक्षित चलो 🌸",
  "फिर मिलेंगे... हॉर्न प्लीज़! 🎺"
];

export default function TruckShayari() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Pick a random shayari on initial load
    setIndex(Math.floor(Math.random() * SHAYARIS.length));

    // Change shayari every 15 seconds
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SHAYARIS.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="px-6 py-3 rounded-xl bg-black/40 backdrop-blur-md border border-yellow-400/30 text-yellow-400 font-bold tracking-widest uppercase text-xs md:text-sm drop-shadow-[0_2px_10px_rgba(250,204,21,0.4)]"
        >
          {SHAYARIS[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
