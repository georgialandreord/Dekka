import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Chen",
        role: "Designer at Figma",
        avatar: "SC",
        content: "Dekka transformed my chaotic desktop into something I actually enjoy looking at. The AI generation feature is pure magic!",
        rating: 5,
    },
    {
        name: "Marcus Johnson",
        role: "Software Engineer",
        avatar: "MJ",
        content: "Finally, a tool that understands aesthetics. My project folders are now color-coded and beautiful. Productivity went up 10x!",
        rating: 5,
    },
    {
        name: "Emily Rodriguez",
        role: "Content Creator",
        avatar: "ER",
        content: "I use Dekka to organize my video projects. The custom emojis help me find things instantly. Can't imagine working without it!",
        rating: 5,
    },
    {
        name: "Alex Kim",
        role: "Product Manager",
        avatar: "AK",
        content: "The team loves it! We have consistent folder icons across all our shared drives now. Makes collaboration so much smoother.",
        rating: 5,
    },
    {
        name: "Jordan Taylor",
        role: "Freelance Writer",
        avatar: "JT",
        content: "Simple, beautiful, and it just works. Dekka is one of those apps that makes you wonder how you lived without it.",
        rating: 5,
    },
    {
        name: "Priya Sharma",
        role: "UX Researcher",
        avatar: "PS",
        content: "The AI feature suggested the perfect icons for my research folders. It's like having a personal organizer that reads your mind!",
        rating: 5,
    },
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-[#f3f0ed4d] overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Loved by <span className="text-gradient">thousands</span>
                    </h2>
                    <p className="text-[#67677e] text-lg max-w-2xl mx-auto">
                        Join the community of people who've transformed their digital workspace.
                    </p>
                </div>

                {/* Testimonials grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.name}
                            className="bg-white p-6 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-[#f06542] text-[#f06542]" />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-foreground mb-6 leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center text-white font-semibold text-sm">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{testimonial.name}</p>
                                    <p className="text-[#67677e] text-xs">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-[#ebe6e080]">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-gradient">50K+</p>
                        <p className="text-[#67677e] text-sm mt-1">Happy Users</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-gradient">1M+</p>
                        <p className="text-[#67677e] text-sm mt-1">Folders Decorated</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-gradient">4.9★</p>
                        <p className="text-[#67677e] text-sm mt-1">Average Rating</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-gradient">100+</p>
                        <p className="text-[#67677e] text-sm mt-1">Countries</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Testimonials