import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import React from "react";
import { Toaster } from "sonner";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>  
      <NavBar />
      <main>{children}</main>
      <Footer />
      <Toaster 
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          className: "!font-sans !rounded-xl !shadow-2xl !border-slate-200",
        }}
      />
    </>
  );
}