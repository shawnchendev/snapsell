import type { ItemCondition, MarketplaceItem } from '../types/models';

const locations = [
  "St. John's",
  'Mount Pearl',
  'Paradise',
  'Conception Bay South',
  'Portugal Cove–St. Philip\'s',
  'Torbay',
  'Goulds',
  'Carbonear',
  'Corner Brook',
  'Gander',
  'Grand Falls-Windsor',
  'Clarenville',
  'Happy Valley-Goose Bay',
  'Bay Roberts',
];

const sellerNames = [
  'Megan O\'Brien',
  'Tyler Walsh',
  'Alyssa Pike',
  'Sean Power',
  'Kelsey Hann',
  'Brendan Murphy',
  'Rachel Peddle',
  'Jordan Squires',
  'Brianna Doyle',
  'Trevor Kavanagh',
  'Nora Penney',
  'Liam Bartlett',
  'Olivia Critch',
  'Ethan Tilley',
  'Shannon Coombs',
];

const titleSeeds: Array<{ title: string; category: string; basePrice: number; condition: ItemCondition }> = [
  { title: 'Toro 2-Stage Snowblower', category: 'Outdoor', basePrice: 850, condition: 'Good' },
  { title: 'Fujitsu Heat Pump (Used)', category: 'Home Improvement', basePrice: 1800, condition: 'Excellent' },
  { title: 'Hyundai Elantra Winter Tires', category: 'Automotive', basePrice: 375, condition: 'Good' },
  { title: 'Solid Wood Dining Table', category: 'Furniture', basePrice: 620, condition: 'Excellent' },
  { title: 'Ski-Doo Jacket Men\'s Large', category: 'Clothing', basePrice: 120, condition: 'Like New' },
  { title: 'Mysa Smart Thermostat Pair', category: 'Electronics', basePrice: 140, condition: 'Like New' },
  { title: 'IKEA Hemnes Dresser', category: 'Furniture', basePrice: 210, condition: 'Good' },
  { title: 'Bosch Dishwasher Stainless', category: 'Appliances', basePrice: 450, condition: 'Fair' },
  { title: 'Kona Mountain Bike 27.5"', category: 'Sports', basePrice: 980, condition: 'Excellent' },
  { title: 'Dewalt 20V Drill Kit', category: 'Tools', basePrice: 160, condition: 'Good' },
  { title: 'Wharfedale Bookshelf Speakers', category: 'Electronics', basePrice: 260, condition: 'Excellent' },
  { title: 'PlayStation 5 Disc Edition', category: 'Gaming', basePrice: 620, condition: 'Like New' },
  { title: 'MacBook Air M1 256GB', category: 'Computers', basePrice: 790, condition: 'Excellent' },
  { title: 'Nespresso Vertuo Plus', category: 'Appliances', basePrice: 140, condition: 'Good' },
  { title: 'Samsung 55" 4K TV', category: 'Electronics', basePrice: 500, condition: 'Good' },
  { title: 'Stihl Chainsaw MS 170', category: 'Tools', basePrice: 240, condition: 'Good' },
  { title: 'Patio Set 4-Piece Wicker', category: 'Outdoor', basePrice: 320, condition: 'Fair' },
  { title: 'Canon EOS Rebel T7', category: 'Photography', basePrice: 480, condition: 'Excellent' },
  { title: 'Baby Jogger City Mini Stroller', category: 'Kids', basePrice: 190, condition: 'Good' },
  { title: 'Yamaha Acoustic Guitar', category: 'Music', basePrice: 230, condition: 'Excellent' },
  { title: 'NordicTrack Treadmill', category: 'Fitness', basePrice: 740, condition: 'Good' },
  { title: 'Lobster Trap Style Coffee Table', category: 'Furniture', basePrice: 285, condition: 'Like New' },
  { title: 'Honda EU2200i Generator', category: 'Outdoor', basePrice: 980, condition: 'Excellent' },
  { title: 'KitchenAid Stand Mixer', category: 'Appliances', basePrice: 390, condition: 'Like New' },
  { title: 'GoPro Hero 10 Bundle', category: 'Photography', basePrice: 330, condition: 'Good' },
  { title: 'Apple Watch Series 8', category: 'Electronics', basePrice: 340, condition: 'Excellent' },
  { title: 'Makita Circular Saw', category: 'Tools', basePrice: 130, condition: 'Good' },
  { title: 'Coleman 6-Person Tent', category: 'Outdoor', basePrice: 170, condition: 'Excellent' },
  { title: 'Xbox Series S + Controller', category: 'Gaming', basePrice: 290, condition: 'Like New' },
  { title: 'Samsung Washer + Dryer Set', category: 'Appliances', basePrice: 1200, condition: 'Fair' },
];

const badgePools = ['Fast Pickup', 'Price Drop', 'Popular', 'Negotiable', 'New Listing', 'Top Rated Seller'];

const postedPool = ['Just now', '12m ago', '45m ago', '1h ago', '2h ago', '4h ago', 'Yesterday'];

const descriptionBits = [
  'Clean and in working condition.',
  'Stored indoors and lightly used.',
  'Can meet near Avalon Mall.',
  'No holds without e-transfer deposit.',
  'Pickup available evenings and weekends.',
  'Selling because we upgraded recently.',
  'Great for Newfoundland winter conditions.',
];

const buildDescription = (title: string, location: string): string => {
  return `${title} available in ${location}. ${descriptionBits
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .join(' ')}`;
};

const imageAspectRatioPool = [0.72, 0.8, 0.9, 1, 1.12, 1.28, 0.66, 0.95];

const buildImage = (seed: string, width: number, height: number): string =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

const roundToNearest5 = (value: number): number => {
  return Math.max(20, Math.round(value / 5) * 5);
};

const generateItems = (count: number): MarketplaceItem[] => {
  return Array.from({ length: count }, (_, index) => {
    const seed = titleSeeds[index % titleSeeds.length];
    const location = locations[index % locations.length];
    const sellerName = sellerNames[index % sellerNames.length];
    const locationModifier = index % 7 === 0 ? 'Downtown' : index % 4 === 0 ? 'East End' : 'West End';
    const priceNoise = ((index % 11) - 5) * 9;

    const price = roundToNearest5(seed.basePrice + priceNoise);
    const imageAspectRatio = imageAspectRatioPool[index % imageAspectRatioPool.length];
    const imageWidth = 1080;
    const imageHeight = Math.round(imageWidth / imageAspectRatio);

    return {
      id: `nf-item-${index + 1}`,
      title: seed.title,
      category: seed.category,
      price,
      imageUrl: buildImage(
        `nf-${index + 1}-${seed.title.replace(/\s+/g, '-').toLowerCase()}`,
        imageWidth,
        imageHeight,
      ),
      imageAspectRatio,
      description: buildDescription(seed.title, location),
      location: `${location} (${locationModifier})`,
      sellerName,
      condition: seed.condition,
      views: 90 + (index % 28) * 17,
      saved: 5 + (index % 13) * 3,
      postedAt: postedPool[index % postedPool.length],
      badges: [badgePools[index % badgePools.length], badgePools[(index + 2) % badgePools.length]],
    };
  });
};

export const marketplaceItems: MarketplaceItem[] = generateItems(112);

export const marketplaceCategories: string[] = [
  'All',
  ...Array.from(new Set(marketplaceItems.map((item) => item.category))),
];
