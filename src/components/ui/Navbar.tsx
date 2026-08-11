"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiSearch, FiUser } from "react-icons/fi";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Playlists", href: "/playlists" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const navWidth = useTransform(scrollY, [0, 100], ["90%", "70%"]);
  const navY = useTransform(scrollY, [0, 100], [24, 16]);
  const navBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0.05)", "rgba(17, 17, 17, 0.75)"]
  );
  const navBlur = useTransform(scrollY, [0, 100], ["blur(8px)", "blur(24px)"]);
  const navBorder = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]
  );

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full"
      style={{ y: navY }}
    >
      <motion.nav
        style={{
          width: navWidth,
          backgroundColor: navBg,
          backdropFilter: navBlur,
          borderColor: navBorder,
        }}
        className="flex items-center justify-between px-8 py-4 border rounded-full transition-all duration-300 ease-out"
      >
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-primary text-3xl">हॉर्न</span>
            <span>Do</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-text-secondary hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

      </motion.nav>
    </motion.header>
  );
}
