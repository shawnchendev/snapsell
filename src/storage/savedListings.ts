import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_LISTINGS_KEY = 'snapsell:saved-listing-ids';

const normalizeIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(new Set(value.filter((id): id is string => typeof id === 'string')));
};

export const getSavedListingIds = async (): Promise<string[]> => {
  try {
    const rawValue = await AsyncStorage.getItem(SAVED_LISTINGS_KEY);

    if (!rawValue) {
      return [];
    }

    return normalizeIds(JSON.parse(rawValue));
  } catch {
    return [];
  }
};

const setSavedListingIds = async (ids: string[]): Promise<void> => {
  await AsyncStorage.setItem(SAVED_LISTINGS_KEY, JSON.stringify(normalizeIds(ids)));
};

export const isListingSaved = async (itemId: string): Promise<boolean> => {
  const ids = await getSavedListingIds();
  return ids.includes(itemId);
};

export const toggleSavedListing = async (itemId: string): Promise<boolean> => {
  const ids = await getSavedListingIds();
  const alreadySaved = ids.includes(itemId);

  const nextIds = alreadySaved ? ids.filter((id) => id !== itemId) : [itemId, ...ids];

  await setSavedListingIds(nextIds);
  return !alreadySaved;
};
