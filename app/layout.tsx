import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import "./globals.css";
import { QueryProvider } from "@/components/QueryProvider/QueryProvider";
import { GlobalContextProvider } from "@/components/GlobalContextProvider";
import { ClerkProvider } from '@clerk/nextjs'
import { SideBarWrapper } from "@/components/SideBar/SideBarWrapper"
import { Toaster } from "@/components/ui/toaster"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "World Builder",
  description: "Build your world here!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        </head>
        <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
          <QueryProvider>
            <GlobalContextProvider>
              <SideBarWrapper>
                <div id="tutorial-start">
                  {children}
                </div>
              </SideBarWrapper>
              <Toaster />
            </GlobalContextProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
