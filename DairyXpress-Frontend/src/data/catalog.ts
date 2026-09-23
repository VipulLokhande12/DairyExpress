import { IMAGES } from './images';
import { applyBrandedProductImage, PRODUCT_IMAGE_BY_SLUG } from './product-images';

export type Category = {
  id: number;
  slug: string;
  name: string;
  icon: string; // lucide icon name
  count: number;
  image: string;
  blurb: string;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  gallery: string[];
  rating: number;
  reviews: number;
  stock: number;
  deliveryMins: number;
  organic: boolean;
  badge?: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  nutrition: { label: string; value: string }[];
  unit: string;
};

const productImage = (category: Product['category']) => {
  const byCategory: Record<string, string> = {
    milk: IMAGES.products.milkBottle,
    paneer: IMAGES.products.paneer,
    cheese: IMAGES.products.cheeseBoard,
    butter: IMAGES.products.butter,
    ghee: IMAGES.products.ghee,
    yogurt: IMAGES.products.yogurt,
  };
  return byCategory[category];
};

const catalogProduct = (product: Omit<Product, 'image' | 'gallery' | 'nutrition'>): Product => {
  const image = PRODUCT_IMAGE_BY_SLUG[product.slug] ?? productImage(product.category);
  return {
    ...product,
    image,
    gallery: [image],
    nutrition: [
      { label: 'Energy', value: 'See pack' },
      { label: 'Protein', value: 'See pack' },
      { label: 'Calcium', value: 'Naturally present' },
    ],
  };
};

export const categories: Category[] = [
  { id: 1, slug: 'milk', name: 'Fresh Milk', icon: 'Milk', count: 5, image: IMAGES.products.milk, blurb: 'A2, cow, buffalo & more' },
  { id: 2, slug: 'paneer', name: 'Paneer', icon: 'Cheese', count: 4, image: '/categories/paneer.png', blurb: 'Hand-pressed, soft & fresh' },
  { id: 3, slug: 'cheese', name: 'Cheese', icon: 'Slice', count: 6, image: IMAGES.products.cheeseBoard, blurb: 'Cheddar, mozzarella, feta' },
  { id: 4, slug: 'butter', name: 'Butter & Cream', icon: 'Sandwich', count: 4, image: IMAGES.products.butter, blurb: 'Butter and cultured cream' },
  { id: 5, slug: 'ghee', name: 'Ghee', icon: 'Droplet', count: 3, image: '/categories/ghee.png', blurb: 'Bilona method, golden pure' },
  { id: 6, slug: 'yogurt', name: 'Curd & Yogurt', icon: 'IceCreamCone', count: 6, image: IMAGES.products.yogurt, blurb: 'Greek, set, flavored curd' },
];

const catalogProducts: Product[] = [
  {
    id: 1, slug: 'a2-desi-cow-milk-1l', name: 'A2 Desi Cow Milk', category: 'milk',
    price: 89, oldPrice: 110, image: IMAGES.products.milkBottle,
    gallery: [IMAGES.products.milkBottle, IMAGES.products.milk, IMAGES.hero.milkPour, IMAGES.farm.milking],
    rating: 4.9, reviews: 1284, stock: 42, deliveryMins: 30, organic: true, badge: 'Bestseller',
    description: 'Pure A2 milk from free-grazing Gir cows, untouched and unprocessed. Delivered in reusable glass bottles within hours of milking.',
    ingredients: ['100% A2 cow milk'], benefits: ['A2 beta-casein protein', 'Easier to digest', 'No A1 protein', 'Rich in omega-3'],
    nutrition: [{ label: 'Energy', value: '61 kcal' }, { label: 'Protein', value: '3.4 g' }, { label: 'Fat', value: '3.3 g' }, { label: 'Calcium', value: '120 mg' }, { label: 'Carbs', value: '4.8 g' }],
    unit: '1 L bottle',
  },
  {
    id: 2, slug: 'fresh-paneer-200g', name: 'Fresh Hand-Pressed Paneer', category: 'paneer',
    price: 119, oldPrice: 149, image: IMAGES.products.paneer,
    gallery: [IMAGES.products.paneer, IMAGES.products.cottageCheese, IMAGES.products.curry],
    rating: 4.8, reviews: 942, stock: 28, deliveryMins: 30, organic: true, badge: 'Organic',
    description: 'Soft, creamy paneer pressed by hand from full-cream A2 milk. No preservatives, no starch — just milk and a touch of lemon.',
    ingredients: ['Cow milk', 'Citric acid (lemon)'], benefits: ['18% protein', 'No preservatives', 'Melts in mouth', 'Farm-made daily'],
    nutrition: [{ label: 'Energy', value: '265 kcal' }, { label: 'Protein', value: '18 g' }, { label: 'Fat', value: '20 g' }, { label: 'Calcium', value: '208 mg' }, { label: 'Carbs', value: '1.2 g' }],
    unit: '200 g pack',
  },
  {
    id: 3, slug: 'farmhouse-cheddar-150g', name: 'Aged Farmhouse Cheddar', category: 'cheese',
    price: 249, oldPrice: 299, image: IMAGES.products.cheeseBoard,
    gallery: [IMAGES.products.cheeseBoard, IMAGES.products.cheese, IMAGES.products.salad],
    rating: 4.7, reviews: 514, stock: 15, deliveryMins: 45, organic: false, badge: 'New',
    description: 'Naturally aged 60 days in our cellar. Sharp, nutty and crumbly with a golden rind. Perfect for boards and grating.',
    ingredients: ['Cow milk', 'Rennet', 'Salt', 'Cultures'], benefits: ['Aged 60 days', 'No additives', 'Rich sharp flavor', 'Grate or slice'],
    nutrition: [{ label: 'Energy', value: '402 kcal' }, { label: 'Protein', value: '25 g' }, { label: 'Fat', value: '33 g' }, { label: 'Calcium', value: '721 mg' }, { label: 'Carbs', value: '1.3 g' }],
    unit: '150 g block',
  },
  {
    id: 4, slug: 'white-butter-250g', name: 'Cultured White Butter', category: 'butter',
    price: 159, oldPrice: 189, image: IMAGES.products.butter,
    gallery: [IMAGES.products.butter, IMAGES.products.yogurt],
    rating: 4.6, reviews: 388, stock: 33, deliveryMins: 30, organic: true,
    description: 'Churned from cultured cream for a tangy, aromatic butter. Unsalted and unsalted — the way grandma made it.',
    ingredients: ['Cultured cream'], benefits: ['Naturally cultured', 'No added salt', 'Rich aroma', 'Spreadable'],
    nutrition: [{ label: 'Energy', value: '717 kcal' }, { label: 'Protein', value: '0.9 g' }, { label: 'Fat', value: '81 g' }, { label: 'Calcium', value: '24 mg' }, { label: 'Carbs', value: '0.1 g' }],
    unit: '250 g tub',
  },
  {
    id: 5, slug: 'bilona-ghee-500ml', name: 'Bilona Method Ghee', category: 'ghee',
    price: 649, oldPrice: 799, image: IMAGES.products.ghee,
    gallery: [IMAGES.products.ghee, IMAGES.products.butter, IMAGES.farm.churns],
    rating: 4.9, reviews: 2106, stock: 19, deliveryMins: 30, organic: true, badge: 'Bestseller',
    description: 'Hand-churned bilona ghee from A2 cow milk. Slow-cooked to a golden, grainy texture with a rich aroma.',
    ingredients: ['A2 cow milk butter'], benefits: ['Bilona method', 'No preservatives', 'High smoke point', 'Rich in vitamins A, D, E, K'],
    nutrition: [{ label: 'Energy', value: '900 kcal' }, { label: 'Protein', value: '0 g' }, { label: 'Fat', value: '100 g' }, { label: 'Calcium', value: '1 mg' }, { label: 'Carbs', value: '0 g' }],
    unit: '500 ml jar',
  },
  {
    id: 6, slug: 'greek-yogurt-400g', name: 'Strained Greek Yogurt', category: 'yogurt',
    price: 99, oldPrice: 129, image: IMAGES.products.yogurt,
    gallery: [IMAGES.products.yogurt, IMAGES.products.yogurtBowl],
    rating: 4.7, reviews: 731, stock: 47, deliveryMins: 30, organic: true,
    description: 'Thick, creamy Greek yogurt strained to remove whey. High protein, low sugar, live cultures.',
    ingredients: ['Cow milk', 'Live cultures'], benefits: ['10g protein per serving', 'Live probiotics', 'No added sugar', 'Strained thick'],
    nutrition: [{ label: 'Energy', value: '59 kcal' }, { label: 'Protein', value: '10 g' }, { label: 'Fat', value: '0.4 g' }, { label: 'Calcium', value: '110 mg' }, { label: 'Carbs', value: '3.6 g' }],
    unit: '400 g tub',
  },
  {
    id: 7, slug: 'mozzarella-cheese-200g', name: 'Fresh Mozzarella', category: 'cheese',
    price: 199, oldPrice: 239, image: IMAGES.products.cheese,
    gallery: [IMAGES.products.cheese, IMAGES.products.salad],
    rating: 4.5, reviews: 402, stock: 22, deliveryMins: 45, organic: false,
    description: 'Soft, milky mozzarella balls in brine. Melts beautifully on pizzas and caprese salads.',
    ingredients: ['Cow milk', 'Rennet', 'Salt', 'Cultures'], benefits: ['Fresh in brine', 'Perfect melt', 'Mild milky flavor', 'No starch'],
    nutrition: [{ label: 'Energy', value: '254 kcal' }, { label: 'Protein', value: '18 g' }, { label: 'Fat', value: '20 g' }, { label: 'Calcium', value: '505 mg' }, { label: 'Carbs', value: '2.2 g' }],
    unit: '200 g ball',
  },
  {
    id: 8, slug: 'set-curd-1kg', name: 'Thick Set Curd', category: 'yogurt',
    price: 79, oldPrice: 95, image: IMAGES.products.yogurtBowl,
    gallery: [IMAGES.products.yogurtBowl, IMAGES.products.yogurt],
    rating: 4.6, reviews: 655, stock: 51, deliveryMins: 30, organic: true,
    description: 'Traditional set curd in an earthen pot. Firm, slightly tangy and perfectly set overnight.',
    ingredients: ['Cow milk', 'Starter culture'], benefits: ['Earthen pot set', 'Naturally probiotic', 'Firm texture', 'No additives'],
    nutrition: [{ label: 'Energy', value: '98 kcal' }, { label: 'Protein', value: '4.3 g' }, { label: 'Fat', value: '5 g' }, { label: 'Calcium', value: '150 mg' }, { label: 'Carbs', value: '7 g' }],
    unit: '1 kg pot',
  },
  catalogProduct({ id: 9, slug: 'buffalo-milk-1l', name: 'Fresh Buffalo Milk', category: 'milk', price: 95, oldPrice: 110, rating: 4.7, reviews: 186, stock: 35, deliveryMins: 30, organic: true, badge: 'Popular', description: 'Rich, full-cream buffalo milk delivered fresh from the farm.', ingredients: ['100% buffalo milk'], benefits: ['High calcium', 'Naturally creamy', 'Farm fresh'], unit: '1 L bottle' }),
  catalogProduct({ id: 10, slug: 'toned-cow-milk-1l', name: 'Toned Cow Milk', category: 'milk', price: 62, oldPrice: 70, rating: 4.5, reviews: 142, stock: 50, deliveryMins: 30, organic: false, description: 'Light everyday cow milk with balanced nutrition and reduced fat.', ingredients: ['Toned cow milk'], benefits: ['Everyday nutrition', 'Reduced fat', 'Calcium rich'], unit: '1 L pouch' }),
  catalogProduct({ id: 11, slug: 'lactose-free-milk-1l', name: 'Lactose-Free Milk', category: 'milk', price: 115, oldPrice: 129, rating: 4.6, reviews: 98, stock: 24, deliveryMins: 30, organic: false, badge: 'New', description: 'Smooth dairy milk treated with lactase for easier digestion.', ingredients: ['Cow milk', 'Lactase enzyme'], benefits: ['Lactose free', 'Easy to digest', 'Natural dairy protein'], unit: '1 L carton' }),
  catalogProduct({ id: 12, slug: 'malai-paneer-500g', name: 'Malai Paneer', category: 'paneer', price: 269, oldPrice: 299, rating: 4.8, reviews: 211, stock: 22, deliveryMins: 30, organic: true, badge: 'Bestseller', description: 'Extra-soft malai paneer made daily from rich full-cream milk.', ingredients: ['Full-cream cow milk', 'Citric acid'], benefits: ['Soft texture', 'High protein', 'Made fresh daily'], unit: '500 g pack' }),
  catalogProduct({ id: 13, slug: 'low-fat-paneer-200g', name: 'Low-Fat Paneer', category: 'paneer', price: 129, oldPrice: 149, rating: 4.5, reviews: 84, stock: 31, deliveryMins: 30, organic: false, description: 'Firm, protein-rich paneer made with toned milk for lighter meals.', ingredients: ['Toned cow milk', 'Citric acid'], benefits: ['High protein', 'Reduced fat', 'No preservatives'], unit: '200 g pack' }),
  catalogProduct({ id: 14, slug: 'paneer-cubes-250g', name: 'Ready Paneer Cubes', category: 'paneer', price: 149, oldPrice: 169, rating: 4.6, reviews: 116, stock: 27, deliveryMins: 30, organic: false, badge: 'Convenient', description: 'Fresh, evenly cut paneer cubes ready for curries, grills and snacks.', ingredients: ['Cow milk', 'Citric acid'], benefits: ['Ready to cook', 'Evenly cut', 'High protein'], unit: '250 g pack' }),
  catalogProduct({ id: 15, slug: 'cheese-slices-200g', name: 'Classic Cheese Slices', category: 'cheese', price: 179, oldPrice: 205, rating: 4.4, reviews: 132, stock: 38, deliveryMins: 30, organic: false, description: 'Creamy, individually cut cheese slices for sandwiches and burgers.', ingredients: ['Cow milk', 'Cultures', 'Salt'], benefits: ['Easy melt', 'Convenient slices', 'Calcium rich'], unit: '200 g pack' }),
  catalogProduct({ id: 16, slug: 'pizza-mozzarella-500g', name: 'Pizza Mozzarella', category: 'cheese', price: 349, oldPrice: 399, rating: 4.8, reviews: 267, stock: 20, deliveryMins: 45, organic: false, badge: 'Popular', description: 'Stretchy mozzarella created for an even melt on homemade pizzas.', ingredients: ['Cow milk', 'Rennet', 'Cultures', 'Salt'], benefits: ['Perfect stretch', 'Even melt', 'Mild flavour'], unit: '500 g block' }),
  catalogProduct({ id: 17, slug: 'feta-cheese-200g', name: 'Farmhouse Feta', category: 'cheese', price: 289, oldPrice: 329, rating: 4.5, reviews: 73, stock: 16, deliveryMins: 45, organic: false, badge: 'New', description: 'Tangy, crumbly farmhouse feta for salads, wraps and grain bowls.', ingredients: ['Cow milk', 'Cultures', 'Salt'], benefits: ['Naturally cultured', 'Crumbly texture', 'Bold flavour'], unit: '200 g pack' }),
  catalogProduct({ id: 18, slug: 'salted-butter-500g', name: 'Salted Table Butter', category: 'butter', price: 279, oldPrice: 310, rating: 4.7, reviews: 190, stock: 40, deliveryMins: 30, organic: false, description: 'Creamy salted butter that spreads smoothly on warm toast.', ingredients: ['Cream', 'Salt'], benefits: ['Creamy', 'Spreadable', 'Made from fresh cream'], unit: '500 g pack' }),
  catalogProduct({ id: 19, slug: 'unsalted-butter-200g', name: 'Unsalted Baking Butter', category: 'butter', price: 149, oldPrice: 170, rating: 4.6, reviews: 102, stock: 29, deliveryMins: 30, organic: false, description: 'Pure unsalted dairy butter with reliable results for baking.', ingredients: ['Pasteurised cream'], benefits: ['Baking ready', 'No added salt', 'Clean dairy flavour'], unit: '200 g pack' }),
  catalogProduct({ id: 20, slug: 'fresh-cream-250ml', name: 'Fresh Dairy Cream', category: 'butter', price: 99, oldPrice: 115, rating: 4.5, reviews: 88, stock: 34, deliveryMins: 30, organic: false, description: 'Smooth fresh cream for desserts, soups, sauces and curries.', ingredients: ['Milk cream'], benefits: ['Rich texture', 'Versatile', 'Whips smoothly'], unit: '250 ml pack' }),
  catalogProduct({ id: 21, slug: 'cow-ghee-1l', name: 'Pure Cow Ghee', category: 'ghee', price: 899, oldPrice: 999, rating: 4.9, reviews: 354, stock: 18, deliveryMins: 30, organic: true, badge: 'Bestseller', description: 'Aromatic pure cow ghee, clarified slowly for a rich granular finish.', ingredients: ['Cow milk butter'], benefits: ['Traditional recipe', 'High smoke point', 'Rich aroma'], unit: '1 L jar' }),
  catalogProduct({ id: 22, slug: 'buffalo-ghee-500ml', name: 'Buffalo Milk Ghee', category: 'ghee', price: 599, oldPrice: 675, rating: 4.7, reviews: 123, stock: 21, deliveryMins: 30, organic: true, description: 'Rich, grainy ghee made slowly from creamy buffalo milk butter.', ingredients: ['Buffalo milk butter'], benefits: ['Rich aroma', 'Granular texture', 'High smoke point'], unit: '500 ml jar' }),
  catalogProduct({ id: 23, slug: 'probiotic-curd-400g', name: 'Probiotic Curd', category: 'yogurt', price: 69, oldPrice: 79, rating: 4.6, reviews: 175, stock: 45, deliveryMins: 30, organic: false, badge: 'Healthy', description: 'Creamy set curd with active probiotic cultures for everyday meals.', ingredients: ['Cow milk', 'Active cultures'], benefits: ['Active probiotics', 'Smooth texture', 'No artificial flavour'], unit: '400 g cup' }),
  catalogProduct({ id: 24, slug: 'mango-yogurt-100g', name: 'Mango Yogurt', category: 'yogurt', price: 45, oldPrice: 55, rating: 4.5, reviews: 91, stock: 52, deliveryMins: 30, organic: false, description: 'Creamy yogurt blended with sweet, real mango fruit.', ingredients: ['Cow milk', 'Mango pulp', 'Cultures'], benefits: ['Real fruit', 'Live cultures', 'Lunchbox friendly'], unit: '100 g cup' }),
  catalogProduct({ id: 25, slug: 'blueberry-greek-yogurt-150g', name: 'Blueberry Greek Yogurt', category: 'yogurt', price: 79, oldPrice: 89, rating: 4.7, reviews: 128, stock: 37, deliveryMins: 30, organic: false, badge: 'New', description: 'Thick high-protein Greek yogurt folded with blueberry fruit.', ingredients: ['Cow milk', 'Blueberries', 'Cultures'], benefits: ['High protein', 'Real fruit', 'Thick and creamy'], unit: '150 g cup' }),
  catalogProduct({ id: 26, slug: 'a2-cow-milk-500ml', name: 'A2 Cow Milk Mini', category: 'milk', price: 49, oldPrice: 55, rating: 4.7, reviews: 76, stock: 58, deliveryMins: 30, organic: true, badge: 'New', description: 'A convenient half-litre bottle of fresh A2 cow milk.', ingredients: ['100% A2 cow milk'], benefits: ['A2 protein', 'Convenient size', 'Farm fresh'], unit: '500 ml bottle' }),
  catalogProduct({ id: 27, slug: 'smoked-cheddar-200g', name: 'Smoked Cheddar', category: 'cheese', price: 329, oldPrice: 369, rating: 4.8, reviews: 64, stock: 14, deliveryMins: 45, organic: false, badge: 'Artisan', description: 'Mature cheddar gently smoked for a deep, savoury finish.', ingredients: ['Cow milk', 'Rennet', 'Cultures', 'Salt'], benefits: ['Naturally smoked', 'Aged flavour', 'Excellent for cheese boards'], unit: '200 g block' }),
  catalogProduct({ id: 28, slug: 'mishti-doi-200g', name: 'Traditional Mishti Doi', category: 'yogurt', price: 75, oldPrice: 85, rating: 4.8, reviews: 109, stock: 32, deliveryMins: 30, organic: false, badge: 'Traditional', description: 'Slow-set Bengali sweet yogurt with a delicate caramel note.', ingredients: ['Cow milk', 'Cane sugar', 'Cultures'], benefits: ['Traditional recipe', 'Slow set', 'No artificial colour'], unit: '200 g clay cup' }),
];

export const products: Product[] = catalogProducts.map(applyBrandedProductImage);

export const testimonials = [
  { id: 't1', name: 'Ananya Sharma', role: 'Verified Customer', photo: IMAGES.people.c1, rating: 5, text: 'The A2 milk tastes exactly like what we had at my grandmother\'s farm. Glass bottle delivery is such a premium touch — I\'ll never go back to supermarket milk.' },
  { id: 't2', name: 'Rohan Mehta', role: 'Subscriber, 8 months', photo: IMAGES.people.c2, rating: 5, text: 'I subscribed to the weekly milk plan and it has genuinely changed mornings for my family. Always on time, always fresh, always cold.' },
  { id: 't3', name: 'Priya Nair', role: 'Verified Customer', photo: IMAGES.people.c3, rating: 4, text: 'The bilona ghee is unreal — the aroma fills the whole kitchen. A little pricey but you can taste the quality. Worth every rupee.' },
  { id: 't4', name: 'Karthik Reddy', role: 'Verified Customer', photo: IMAGES.people.c5, rating: 5, text: 'Paneer so soft it melts in your mouth. 30-minute delivery is not a marketing gimmick — it actually arrives that fast.' },
  { id: 't5', name: 'Meera Iyer', role: 'Subscriber, 1 year', photo: IMAGES.people.c4, rating: 5, text: 'I love that I can track the farm my milk comes from. The transparency and the farm story section made me trust them instantly.' },
  { id: 't6', name: 'Aditya Verma', role: 'Verified Customer', photo: IMAGES.people.c6, rating: 5, text: 'The app itself feels premium — smooth, fast and beautiful. But it\'s the product quality that keeps me ordering every week.' },
];

export const farmStory = [
  { id: 's1', step: '01', title: 'Dawn Milking', image: IMAGES.farm.milking, text: 'Our cows are milked at sunrise on free-grazing farms, stress-free and hormone-free.' },
  { id: 's2', step: '02', title: 'Milk Collection', image: IMAGES.farm.milkCans, text: 'Milk is collected in chilled steel cans within minutes to lock in freshness.' },
  { id: 's3', step: '03', title: 'Gentle Processing', image: IMAGES.farm.churns, text: 'Minimal processing — pasteurised at low temperature to keep nutrients intact.' },
  { id: 's4', step: '04', title: 'Eco Packaging', image: IMAGES.products.milkBottle, text: 'Bottled in reusable glass and recycled paper. Zero plastic, zero waste.' },
  { id: 's5', step: '05', title: 'Doorstep Delivery', image: IMAGES.farm.cow, text: 'Delivered to your door in 30 minutes, cold-chain intact from farm to home.' },
];

export const galleryImages = [
  { id: 'g1', src: IMAGES.farm.cow, label: 'Free-grazing farms', span: 'tall' },
  { id: 'g2', src: IMAGES.products.milkBottle, label: 'Glass bottle milk', span: 'normal' },
  { id: 'g3', src: IMAGES.farm.milking, label: 'Dawn milking', span: 'normal' },
  { id: 'g4', src: IMAGES.products.cheeseBoard, label: 'Aged cheese', span: 'wide' },
  { id: 'g5', src: IMAGES.products.yogurt, label: 'Fresh yogurt', span: 'normal' },
  { id: 'g6', src: IMAGES.farm.churns, label: 'Traditional churning', span: 'tall' },
  { id: 'g7', src: IMAGES.products.paneer, label: 'Hand-pressed paneer', span: 'normal' },
  { id: 'g8', src: IMAGES.farm.calf, label: 'Happy calves', span: 'wide' },
];

export const subscriptionPlans = [
  { id: 'daily', name: 'Daily', price: 89, perDay: 89, period: 'per day', popular: false, savings: '10%', benefits: ['1L A2 milk every morning', 'Skip or pause anytime', 'Free glass bottle', 'Priority delivery slot'] },
  { id: 'weekly', name: 'Weekly', price: 549, perDay: 78, period: 'per week', popular: true, savings: '15%', benefits: ['7L A2 milk, your schedule', 'Mix milk + paneer + curd', 'Free glass bottles', 'Dedicated delivery agent', 'Pause anytime'] },
  { id: 'monthly', name: 'Monthly', price: 2199, perDay: 73, period: 'per month', popular: false, savings: '20%', benefits: ['30L milk, fully flexible', 'Add ghee, butter, cheese', 'Free farm visit for family', 'Loyalty rewards 2x', 'Priority support'] },
];
