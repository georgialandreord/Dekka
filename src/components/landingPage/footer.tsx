"use client"
import { Heart } from "lucide-react";

const Footer = () => {

    const navItems = [
        { label: "Features", id: "features" },
        { label: "How it works", id: "how-it-works" },
        { label: "Pricing", id: "pricing" },
        { label: "Privacy", id: "privacy-policy" },
    ];

    const scrollToSection = (sectionId: string, closeMenu?: () => void) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            closeMenu?.();
        }
    };
    return (
        <footer className="py-12 bg-[#f3f0ed4d] border-t border-[#ebe6e080]">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-warm flex items-center justify-center">
                            <span className="text-white font-bold">D</span>
                        </div>
                        <span className="text-xl font-bold">Dekka</span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-[#67677e]">
                        {
                            navItems.map((item) => (
                                <button key={item.id} className="hover:text-[#29293d] transition-colors cursor-pointer" onClick={() => scrollToSection(item.id)}>{item.label}</button>
                            ))
                        }
                    </div>

                    {/* Made with love */}
                    <div className="flex items-center gap-2 text-sm text-[#67677e]">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-[#f06542] fill-[#f06542]" />
                        <span>for organized people</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer