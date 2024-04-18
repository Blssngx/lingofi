import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lingofi - Bringing Blockchain Closer to Home",
  description: "Lingofi leverages AI and blockchain technology to make financial services accessible and affordable across Africa, addressing language barriers and reducing transaction costs with user-friendly blockchain solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex flex-col flex-1 bg-muted/50">
              
              {children}
            </main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
