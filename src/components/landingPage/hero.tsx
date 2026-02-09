
import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { FolderIcon } from "./folder-icon";

export function Hero() {
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden mt-10">
      {/* Floating folder decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[10%] animate-float opacity-60">
          <FolderIcon color="teal" size="lg" emoji="📁" />
        </div>
        <div className="absolute top-40 right-[15%] animate-float-delayed opacity-50">
          <FolderIcon color="purple" size="md" emoji="✨" />
        </div>
        <div className="absolute bottom-32 left-[20%] animate-float-slow opacity-40">
          <FolderIcon color="gold" size="md" emoji="🎨" />
        </div>
        <div className="absolute top-1/2 right-[8%] animate-float opacity-50">
          <FolderIcon color="mint" size="lg" emoji="🚀" />
        </div>
        <div className="absolute bottom-48 right-[25%] animate-float-delayed opacity-60">
          <FolderIcon color="coral" size="sm" emoji="💼" />
        </div>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f065421a] rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#e0f5f34d] rounded-full blur-3xl" />

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fef0e7] text-[#bd320f] text-sm font-medium shadow-soft">
            <Sparkles className="w-4 h-4" />
            <span>Organize with style</span>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-center text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
          Make your folders{" "}
          <span className="text-gradient">beautiful</span>
        </h1>

        {/* Subtitle */}
        <p className="text-center text-lg md:text-xl text-[#67677e] max-w-2xl mx-auto mb-10 leading-relaxed">
          Transform boring folder icons into vibrant, organized masterpieces.
          Color-code, add emojis, and bring joy to your desktop.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button size="lg" className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gradient-warm text-white shadow-elevated hover:shadow-soft hover:-translate-y-1 hover:scale-[1.02] h-14 rounded-2xl px-10! text-base">
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-2 border-[#f06542]/20 bg-transparent text-foreground hover:border-[#f06542] hover:bg-transparent h-14 rounded-2xl px-10 text-base">
            See How It Works
          </Button>
        </div>

        {/* Preview Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-elevated border border-[#ebe6e080]">
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-6 justify-items-center">
              <div className="hover:scale-110 transition-transform cursor-pointer">
                <FolderIcon color="coral" size="lg" emoji="📸" />
              </div>
              <div className="hover:scale-110 transition-transform cursor-pointer">
                <FolderIcon color="teal" size="lg" emoji="🎵" />
              </div>
              <div className="hover:scale-110 transition-transform cursor-pointer">
                <FolderIcon color="purple" size="lg" emoji="📚" />
              </div>
              <div className="hover:scale-110 transition-transform cursor-pointer hidden sm:block">
                <FolderIcon color="gold" size="lg" emoji="💻" />
              </div>
              <div className="hover:scale-110 transition-transform cursor-pointer hidden sm:block">
                <FolderIcon color="mint" size="lg" emoji="🎮" />
              </div>
              <div className="hover:scale-110 transition-transform cursor-pointer hidden md:block">
                <FolderIcon color="coral" size="lg" emoji="📁" />
              </div>
              <div className="hover:scale-110 transition-transform cursor-pointer hidden md:block">
                <FolderIcon color="teal" size="lg" emoji="🎨" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}