import { Hero } from '@/components/home/hero';
import { CategorySection } from '@/components/home/category-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { SpecialOffers } from '@/components/home/special-offers';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { FarmStory } from '@/components/home/farm-story';
import { Subscription } from '@/components/home/subscription';
import { Testimonials } from '@/components/home/testimonials';
import { Gallery } from '@/components/home/gallery';
import { Newsletter } from '@/components/home/newsletter';

export function HomePage() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <SpecialOffers />
      <WhyChooseUs />
      <FarmStory />
      <Subscription />
      <Testimonials />
      <Gallery />
      <Newsletter />
    </>
  );
}
