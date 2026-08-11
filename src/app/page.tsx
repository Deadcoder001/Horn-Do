import Hero from "@/components/hero/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-white">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <Hero />
    </main>
  );
}
