import { Suspense } from "react";
import HeroHome from "@/components/HeroHome";
import FeaturedListings from "@/components/HomeFeaturedListings";
import HomeOptions from "@/components/HomeOptions";
import HomePopularAreas from "@/components/HomePopularAreas";
import HomeSteps from "@/components/HomeSteps";
import HomeTestimonials from "@/components/HomeTestimonials";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  return (
    <main className="flex flex-col gap-3">
      <Suspense fallback={<LoadingSpinner/>}>
        <HeroHome />
      </Suspense>
      <HomeOptions />
      <HomePopularAreas />
      <HomeSteps />
      <FeaturedListings />
      <HomeTestimonials />
    </main>
  );
}