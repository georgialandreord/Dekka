import { useEffect } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

export const SuccessScreen = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ["credits"] });
        // Redirect after 5 seconds
        const timer = setTimeout(() => {
            navigate("/dashboard");
        }, 5000);

        // Cleanup on unmount
        return () => clearTimeout(timer);
    }, [queryClient]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6 overflow-hidden">
            <motion.div
                initial={{ y: -120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    duration: 0.6,
                    ease: "easeOut",
                }}
                className="max-w-md w-full glass-panel rounded-3xl p-8 text-center shadow-strong border border-success flex flex-col items-center"
            >
                <div className="relative mb-6">
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center text-success">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="absolute -top-1 -right-1 bg-success rounded-full p-1.5 text-primary-foreground animate-float">
                        <Sparkles size={14} />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-foreground mb-2">
                    Purchase Complete!
                </h1>

                <p className="text-muted-foreground mb-8 leading-relaxed">
                    Your <span className="font-bold text-primary"></span> credits have been
                    added to your account. Start creating amazing content!
                </p>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full bg-success cursor-pointer hover:opacity-90 text-primary-foreground font-bold py-4 rounded-xl transition-all shadow-medium active:scale-[0.98]"
                >
                    Continue to Dashboard
                </button>
            </motion.div>
        </div>
    );
};
