import type { Metadata } from "next";
import AlertBar from "@/components/AlertBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowToChoose from "@/components/HowToChoose";
import RankingSection from "@/components/RankingSection";
import LatestArticles from "@/components/LatestArticles";
import Footer from "@/components/Footer";
import StickyBottomCTA from "@/components/StickyBottomCTA";

import {
  siteAlert,
  heroStats,
  howToSteps,
  rankingItems,
} from "@/lib/data";
import { getLatestArticles } from "@/lib/articles";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.sim-choice.jp/" },
};

export default function Home() {
  const featuredItem = rankingItems[0];
  const articles = getLatestArticles(3);

  return (
    <>
      <Header />
      <AlertBar alert={siteAlert} />
      <main>
        <HeroSection stats={heroStats} featuredItem={featuredItem} />
        <HowToChoose steps={howToSteps} />
        <RankingSection items={rankingItems.slice(0, 3)} />
        <LatestArticles articles={articles} />
      </main>
      <Footer />
      <StickyBottomCTA featuredItem={featuredItem} />
    </>
  );
}
