import { Sparkles, Wand2, Cpu, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { FolderIcon } from "./folder-icon";

const generatedExamples = [
    { color: "coral" as const, emoji: "🎬", label: "Movies" },
    { color: "teal" as const, emoji: "🎵", label: "Music" },
    { color: "purple" as const, emoji: "📷", label: "Photos" },
    { color: "gold" as const, emoji: "💼", label: "Work" },
    { color: "mint" as const, emoji: "🎮", label: "Games" },
    { color: "coral" as const, emoji: "📚", label: "Books" },
];

export function AIGeneration() {
    return (
        <section className="py-24 bg-linear-to-b from-background to-muted/30 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f06542]/10 text-[#f06542] text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span>AI-Powered</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                            Generate stunning icons with{" "}
                            <span className="text-gradient">AI magic</span>
                        </h2>

                        <p className="text-lg text-[#67677e] mb-8 leading-relaxed">
                            Don't just pick from presets — let our AI create unique, personalized folder icons
                            based on your content. Describe what you want, and watch the magic happen.
                        </p>

                        {/* Features list */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#f06542]/10 flex items-center justify-center shrink-0">
                                    <Wand2 className="w-5 h-5 text-[#f06542]" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Describe & Generate</h4>
                                    <p className="text-[#67677e] text-sm">Type what you want and AI creates it instantly</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#f06542]/10 flex items-center justify-center shrink-0">
                                    <Cpu className="w-5 h-5 text-[#f06542]" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Smart Recognition</h4>
                                    <p className="text-[#67677e] text-sm">AI analyzes folder contents to suggest perfect icons</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#f06542]/10 flex items-center justify-center shrink-0">
                                    <Zap className="w-5 h-5 text-[#f06542]" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Instant Results</h4>
                                    <p className="text-[#67677e] text-sm">Get beautiful icons in seconds, not minutes</p>
                                </div>
                            </div>
                        </div>

                        <Button size="lg" className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gradient-warm text-white shadow-elevated hover:shadow-soft hover:-translate-y-1 hover:scale-[1.02] h-14 rounded-2xl px-10! text-base">
                            Try AI Generation
                            <Sparkles className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Right visual */}
                    <div className="relative">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-linear-to-r from-[#f06542]/20 to-[#e0f5f333] rounded-3xl blur-3xl" />

                        {/* Card */}
                        <div className="relative bg-white rounded-3xl p-8 border border-[#ebe6e080] shadow-elevated">
                            {/* AI prompt mockup */}
                            <div className="bg-[#f3f0ed80] rounded-2xl p-4 mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg gradient-warm flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium">AI Prompt</span>
                                </div>
                                <p className="text-muted-foreground text-sm italic">
                                    "Create a warm, cozy folder icon for my recipe collection..."
                                </p>
                            </div>

                            {/* Generated results */}
                            <p className="text-sm text-muted-foreground mb-4">Generated icons:</p>
                            <div className="grid grid-cols-3 gap-4">
                                {generatedExamples.map((example, index) => (
                                    <div
                                        key={example.label}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#f3f0ed4d] hover:bg-[#f3f0ed80] transition-colors cursor-pointer group"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="group-hover:scale-110 transition-transform">
                                            <FolderIcon color={example.color} size="md" emoji={example.emoji} />
                                        </div>
                                        <span className="text-xs text-muted-foreground">{example.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Decorative sparkles */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 text-[#f06542] animate-pulse">
                                <Sparkles className="w-full h-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}