import { AnimatePresence, motion } from 'framer-motion';
import {
    Check,
    Lock,
    Rocket,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { VisualShowcase } from "~/components/purchase/visual-showcase";
import { authClient } from "~/server/better-auth/client";
import { api } from "~/trpc/react";

function Subscribe() {
    const { data: plans, isLoading: isPlansLoading } = api.polar.getPlans.useQuery();

    if (isPlansLoading) {
        return (
          <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-gray-600">Loading Plans...</p>
          </div>
        </div>
        );
    }

    const plan = plans?.[0];
    const trialCount = plan?.trialIntervalCount;
    const trialInterval = plan?.trialInterval;
    const credits = plan?.benefits[0]?.description
    const priceAmount = plan?.prices[0]?.amountType === "fixed" ? ((plan?.prices[0]?.priceAmount ?? 0)/100)?.toFixed(2) : "Free";
    const planName = plan?.name;
    const isExpanded = true;

    const subscribe = () => {
        const plan = plans?.[0];
        if (!plan) return;

        authClient.checkout({
            products: [plan.id],
        })

    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-6xl w-full bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Left Side - Visual/Brand Section */}
        <div className="md:w-1/2 bg-neutral-100 text-white p-8 md:p-12 flex flex-col justify-between overflow-hidden">
            <VisualShowcase />

          <div className="text-black mt-4">
            <div className="flex items-center gap-2">
            <Zap size={28} fill={"currentColor"} />
              <span className="text-2xl font-bold tracking-tight text-black">{planName}</span>
            </div>
          </div>

          <div className="text-center md:text-left text-black">
            {/* description */}
          </div>
        </div>

        {/* Right Side - Paywall Content */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col items-center justify-center text-[#1A1A1A]">
          <div className="max-w-md w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 tracking-tight">
              Start with {trialCount} {trialInterval} free.
            </h1>

            {/* Timeline Section */}
            <div className="bg-[#F8F9FA] rounded-2xl p-6 mb-8 border border-[#E9ECEF]">
              <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-[#E9ECEF]" />

                {/* Step 1 */}
                <div className="flex gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0 shadow-lg">
                    <Lock className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Today: Get instant access</h3>
                    <p className="text-sm text-[#6C757D] mt-1">Unlock all {planName} features immediately.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#E9ECEF] flex items-center justify-center shrink-0">
                    <Rocket className="text-[#ADB5BD] w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Day 12: Trial reminder</h3>
                    <p className="text-sm text-[#6C757D] mt-1">We'll remind you via email before your trial ends.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#E9ECEF] flex items-center justify-center shrink-0">
                    <ShieldCheck className="text-[#ADB5BD] w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Day 14: Become a member</h3>
                    <p className="text-sm text-[#6C757D] mt-1">Your subscription starts. Cancel anytime.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <p className="text-xl font-bold">
                Enjoy {trialCount} {trialInterval} free, then ${priceAmount}/month
              </p>
              <p className="text-sm text-[#6C757D] mt-1">
                (billed monthly at ${priceAmount})
              </p>
            </div>

            {/* Accordion / What's Included */}
            <div className="mb-8">
              <button 
                // onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-[#E9ECEF] hover:bg-[#F8F9FA] transition-colors group"
              >
                <span className="text-sm font-bold uppercase tracking-widest text-[#495057]">What's Included</span>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-3 bg-[#F8F9FA] rounded-b-xl border-x border-b border-[#E9ECEF]">
                      <div className="flex items-center gap-3 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{credits} monthly credits included</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Advanced analytics & reporting</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Priority 24/7 customer support</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <button
                onClick={subscribe}
            className="w-full bg-[#00D177] hover:bg-[#00B868] text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg shadow-green-500/20">
              Subscribe
            </button>

          </div>
        </div>
      </div>
    </div>
    )

}

export default Subscribe;