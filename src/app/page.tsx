import "~/styles/landing.css";
import { AIGeneration } from "~/components/landingPage/ai-generation";
import CTA from "~/components/landingPage/cta";
import FAQ from "~/components/landingPage/faq";
import Features from "~/components/landingPage/features";
import Footer from "~/components/landingPage/footer";
import { Hero } from "~/components/landingPage/hero";
import HowItWorks from "~/components/landingPage/how-it-works";
import Navbar from "~/components/landingPage/navbar";
import Pricing from "~/components/landingPage/pricing";
import Testimonials from "~/components/landingPage/testimonials";

import { getSession } from "~/server/better-auth/server";
import { redirect } from "next/navigation";

export default async function Home() {


  const session = await getSession();

    return (
      <>
        <div className="min-h-screen">
          <Navbar />
          <Hero />
          <section id="features">
            <Features />
          </section>
          <section id="ai-generation">
            <AIGeneration />
          </section>
          <section id="how-it-works">
            <HowItWorks />
          </section>
          <Testimonials />
          <section id="pricing">
            <Pricing />
          </section>
          <FAQ />
          <CTA />
          <Footer />
        </div>
      </>
    )
}
