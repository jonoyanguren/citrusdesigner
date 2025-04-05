import { cache } from "react";

export interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  services: string[];
  price?: number;
  priceId?: string;
  interval?: string;
}

export interface ProductsConfig {
  products: Product[];
  common: {
    title: string;
    services: string;
    customPrice: string;
    customPriceDescription: string;
  };
}

export interface StripePricing {
  price: number;
  priceId: string;
}

export const getProductsConfig = cache(
  async (locale: string): Promise<ProductsConfig> => {
    try {
      // Import dinámico basado en el locale
      const config = await import(
        `../../messages/subscriptions/${locale}.json`
      );
      return config as ProductsConfig;
    } catch {
      // Fallback a inglés si no existe el archivo del idioma
      const defaultConfig = await import(
        `../../messages/subscriptions/en.json`
      );
      return defaultConfig as ProductsConfig;
    }
  }
);

// Función para combinar la información de producto con precio de Stripe
export const mergeProductWithPricing = (
  product: Product,
  stripePricing: StripePricing,
  interval = "month"
): Product => {
  return {
    ...product,
    price: stripePricing?.price || 0,
    priceId: stripePricing?.priceId || "custom",
    interval,
  };
};
