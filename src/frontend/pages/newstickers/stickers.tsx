import { ArrowRight, Download, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import StyleCard from "~/components/style-card";
import { APP_STYLES, THEMES_DATA } from "~/mockdata";
import { useCreditsQuery } from "~/queries/useCreditsQuery";
import { authClient } from "~/server/better-auth/client";
import { api } from "~/trpc/react";
interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  removeBackground: boolean;
}

const Stickers = () => {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession();
  const { data: credits, isLoading: isCreditLoading } = useCreditsQuery()
  const [selectedStyleId, setSelectedStyleId] = useState<string | undefined>(
    APP_STYLES[0]?.id,
  );
  const [selectedThemeId, setSelectedThemeId] = useState<string | undefined>(
    THEMES_DATA[0]?.id,
  );
  const [removeBackground, setRemoveBackground] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  const selectedStyle = APP_STYLES.find((s) => s.id === selectedStyleId);

  const GenerateSticker =
    api.generateStickers.generateAndSaveSticker.useMutation();

  const buildFullPrompt = () => {
    const Style = selectedStyle?.name
    let fullPrompt = `${prompt}`;

    if (Style) {
      fullPrompt += `, ${Style}`;
    }

    fullPrompt +=
      `, high quality, ${removeBackground ? 'transparent background concept' : ''} isolated object and single object`;

    return fullPrompt;
  };

  const fullPrompt = buildFullPrompt();

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);

    // Capture all current values when generate is clicked
    const generationData = {
      removeBackground,
      fullPrompt,
    };

    try {
      // Call the API and wait for the response
      const result = await GenerateSticker.mutateAsync({
        prompt: generationData.fullPrompt,
        removeBackground: generationData.removeBackground
      });

      // Use the actual image URL from the API response
      const newImage: GeneratedImage = {
        id: result.id,
        url: result.fileUrl,
        prompt: generationData.fullPrompt,
        removeBackground: generationData.removeBackground,
      };

      setCurrentImage(newImage);
      setHistory((prev) => [newImage, ...prev.slice(0, 9)]); // Keep last 10
    } catch (error) {
      console.error("Error generating sticker:", error);
      // Handle error (you might want to show an error message to the user)
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!currentImage?.url) return;

    try {
      // 1. Fetch the image data
      const response = await fetch(currentImage.url);
      if (!response.ok) throw new Error("Network response was not ok");

      // 2. Convert response to a Blob (binary large object)
      const blob = await response.blob();

      // 3. Create an object URL for the blob
      const imageUrl = window.URL.createObjectURL(blob);

      // 4. Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = imageUrl;
      // Generate a filename based on the ID or timestamp
      link.download = `sticker-${currentImage.id}.png`;

      // 5. Append to document, click, and remove
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(imageUrl);

    } catch (error) {
      console.error("Error downloading image:", error);
      // Fallback: Open in new tab if CORS or fetch fails
      window.open(currentImage.url, '_blank');
    }
  };

  return (
    <div className="bg-background flex flex-col gap-3 lg:flex-row h-full">
      {/* Designer Sidebar */}
      <aside className="border-border z-20 flex w-full shrink-0 flex-col overflow-hidden rounded-xl border-r bg-white shadow-sm lg:w-[420px]">
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-foreground text-lg font-bold">
                Sticker Studio
              </h1>
              <p className="text-muted-foreground text-xs">
                AI-Powered Creation
              </p>
            </div>
          </div>
        </div>

        <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto px-8">
          {/* Style Selection */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                Style
              </h2>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-semibold">
                {APP_STYLES.length} styles
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {APP_STYLES.map((style) => (
                <StyleCard
                  key={style.id}
                  style={style}
                  isSelected={selectedStyleId === style.id}
                  onSelect={setSelectedStyleId}
                />
              ))}
            </div>
          </section>

          {/* Theme Selection */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-muted-foreground text-xs font-black tracking-[0.2em] uppercase">
                Theme
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {THEMES_DATA.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={`cursor-pointer rounded-xl border-2 px-4 py-2 text-xs font-bold transition-all ${selectedThemeId === theme.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </section>

          {/* Background Remove Option */}
          <section>
            <label className="group flex cursor-pointer items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={removeBackground}
                  onChange={(e) => setRemoveBackground(e.target.checked)}
                  className="peer sr-only"
                />
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${removeBackground
                    ? "bg-primary border-primary"
                    : "border-border bg-card group-hover:border-primary/50"
                    }`}
                >
                  {removeBackground && (
                    <svg
                      className="text-primary-foreground h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span
                className={`text-xs font-bold transition-colors ${removeBackground
                  ? "text-foreground"
                  : "text-muted-foreground group-hover:text-foreground"
                  }`}
              >
                Remove Background
              </span>
            </label>
          </section>

          {/* Prompt Area */}
          <section className="pb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                Prompt
              </h2>
            </div>
            <div className="group relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your sticker... e.g., 'a happy cat wearing sunglasses', 'a slice of pizza with a face'"
                className="border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/10 h-32 w-full resize-none rounded-2xl border p-4 text-sm leading-relaxed font-medium transition-all outline-none focus:ring-4"
              />
              <div className="text-muted-foreground/50 pointer-events-none absolute right-3 bottom-3 text-[9px] font-bold tracking-widest uppercase">
                AI Powered
              </div>
            </div>
          </section>
        </div>

        <div className="border-border bg-card border-t p-6">
          {credits === 0 ? <button
            onClick={() => navigate('/buy-credits')}
            className={`group relative flex w-full items-center justify-center cursor-pointer gap-3 overflow-hidden rounded-2xl py-4 text-sm font-bold tracking-wide transition-all duration-300 ${isGenerating
              ? "bg-secondary text-muted-foreground"
              : "bg-primary text-background shadow-xl hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
              }`}
          >
            {isGenerating && (
              <div className="bg-primary/20 absolute inset-0 animate-pulse" />
            )}
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="border-muted-foreground border-t-foreground h-4 w-4 animate-spin rounded-full border-2" />
                <span>Buying...</span>
              </div>
            ) : (
              <>
                <span>Buy Credits</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button> :
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={`group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl py-4 text-sm font-bold tracking-wide transition-all duration-300 ${!prompt.trim() || isGenerating
                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                : "bg-primary cursor-pointer text-background shadow-xl hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
                }`}
            >
              {isGenerating && (
                <div className="bg-primary/20 absolute inset-0 animate-pulse" />
              )}
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="border-muted-foreground border-t-foreground h-4 w-4 animate-spin rounded-full border-2" />
                  <span>Creating Magic...</span>
                </div>
              ) : (
                <>
                  <span>Generate Sticker</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          }
        </div>
      </aside>

      {/* Main Studio Display Area */}
      <main className="relative flex flex-1 flex-col overflow-hidden rounded-xl bg-white">
        {/* Subtle Background Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--foreground)) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Studio Content */}
        <div className="custom-scrollbar relative z-10 flex flex-1 flex-col items-center justify-center overflow-y-auto p-8 md:p-12">
          {isGenerating ? (
            <div className="animate-in fade-in zoom-in flex max-w-sm flex-col items-center text-center duration-700">
              <div className="relative mb-8 h-28 w-28">
                <div className="border-primary/20 absolute inset-0 rounded-3xl border-4" />
                <div
                  className="border-primary absolute inset-0 animate-spin rounded-3xl border-4 border-t-transparent border-r-transparent"
                  style={{ animationDuration: "1.5s" }}
                />
                <div className="bg-card absolute inset-3 flex items-center justify-center rounded-2xl shadow-xl">
                  <Sparkles className="text-primary h-8 w-8 animate-pulse" />
                </div>
              </div>
              <h3 className="text-foreground mb-2 text-xl font-bold">
                Creating Your Sticker
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Applying {selectedStyle?.name} style to your creation...
              </p>
            </div>
          ) : currentImage ? (
            <div className="animate-in zoom-in-[0.98] fade-in flex h-full w-full max-w-4xl flex-col items-center justify-center duration-700">
              <div className="group max-h-[65vh] border-border bg-card relative w-full max-w-2xl overflow-hidden rounded-3xl border p-3 shadow-xl">
                <div
                  className={`bg-secondary flex items-center justify-center overflow-hidden rounded-2xl size-full`}
                >
                  <img
                    src={currentImage.url}
                    alt={currentImage.prompt}
                    className="h-full w-full transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="absolute right-8 bottom-8 flex translate-y-4 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <button className="bg-card/95 text-foreground hover:bg-primary cursor-pointer hover:text-background flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-lg backdrop-blur-sm transition-all"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in flex max-w-lg flex-col items-center text-center duration-700">
              <div className="mb-10 grid grid-cols-2 gap-4 opacity-30">
                <div className="border-border bg-primary/30 h-40 w-36 rounded-3xl border-2 border-dashed" />
                <div className="border-border bg-primary/30 mt-6 h-40 w-36 rounded-3xl border-2 border-dashed" />
              </div>
              <h2 className="text-foreground mb-4 text-3xl leading-tight font-bold md:text-4xl">
                Create Amazing
                <br />
                <span className="text-gradient">AI Stickers</span>
              </h2>
              <p className="text-muted-foreground max-w-sm text-base leading-relaxed">
                Choose a style, describe your vision, and watch as AI transforms
                your ideas into beautiful stickers.
              </p>

              <div className="text-muted-foreground/50 mt-10 flex items-center gap-8">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-foreground/30 text-2xl font-bold">
                    10
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase">
                    Styles
                  </span>
                </div>
                <div className="bg-border h-10 w-px" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-foreground/30 text-2xl font-bold">
                    HD
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase">
                    Quality
                  </span>
                </div>
                <div className="bg-border h-10 w-px" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-foreground/30 text-2xl font-bold">
                    ⚡
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase">
                    Fast
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Stickers;
