
import type { Metadata } from "next";
import {  Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({
  subsets:['latin'],
  weight:['300','400','500','600','700','800','900']
})



export const metadata: Metadata = {
  title: "ESTAETA | Find Your Dream Home & Luxury Properties",
  description: "Find your ideal home or investment property with ESTAETA. Browse exclusive local listings, transparent pricing, and market-leading insights.",
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
