import StoreFront from "../../../components/store/StoreFront";
import {
  getFooterData, getHero, getNavLinks, getProducts, getSiteSettings, getTexts,
} from "../../../lib/content";

export default async function TokoPage() {
  const [hero, navLinks, texts, footer, settings, products] = await Promise.all([
    getHero("store"),
    getNavLinks("store"),
    getTexts("store"),
    getFooterData(),
    getSiteSettings(),
    getProducts(),
  ]);

  return (
    <StoreFront
      hero={{ title: hero.title, imageUrl: hero.image.url, imageAlt: hero.image.alt }}
      navLinks={navLinks}
      products={products}
      texts={texts}
      footer={footer}
      fallbackImage={settings.fallbackImage?.url ?? ""}
    />
  );
}