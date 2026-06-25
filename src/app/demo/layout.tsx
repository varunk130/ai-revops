import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live demo",
  description: "Watch nine agents across three pods turn “enter a new vertical” into one coherent launch plan — live, no API keys.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
