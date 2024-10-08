import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import "./globals.css";
import Styles from './styles.module.css'
import SideDrawer from "@/components/SideNav/SideDrawer";
import { QueryProvider } from "@/components/QueryProvider/QueryProvider";
import { GlobalContextProvider } from "@/components/GlobalContextProvider";
import { ClerkProvider } from '@clerk/nextjs'
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "World Builder",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
          <QueryProvider>
            <GlobalContextProvider>
              <div className={Styles.columns}>
                <SideDrawer>
                  {children}
                </SideDrawer>
              </div>
            </GlobalContextProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
