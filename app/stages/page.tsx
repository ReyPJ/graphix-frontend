"use client";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/app/components/Header"), { ssr: false });
const StagesCompo = dynamic(() => import("@/app/components/StagesCompo"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/app/components/Footer"), { ssr: false });

export default function Home() {
  return (
    <div>
      <main>
        <Header />
        <StagesCompo />
        <Footer />
      </main>
    </div>
  );
}
