import "~/styles/globals.css";
// import "~/styles/landing.css";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Dekka",
  description: "Dekka",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.className} 'scroll-smooth'`}>
      <body>
        <NuqsAdapter>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
            }}
          />
        </NuqsAdapter>
      </body>
    </html>
  );
}
