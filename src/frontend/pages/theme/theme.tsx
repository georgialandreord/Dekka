import { ThemeCard } from "~/components/theme-card";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useTheme, type ThemeName } from "~/contexts/ThemeContext";

const themes: {
  name: ThemeName;
  displayName: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}[] = [
    {
      name: "ocean",
      displayName: "Ocean Blue",
      description: "Cool and professional with calming blue tones",
      colors: {
        primary: "oklch(0.55 0.18 217.7)",
        secondary: "oklch(0.94 0.02 214.3)",
        accent: "oklch(0.94 0.02 217.7)",
        background: "oklch(0.96 0.005 264.667)",
      },
    },
    {
      name: "forest",
      displayName: "Forest Green",
      description: "Natural and calming with earthy greens",
      colors: {
        primary: "oklch(0.48 0.14 142.5)",
        secondary: "oklch(0.96 0.01 140.2)",
        accent: "oklch(0.96 0.01 142.5)",
        background: "oklch(0.96 0.005 264.667)",
      },
    },
    {
      name: "sunset",
      displayName: "Sunset Orange",
      description: "Warm and energetic with vibrant oranges",
      colors: {
        primary: "oklch(0.62 0.16 25.3)",
        secondary: "oklch(0.96 0.01 30.5)",
        accent: "oklch(0.96 0.01 25.3)",
        background: "oklch(0.96 0.005 264.667)",
      },
    },
    {
      name: "rose",
      displayName: "Rose Pink",
      description: "Soft and elegant with rosy pink hues",
      colors: {
        primary: "oklch(0.58 0.15 346.5)",
        secondary: "oklch(0.96 0.01 350.3)",
        accent: "oklch(0.96 0.01 346.5)",
        background: "oklch(0.96 0.005 264.667)",
      },
    },
    {
      name: "slate",
      displayName: "Slate Gray",
      description: "Minimal and neutral for a clean look",
      colors: {
        primary: "oklch(0.35 0.02 215.2)",
        secondary: "oklch(0.96 0.003 220.4)",
        accent: "oklch(0.96 0.003 215.2)",
        background: "oklch(0.96 0.005 264.667)",
      },
    },
    {
      name: "lavender",
      displayName: "Lavender",
      description: "Creative and calming with purple vibes",
      colors: {
        primary: "oklch(0.6 0.16 262.8)",
        secondary: "oklch(0.96 0.01 270.3)",
        accent: "oklch(0.96 0.01 262.8)",
        background: "oklch(0.96 0.005 264.667)",
      },
    },
    {
      name: "teal",
      displayName: "Teal Waters",
      description: "Fresh and modern with cyan undertones",
      colors: {
        primary: "oklch(0.52 0.14 185.6)",
        secondary: "oklch(0.96 0.01 188.2)",
        accent: "oklch(0.96 0.01 185.6)",
        background: "oklch(0.96 0.005 264.667)",
      },
    },
    {
      name: "amber",
      displayName: "Golden Amber",
      description: "Luxurious and warm with golden accents",
      colors: {
        primary: "oklch(0.68 0.16 75.8)",
        secondary: "oklch(0.96 0.02 78.5)",
        accent: "oklch(0.96 0.02 75.8)",
        background: "oklch(0.96 0.005 264.667)",
      },
    },
    {
      name: "plum",
      displayName: "Royal Plum",
      description: "Elegant and bold with deep purple richness",
      colors: {
        primary: "oklch(0.42 0.16 315.5)",
        secondary: "oklch(0.96 0.01 318.3)",
        accent: "oklch(0.96 0.01 315.5)",
        background: "oklch(0.96 0.005 264.667)",
      },
    },
  ];

const Themes = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="animate-fade-in">
          <div className="mb-8">
            <h2 className="text-foreground mb-2 text-2xl font-bold">
              All Themes
            </h2>
            <p className="text-muted-foreground">
              Browse all available themes and find the perfect one for you.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {themes.map((themeOption) => (
              <ThemeCard
                key={themeOption.name}
                name={themeOption.name}
                displayName={themeOption.displayName}
                description={themeOption.description}
                colors={themeOption.colors}
                isActive={theme === themeOption.name}
                onClick={() => setTheme(themeOption.name)}
              />
            ))}
          </div>

          {/* Sample UI Components */}
          <div className="mt-12 space-y-6">
            <h3 className="text-foreground text-xl font-semibold">
              Component Preview
            </h3>

            <Card>
              <CardHeader>
                <CardTitle>Sample Card</CardTitle>
                <CardDescription>
                  This is how cards look with the current theme
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Themes;
