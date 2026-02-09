import PrivacyPolicy from "~/components/landingPage/privacy-policy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Dekka",
  description:
    "Learn how Dekka protects your privacy and handles your data securely.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <PrivacyPolicy />
    </div>
  );
}
