export type RootStackParamList = {
  tabs: undefined;
  listingDetails: {
    itemId: string;
  };
  createListing: undefined;
  fullMap: {
    title: string;
    location: string;
    latitude: number;
    longitude: number;
  };
};

export type ClassicTabParamList = {
  home: undefined;
  create: undefined;
  profile: undefined;
};

export type FloatingTabParamList = {
  home: undefined;
  saved: undefined;
  profile: undefined;
};
