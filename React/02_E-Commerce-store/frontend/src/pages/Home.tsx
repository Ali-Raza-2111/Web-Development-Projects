import { HeroSection, FeaturedProducts, CategoryShowcase, Newsletter, Testimonials, BrandMarquee, FeatureShowcase } from '../components/home';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BrandMarquee />
      <FeaturedProducts />
      <FeatureShowcase />
      <CategoryShowcase />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
