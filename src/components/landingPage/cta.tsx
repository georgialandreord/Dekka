
import { ArrowRight, Download } from "lucide-react";
import { FolderIcon } from "./folder-icon";
import { Button } from "../ui/button";

const CTA = () => {
    return (
        <section className="py-24 bg-[#fbfaf8] relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-[5%] opacity-30 animate-float">
                    <FolderIcon color="coral" size="md" />
                </div>
                <div className="absolute bottom-10 right-[5%] opacity-30 animate-float-delayed">
                    <FolderIcon color="teal" size="md" />
                </div>
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Headline */}
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                        Ready to make your desktop{" "}
                        <span className="text-gradient">sparkle</span>?
                    </h2>

                    <p className="text-[#67677e] text-lg mb-10 max-w-xl mx-auto">
                        Join thousands of happy users who have transformed their boring folders
                        into organized, beautiful icons.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <Button variant="hero" size="lg" className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gradient-warm text-white shadow-elevated hover:shadow-soft hover:-translate-y-1 hover:scale-[1.02] h-14 rounded-2xl px-10! text-base">
                            <Download className="w-5 h-5" />
                            Download Free
                        </Button>
                        <Button variant="outline" size="lg" className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-2 border-[#f06542]/20 bg-transparent text-foreground hover:border-[#f06542] hover:bg-transparent h-14 rounded-2xl px-10! text-base">
                            Learn More
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Social proof */}
                    <div className="flex items-center justify-center gap-8 text-sm text-[#67677e]">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {["🧑‍💻", "👩‍🎨", "👨‍💼", "👩‍🔬"].map((emoji, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-[#fef0e7] flex items-center justify-center border-2 border-[#fbfaf8]"
                                    >
                                        <span className="text-sm">{emoji}</span>
                                    </div>
                                ))}
                            </div>
                            <span>10k+ happy users</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className="text-lg">⭐</span>
                            ))}
                            <span className="ml-1">4.9 rating</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default CTA