import CartView from "../../../components/store/CartView";
import { getSiteSettings, getTexts } from "../../../lib/content";

export default async function CartPage() {
  const [texts, settings] = await Promise.all([getTexts("store", "cart"), getSiteSettings()]);

  return <CartView texts={texts} fallbackImage={settings.fallbackImage?.url ?? ""} />;
}