import { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';

const images = [
    {
        url: 'https://fal.ai/onboarding/login-image-4.jpg',
        prompt: 'Vibrant abstract painting with bold color strokes'
    },
    {
        url: 'https://fal.ai/onboarding/login-image-2.jpg',
        prompt: 'Futuristic cyber aesthetic with neon highlights'
    },
    {
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop',
        prompt: 'Vibrant abstract painting with bold color strokes'
    },
];

export const VisualShowcase = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full aspect-4/5 group">
            {/* Background Glow */}
            <div className="absolute -inset-8 bg-linear-to-tr from-primary/20 via-accent/10 to-transparent blur-3xl opacity-60 animate-pulse-slow" />

            {/* Main Image Frame */}
            <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-strong border-4 border-card bg-primary">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        <img
                            src={img.url}
                            className="h-full w-full object-cover transition-transform duration-[5s] scale-100 group-hover:scale-105"
                            alt="AI Generated Art"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-bg-primary/70 via-transparent to-transparent" />

                        {/* Prompt Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 glass-panel rounded-xl p-3 shadow-medium bg-primary/30">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-2 bg-primary rounded-md">
                                    <Wand2 size={12} className="text-white" />
                                </div>
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Prompt</span>
                            </div>
                            <p className="text-sm text-white font-medium italic">
                                "{img.prompt}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress Indicators */}
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 flex flex-col gap-2 z-20">
                {images.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-1 rounded-full transition-all duration-500 ${idx === activeIndex ? 'h-8 bg-primary' : 'h-2 bg-border'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};