import { Check, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for trying out Dekka",
        features: [
            "10 folder customizations",
            "Basic color palette",
            "Standard emojis",
            "Community support",
        ],
        cta: "Get Started",
        variant: "outline" as const,
        popular: false,
    },
    {
        name: "Pro",
        price: "$9",
        period: "/month",
        description: "For power users who love customization",
        features: [
            "Unlimited customizations",
            "Full color palette",
            "Custom emoji upload",
            "AI icon generation",
            "Priority support",
            "Early access to features",
        ],
        cta: "Start Free Trial",
        variant: "hero" as const,
        popular: true,
    },
    {
        name: "Team",
        price: "$29",
        period: "/month",
        description: "For teams that want consistency",
        features: [
            "Everything in Pro",
            "Up to 10 team members",
            "Shared icon library",
            "Brand color presets",
            "Admin controls",
            "Dedicated support",
        ],
        cta: "Contact Sales",
        variant: "outline" as const,
        popular: false,
    },
];

const Pricing = () => {
    return (
        <section id="pricing" className="py-24 bg-[#fbfaf8]">
            <div className="container mx-auto px-6">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Simple, transparent <span className="text-gradient">pricing</span>
                    </h2>
                    <p className="text-[#67677e] text-lg max-w-2xl mx-auto">
                        Choose the plan that fits your needs. Upgrade or downgrade anytime.
                    </p>
                </div>

                {/* Pricing cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${plan.popular
                                    ? "bg-white border-[#f06542] shadow-elevated"
                                    : "bg-white border-none shadow-card hover:shadow-elevated"
                                }`}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full gradient-warm text-white text-sm font-medium shadow-soft">
                                        <Sparkles className="w-4 h-4" />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            {/* Plan header */}
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground">{plan.period}</span>
                                </div>
                                <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-[#f065421a] flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-3 h-3 text-[#f06542]" />
                                        </div>
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <Button variant={plan.variant} className="w-full rounded-full cursor-pointer px-10 h-14 bg-white hover:bg-white border border-[#f06542]" size="lg">
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Money back guarantee */}
                <p className="text-center text-[#67677e] text-sm mt-12">
                    💝 30-day money-back guarantee. No questions asked.
                </p>
            </div>
        </section>
    );
}
export default Pricing