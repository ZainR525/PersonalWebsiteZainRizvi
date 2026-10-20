import type { Metadata, Viewport } from "next";
// Mac and iPhone render Apple's own SF Pro (the system font). Everywhere else
// falls back to Inter, which only downloads when SF Pro isn't available.
import "@fontsource-variable/inter/opsz.css";
import "./globals.css";
import Providers from "./components/Providers";

export const metadata: Metadata = {
  title: "Zain Rizvi",
  description:
    "Computer Engineering and Computer Science student at Northeastern. Federated learning research, research software for Oak Ridge National Laboratory, and an interest in software for medicine.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
