"use client";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/app/components/Header"), { ssr: false });
const AdminPanel = dynamic(() => import("@/app/components/Adminpanel"), { ssr: false });
const Footer = dynamic(() => import("@/app/components/Footer"), { ssr: false });

export default function Home() {
  return (
    <div>
      <main>
        <Header />
        <AdminPanel />
        <Footer />
      </main>
    </div>
  );
}