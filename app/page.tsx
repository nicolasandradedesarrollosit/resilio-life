import Hero from "./_components/Hero";
import Video from "./_components/Video";
import FirstSection from "./_components/FirstSection";
import SecondSection from "./_components/SecondSection";
import ThirdSection from "./_components/ThirdSection";

import { Footer } from "@/shared/components/layout";

export default function Home() {
  return (
    <section className="flex flex-col items-center w-full min-h-screen bg-white">
      <Hero />
      <Video />
      <FirstSection />
      <SecondSection />
      <ThirdSection />
      <Footer />
    </section>
  );
}
