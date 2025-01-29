"use client";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/app/components/Header"), { ssr: false });
const Footer = dynamic(() => import("@/app/components/Footer"), { ssr: false });
const PreviewStage = dynamic(
  () => import("@/app/components/PreviewComponent"),
  { ssr: false }
);

export default function Stages() {
  return (
    <div>
      <main>
        <Header />
        <PreviewStage />
        <Footer />
      </main>
    </div>
  );
}
