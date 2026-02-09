import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";


const faqs = [
    {
        question: "How does Dekka work?",
        answer: "Dekka is a simple desktop app that lets you customize your folder icons. Just select a folder, choose a color and emoji (or let AI generate one), and click apply. Your folder icon updates instantly!",
    },
    {
        question: "What platforms does Dekka support?",
        answer: "Dekka currently supports macOS and Windows. We're working on Linux support, which will be available soon. All platforms get the same great features.",
    },
    {
        question: "How does the AI icon generation work?",
        answer: "Our AI analyzes your prompt or folder contents to generate unique, contextually relevant icons. Just describe what you want (like 'cozy recipe folder') and the AI creates multiple options for you to choose from.",
    },
    {
        question: "Can I restore my original folder icons?",
        answer: "Absolutely! Dekka keeps a backup of your original icons. You can restore them with a single click anytime. Your original icons are always safe.",
    },
    {
        question: "Is there a limit to how many folders I can customize?",
        answer: "Free users can customize up to 10 folders. Pro and Team plans offer unlimited customizations, plus access to AI generation and premium features.",
    },
    {
        question: "Do customized icons sync across devices?",
        answer: "Icons are applied locally to each device. However, Pro and Team users can export and import their icon presets to maintain consistency across devices.",
    },
    {
        question: "What if I need help or have questions?",
        answer: "We offer email support for all users. Pro users get priority support with faster response times, and Team users get dedicated support with a personal account manager.",
    },
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes! You can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period. We also offer a 30-day money-back guarantee.",
    },
];

const FAQ = () => {
    return (
        <section className="py-24 bg-[#fbfaf8]">
            <div className="container mx-auto px-6">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Frequently asked <span className="text-gradient">questions</span>
                    </h2>
                    <p className="text-[#67677e] text-lg max-w-2xl mx-auto">
                        Everything you need to know about Dekka. Can't find an answer? Reach out to our team.
                    </p>
                </div>

                {/* FAQ accordion */}
                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="bg-white rounded-2xl border border-[#ebe6e080] px-6 data-[state=open]:shadow-card transition-shadow"
                            >
                                <AccordionTrigger className="text-left hover:no-underline py-6">
                                    <span className="font-semibold">{faq.question}</span>
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* Contact CTA */}
                <div className="text-center mt-12">
                    <p className="text-[#67677e]">
                        Still have questions?{" "}
                        <a href="mailto:hello@dekka.app" className="text-[#f06542] hover:underline font-medium">
                            Contact our team
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
export default FAQ