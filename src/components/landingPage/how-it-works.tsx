import { FolderIcon } from "./folder-icon";


const steps = [
    {
        number: "01",
        title: "Choose Your Folder",
        description: "Select any folder on your computer that you want to customize.",
        folder: { color: "coral" as const, emoji: "📁" },
    },
    {
        number: "02",
        title: "Pick a Style",
        description: "Choose from our beautiful color palette and add an optional emoji.",
        folder: { color: "teal" as const, emoji: "🎨" },
    },
    {
        number: "03",
        title: "Apply & Enjoy",
        description: "One click and your folder is transformed. It's that simple!",
        folder: { color: "purple" as const, emoji: "✨" },
    },
];

const HowItWorks = () => {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-6">
                {/* Section header */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        How it <span className="text-gradient">works</span>
                    </h2>
                    <p className="text-[#67677e] text-lg max-w-2xl mx-auto">
                        Decorating your folders is as easy as 1-2-3
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    {steps.map((step, index) => (
                        <div key={step.number} className="relative text-center">
                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-linear-to-r from-[#f06542]/30 to-transparent" />
                            )}

                            {/* Step number */}
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f065421a] text-[#f06542] font-bold text-lg mb-6">
                                {step.number}
                            </div>

                            {/* Folder icon */}
                            <div className="flex justify-center mb-6 animate-bounce-gentle">
                                <FolderIcon
                                    color={step.folder.color}
                                    size="xl"
                                    emoji={step.folder.emoji}
                                />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                            <p className="text-[#67677e] leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
export default HowItWorks