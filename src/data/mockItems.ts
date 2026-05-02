import type { ItemCondition, MarketplaceItem } from '../types/models';

import { LISTING_COUNT } from '../workshop/toggles';

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

/**
 * Unsplash photo IDs mapped to each item for relevant imagery.
 * Format: 'photo-{id}' portion from unsplash.com/photos/{id}
 */
const titleSeeds: Array<{ title: string; category: string; basePrice: number; condition: ItemCondition; imageId: string }> = [
  { title: 'Toro 2-Stage Snowblower', category: 'Outdoor', basePrice: 850, condition: 'Good', imageId: '1516714435131-44d6b64dc6a2' },
  { title: 'Fujitsu Heat Pump (Used)', category: 'Home Improvement', basePrice: 1800, condition: 'Excellent', imageId: '1585771724684-38269d6639fd' },
  { title: 'Hyundai Elantra Winter Tires', category: 'Automotive', basePrice: 375, condition: 'Good', imageId: '1580273916550-e323be2ae537' },
  { title: 'Solid Wood Dining Table', category: 'Furniture', basePrice: 620, condition: 'Excellent', imageId: '1555041469-a586c61ea9bc' },
  { title: 'Ski-Doo Jacket Men\'s Large', category: 'Clothing', basePrice: 120, condition: 'Like New', imageId: '1551028719-00167b16eac5' },
  { title: 'Mysa Smart Thermostat Pair', category: 'Electronics', basePrice: 140, condition: 'Like New', imageId: '1558002038-1055907df827' },
  { title: 'IKEA Hemnes Dresser', category: 'Furniture', basePrice: 210, condition: 'Good', imageId: '1558997519-83ea9252edf8' },
  { title: 'Bosch Dishwasher Stainless', category: 'Appliances', basePrice: 450, condition: 'Fair', imageId: '1584568694244-14fbdf83bd30' },
  { title: 'Kona Mountain Bike 27.5"', category: 'Sports', basePrice: 980, condition: 'Excellent', imageId: '1576435728678-68d0fbf94e91' },
  { title: 'Dewalt 20V Drill Kit', category: 'Tools', basePrice: 160, condition: 'Good', imageId: '1504148455328-c376907d081c' },
  { title: 'Wharfedale Bookshelf Speakers', category: 'Electronics', basePrice: 260, condition: 'Excellent', imageId: '1558537348-c0f8e733989d' },
  { title: 'PlayStation 5 Disc Edition', category: 'Gaming', basePrice: 620, condition: 'Like New', imageId: '1606144042614-b2417e99c4e3' },
  { title: 'MacBook Air M1 256GB', category: 'Computers', basePrice: 790, condition: 'Excellent', imageId: '1517336714731-489689fd1ca8' },
  { title: 'Nespresso Vertuo Plus', category: 'Appliances', basePrice: 140, condition: 'Good', imageId: '1570968915860-54d5c301fa9f' },
  { title: 'Samsung 55" 4K TV', category: 'Electronics', basePrice: 500, condition: 'Good', imageId: '1593784991095-a205069470b6' },
  { title: 'Stihl Chainsaw MS 170', category: 'Tools', basePrice: 240, condition: 'Good', imageId: '1570129477492-45c003edd2be' },
  { title: 'Patio Set 4-Piece Wicker', category: 'Outdoor', basePrice: 320, condition: 'Fair', imageId: '1600585154340-be6161a56a0c' },
  { title: 'Canon EOS Rebel T7', category: 'Photography', basePrice: 480, condition: 'Excellent', imageId: '1516035069371-29a1b244cc32' },
  { title: 'Baby Jogger City Mini Stroller', category: 'Kids', basePrice: 190, condition: 'Good', imageId: '1591088398332-8a7791972843' },
  { title: 'Yamaha Acoustic Guitar', category: 'Music', basePrice: 230, condition: 'Excellent', imageId: '1510915361894-db8b60106cb1' },
  { title: 'NordicTrack Treadmill', category: 'Fitness', basePrice: 740, condition: 'Good', imageId: '1576678927484-cc907957088c' },
  { title: 'Lobster Trap Style Coffee Table', category: 'Furniture', basePrice: 285, condition: 'Like New', imageId: '1532372576444-dda954194ad0' },
  { title: 'Honda EU2200i Generator', category: 'Outdoor', basePrice: 980, condition: 'Excellent', imageId: '1611270629569-8b357cb88da9' },
  { title: 'KitchenAid Stand Mixer', category: 'Appliances', basePrice: 390, condition: 'Like New', imageId: '1594631252845-29fc4cc8cde9' },
  { title: 'GoPro Hero 10 Bundle', category: 'Photography', basePrice: 330, condition: 'Good', imageId: '1564466809058-bf4114d55352' },
  { title: 'Apple Watch Series 8', category: 'Electronics', basePrice: 340, condition: 'Excellent', imageId: '1579586337278-3befd40fd17a' },
  { title: 'Makita Circular Saw', category: 'Tools', basePrice: 130, condition: 'Good', imageId: '1572981779307-38b8cabb2407' },
  { title: 'Coleman 6-Person Tent', category: 'Outdoor', basePrice: 170, condition: 'Excellent', imageId: '1504280390367-361c6d9f38f4' },
  { title: 'Xbox Series S + Controller', category: 'Gaming', basePrice: 290, condition: 'Like New', imageId: '1621259182978-fbf93132d53d' },
  { title: 'Samsung Washer + Dryer Set', category: 'Appliances', basePrice: 1200, condition: 'Fair', imageId: '1626806787461-102c1bfaaea1' },
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

const buildImage = (imageId: string, width: number, height: number): string =>
  `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;

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
        seed.imageId,
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

export const marketplaceItems: MarketplaceItem[] = generateItems(LISTING_COUNT);

export const marketplaceCategories: string[] = [
  'All',
  ...Array.from(new Set(marketplaceItems.map((item) => item.category))),
];
