import { motion } from "framer-motion";
import { Upload, Image, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

const Sandbox = () => {
  return (
    <div className="gradient-mesh flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="bg-accent text-accent-foreground inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Background Removal</span>
            </div>

            <h1 className="text-foreground text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
              Your Creative
              <span className="text-primary block">Sticker Library</span>
            </h1>

            <p className="text-muted-foreground mx-auto max-w-lg text-lg">
              Upload, organize, and enhance your stickers with one-click
              background removal. Build your perfect collection.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link to="/upload">
              <Button
                size="lg"
                className="shadow-glow h-12 cursor-pointer px-8 text-base"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Stickers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 gap-4 pt-12 sm:grid-cols-3"
          >
            {[
              {
                icon: Upload,
                title: "Drag & Drop",
                description: "Upload multiple files at once",
              },
              {
                icon: Sparkles,
                title: "Remove BG",
                description: "One-click AI background removal",
              },
              {
                icon: Image,
                title: "Organize",
                description: "Build your sticker collection",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="glass border-primary/50 rounded-2xl border p-6"
              >
                <div className="bg-primary/10 mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl">
                  <feature.icon className="text-primary h-5 w-5" />
                </div>
                <h3 className="text-foreground mb-1 font-semibold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-muted-foreground py-6 text-center text-sm">
        <p>Sticker Library • Upload and manage your creative assets</p>
      </footer>
    </div>
  );
};

export default Sandbox;
