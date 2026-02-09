import { Palette, Smile, Layers, Zap, Shield, Heart } from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Beautiful Colors",
    description: "Choose from a vibrant palette of colors to match your aesthetic or mood.",
    gradient: "from-[hsl(12,85%,60%)] to-[hsl(25,90%,65%)]",
  },
  {
    icon: Smile,
    title: "Emoji Support",
    description: "Add emojis to your folders for quick visual recognition at a glance.",
    gradient: "from-[hsl(40,90%,55%)] to-[hsl(35,85%,60%)]",
  },
  {
    icon: Layers,
    title: "Smart Organization",
    description: "Create a system that makes sense to you with customizable themes.",
    gradient: "from-[hsl(175,60%,45%)] to-[hsl(185,55%,55%)]",
  },
  {
    icon: Zap,
    title: "Instant Apply",
    description: "One-click application. See your changes instantly without any hassle.",
    gradient: "from-[hsl(265,60%,60%)] to-[hsl(280,55%,70%)]",
  },
  {
    icon: Shield,
    title: "Safe & Reversible",
    description: "Don't worry, you can always restore original icons with one click.",
    gradient: "from-[hsl(160,50%,50%)] to-[hsl(150,55%,60%)]",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Crafted for people who appreciate beauty in the small details.",
    gradient: "from-[hsl(340,70%,55%)] to-[hsl(350,75%,65%)]",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-[#fbfaf8]">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Why you'll <span className="text-gradient">love</span> Dekka
          </h2>
          <p className="text-[#67677e] text-lg max-w-2xl mx-auto">
            Simple yet powerful features designed to bring joy to your desktop organization.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-white border border-[#ebe6e080] shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div 
                className={`w-14 h-14 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-soft group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-[#67677e] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Features