"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { authClient } from "~/server/better-auth/client";

/* ---------------- Helpers ---------------- */

const navItems = [
  { label: "Features", id: "features" },
  { label: "How it works", id: "how-it-works" },
  { label: "Pricing", id: "pricing" },
  { label: "Privacy", id: "privacy-policy" },
];

/* ---------------- Desktop animations ---------------- */

const desktopContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const desktopItem: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1], // TS-safe easing
    },
  },
};

/* ---------------- Mobile animations ---------------- */

const menuVariants: Variants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 1, 1],
    },
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
};

const mobileItem: Variants = {
  closed: {
    opacity: 0,
    y: -8,
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* ---------------- Component ---------------- */

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const closeMenu = () => setMobileMenuOpen(false);

  const scrollToSection = (sectionId: string, closeMenu?: () => void) => {
    // Handle navigation to separate pages for privacy and terms
    if (sectionId === "privacy-policy") {
      closeMenu?.();
      // window.location.href = "/privacy";
      router.push("/privacy")
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      // Close menu immediately for better UX on mobile
      closeMenu?.();

      // Small delay to ensure menu closes before scrolling
      setTimeout(
        () => {
          const offset = 80; // Account for fixed navbar height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        },
        closeMenu ? 150 : 0,
      );
    }
  };

  const handleSignIn = () => {
    router.push("/auth/login");
  };

  return (
    <nav className="glass fixed top-0 right-0 left-0 z-50 border-b border-[#ebe6e080]">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="gradient-warm flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="font-bold text-white">D</span>
            </div>
            <span className="text-foreground text-xl font-bold">Dekka</span>
          </div>

          {/* Desktop Navigation (animated on load) */}
          <motion.div
            className="hidden items-center gap-8 md:flex"
            variants={desktopContainer}
            initial="hidden"
            animate="visible"
          >
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                variants={desktopItem}
                onClick={() => scrollToSection(item.id)}
                className="cursor-pointer py-2 text-[#67677e] transition-colors hover:text-[#29293d]"
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Desktop CTA (animated slightly later) */}
          <motion.div
            className="hidden items-center gap-4 md:flex"
            variants={desktopContainer}
            initial="hidden"
            animate="visible"
            transition={{ delayChildren: 0.45 }}
          >

            {
              session ? <motion.div variants={desktopItem}>
                <Button
                  onClick={() => {
                    window.location.href = "/dashboard/folders"
                  }}
                  variant="ghost"
                  className="ring-offset-background focus-visible:ring-ring inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-2 text-sm font-semibold whitespace-nowrap transition-all bg-[#f06542] text-white hover:bg-[#f06542] duration-300 hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                >
                  {" "}
                  Dashboard{" "}
                </Button>
              </motion.div>
                :
                <motion.div variants={desktopItem}>
                  <Button
                    onClick={handleSignIn}
                    variant="ghost"
                    className="ring-offset-background focus-visible:ring-ring inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-2 text-sm font-semibold whitespace-nowrap transition-all bg-[#fef0e7] text-[#bd320f] hover:bg-[#fef0e7] duration-300 hover:text-[#bd320f] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                  >
                    {" "}
                    Sign In{" "}
                  </Button>
                </motion.div>
            }
          </motion.div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="relative z-50 cursor-pointer rounded-lg p-2 transition-colors hover:bg-[#fef0e7] md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative h-6 w-6">
              <motion.div
                animate={{
                  rotate: mobileMenuOpen ? 90 : 0,
                  opacity: mobileMenuOpen ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Menu className="h-6 w-6" />
              </motion.div>

              <motion.div
                animate={{
                  rotate: mobileMenuOpen ? 0 : -90,
                  opacity: mobileMenuOpen ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <X className="h-6 w-6" />
              </motion.div>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="overflow-hidden md:hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <div className="border-border border-t py-4">
                <motion.div
                  className="flex flex-col gap-2"
                  variants={menuVariants}
                >
                  {navItems.map((item) => (
                    <motion.button
                      key={item.id}
                      variants={mobileItem}
                      onClick={() => scrollToSection(item.id, closeMenu)}
                      className="hover:bg-accent cursor-pointer rounded-lg px-4 py-3 text-left text-[#67677e] hover:text-[#29293d]"
                    >
                      {item.label}
                    </motion.button>
                  ))}

                  {
                    session ? <motion.div
                      variants={mobileItem}
                      className="flex flex-col gap-2 pt-4"
                    >
                      <Button
                        onClick={() => {
                          window.location.href = "/dashboard/folders"
                        }}
                        variant="ghost"
                        className="ring-offset-background focus-visible:ring-ring inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-2 text-sm font-semibold whitespace-nowrap bg-[#f06542] text-white transition-all duration-300 hover:bg-[#f06542] hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                      >
                        {" "}
                        Dashboard{" "}
                      </Button>
                    </motion.div>
                      :
                      <motion.div
                        variants={mobileItem}
                        className="border-border mt-2 flex flex-col gap-2 border-t pt-4"
                      >
                        <Button
                          onClick={handleSignIn}
                          variant="ghost"
                          className="ring-offset-background focus-visible:ring-ring inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-2 text-sm font-semibold whitespace-nowrap bg-[#fef0e7] text-[#bd320f] transition-all duration-300 hover:bg-[#fef0e7] hover:text-[#bd320f] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                        >
                          {" "}
                          Sign In{" "}
                        </Button>
                      </motion.div>
                  }
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
