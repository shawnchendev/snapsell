/**
 * Approximate coordinates for Newfoundland & Labrador locations.
 * Used to show estimated item location on the listing details map.
 */

interface Coordinate {
  latitude: number;
  longitude: number;
}

const locationCoordinates: Record<string, Coordinate> = {
  "St. John's": { latitude: 47.5615, longitude: -52.7126 },
  'Mount Pearl': { latitude: 47.5189, longitude: -52.8058 },
  'Paradise': { latitude: 47.533, longitude: -52.8697 },
  'Conception Bay South': { latitude: 47.5168, longitude: -52.9878 },
  "Portugal Cove–St. Philip's": { latitude: 47.6271, longitude: -52.8535 },
  'Torbay': { latitude: 47.6637, longitude: -52.7314 },
  'Goulds': { latitude: 47.4563, longitude: -52.7762 },
  'Carbonear': { latitude: 47.7333, longitude: -53.2261 },
  'Corner Brook': { latitude: 48.9510, longitude: -57.9526 },
  'Gander': { latitude: 48.9569, longitude: -54.6089 },
  'Grand Falls-Windsor': { latitude: 48.9346, longitude: -55.6631 },
  'Clarenville': { latitude: 48.1747, longitude: -53.9690 },
  'Happy Valley-Goose Bay': { latitude: 53.3017, longitude: -60.3261 },
  'Bay Roberts': { latitude: 47.5983, longitude: -53.2644 },
};

// Small random offset so pins don't land on exact city center
const jitter = (): number => (Math.random() - 0.5) * 0.02;

/**
 * Returns approximate coordinates for a location string like "St. John's (East End)".
 * Strips the parenthetical modifier and looks up the base city name.
 */
export const getLocationCoordinates = (locationString: string): Coordinate | null => {
  // Strip "(Downtown)", "(East End)", "(West End)" etc.
  const baseName = locationString.replace(/\s*\(.*\)\s*$/, '').trim();

  const coords = locationCoordinates[baseName];
  if (!coords) {
    return null;
  }

  return {
    latitude: coords.latitude + jitter(),
    longitude: coords.longitude + jitter(),
  };
};
