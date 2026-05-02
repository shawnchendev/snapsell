import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { USE_MODERN_LISTING_DETAILS } from '../workshop/toggles';
import { ListingDetailsScreenLegacy } from './ListingDetailsScreenLegacy';
import { ListingDetailsScreenModern } from './ListingDetailsScreenModern';

type Props = NativeStackScreenProps<RootStackParamList, 'listingDetails'>;

export const ListingDetailsScreen = (props: Props) => {
  return USE_MODERN_LISTING_DETAILS ? (
    <ListingDetailsScreenModern {...props} />
  ) : (
    <ListingDetailsScreenLegacy {...props} />
  );
};
