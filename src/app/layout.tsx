import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import LoadingScreen from "@/components/ui/LoadingScreen";
import MusicPlayer from "@/components/player/MusicPlayer";
import BackgroundParticles from "@/components/effects/BackgroundParticles";
import { PlayerProvider } from "@/context/PlayerContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "हॉर्न Do | Horn OK Please",
  description: "Music made for roads, memories, and journeys.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased bg-background text-text-primary`}>
        <LoadingScreen />
        <BackgroundParticles />
        <SmoothScroll>
          <PlayerProvider>
            {children}
            <MusicPlayer />
          </PlayerProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
