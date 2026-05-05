import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { CreateListingStackParamList } from '../navigation/types';
import { CameraScreen } from './CameraScreen';
import { ReviewListingScreen } from './ReviewListingScreen';

const Stack = createNativeStackNavigator<CreateListingStackParamList>();

export const CreateListingScreenModern = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="camera" component={CameraScreen} />
      <Stack.Screen
        name="review"
        component={ReviewListingScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};
