export const PRODUCT_IMAGE_BY_SLUG: Record<string, string> = {
  'a2-desi-cow-milk-1l': '/products/branded/a2-desi-cow-milk-1l.png',
  'fresh-paneer-200g': '/products/branded/fresh-paneer-200g.png',
  'farmhouse-cheddar-150g': '/products/branded/farmhouse-cheddar-150g.png',
  'white-butter-250g': '/products/branded/white-butter-250g.png',
  'bilona-ghee-500ml': '/products/branded/bilona-ghee-500ml.png',
  'greek-yogurt-400g': '/products/branded/greek-yogurt-400g.png',
  'mozzarella-cheese-200g': '/products/branded/mozzarella-cheese-200g.png',
  'set-curd-1kg': '/products/branded/set-curd-1kg.png',
  'buffalo-milk-1l': '/products/branded/buffalo-milk-1l.png',
  'toned-cow-milk-1l': '/products/branded/toned-cow-milk-1l.png',
  'lactose-free-milk-1l': '/products/branded/lactose-free-milk-1l.png',
  'malai-paneer-500g': '/products/branded/malai-paneer-500g.png',
  'low-fat-paneer-200g': '/products/branded/low-fat-paneer-200g.png',
  'paneer-cubes-250g': '/products/branded/paneer-cubes-250g.png',
  'cheese-slices-200g': '/products/branded/cheese-slices-200g.png',
  'pizza-mozzarella-500g': '/products/branded/pizza-mozzarella-500g.png',
  'feta-cheese-200g': '/products/branded/feta-cheese-200g.png',
  'salted-butter-500g': '/products/branded/salted-butter-500g.png',
  'unsalted-butter-200g': '/products/branded/unsalted-butter-200g.png',
  'fresh-cream-250ml': '/products/branded/fresh-cream-250ml.png',
  'cow-ghee-1l': '/products/branded/cow-ghee-1l.png',
  'buffalo-ghee-500ml': '/products/branded/buffalo-ghee-500ml.png',
  'probiotic-curd-400g': '/products/branded/probiotic-curd-400g.png',
  'mango-yogurt-100g': '/products/branded/mango-yogurt-100g.png',
  'blueberry-greek-yogurt-150g': '/products/branded/blueberry-greek-yogurt-150g.png',
  'a2-cow-milk-500ml': '/products/branded/a2-cow-milk-500ml.png',
  'smoked-cheddar-200g': '/products/branded/smoked-cheddar-200g.png',
  'mishti-doi-200g': '/products/branded/mishti-doi-200g.png',
};

export const applyBrandedProductImage = <T extends { slug: string; image: string; gallery?: string[] }>(product: T): T => {
  const image = PRODUCT_IMAGE_BY_SLUG[product.slug];
  if (!image) return product;
  return {
    ...product,
    image,
    gallery: [image, ...(product.gallery ?? []).filter((entry) => entry !== image)],
  };
};
