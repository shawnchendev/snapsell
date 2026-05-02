import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'fullMap'>;

export const FullMapScreen = ({ navigation, route }: Props) => {
  const { title, location, latitude, longitude } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.06,
          longitudeDelta: 0.06,
        }}
      >
        <Circle
          center={{ latitude, longitude }}
          radius={1500}
          fillColor="rgba(102, 143, 128, 0.2)"
          strokeColor="rgba(74, 102, 112, 0.5)"
          strokeWidth={2}
        />
      </MapView>

      <Pressable
        style={[styles.closeButton, { top: insets.top + 10 }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={24} color={colors.ui.textPrimary} />
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: 'absolute',
    left: 14,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.ui.surface,
    borderWidth: 1,
    borderColor: colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.ui.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
});
