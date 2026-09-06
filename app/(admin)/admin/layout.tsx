import AdminSideNav from "@/components/AdminSideNav";
import AdminMobileSideNav from "@/components/AdminMobileSideNav";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");
    if (session.user.role !== "admin") redirect("/");

    return (
      <main className="min-h-screen p-4 md:p-6 lg:p-10 flex flex-col lg:flex-row gap-6 items-start">
        <aside className="hidden lg:block w-64 shrink-0 sticky top-6">
          <AdminSideNav />
        </aside>

        <div className="block lg:hidden w-full">
          <AdminMobileSideNav />
        </div>

        <section className="flex-1 min-w-0 w-full">
          {children}
        </section>
      </main>
    );
}