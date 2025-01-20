"use client";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("./components/Header"), { ssr: false });
const Landing = dynamic(() => import("./components/Landing"), { ssr: false });
const Footer = dynamic(() => import("./components/Footer"), { ssr: false });

export default function Home() {
  return (
    <div>
      <main>
        <Header />
        <Landing />
        <Footer />
      </main>
    </div>
  );
}