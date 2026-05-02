import { Alert, Pressable, StyleSheet, Text as RNText, View as RNView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Text } from '../theme/restyle';
import { colors } from '../theme/colors';
import { USE_RESTYLE_COMPONENTS } from '../workshop/toggles';

export const ProfileScreen = () => {
  const onDeviceToken = () =>
    Alert.alert('Not Implemented', 'Device security token bridge will be added live.');

  if (USE_RESTYLE_COMPONENTS) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Box flex={1} paddingHorizontal="m" paddingTop="l" paddingBottom="xxl">
        <Text color="brandDark" fontWeight="900" fontSize={22}>
          Your Profile
        </Text>
        <Text color="textSecondary" marginTop="xs" marginBottom="m" fontSize={12}>
          Account health and seller insights for SnapSell.
        </Text>

        <Box
          borderRadius="l"
          borderWidth={1}
          borderColor="border"
          backgroundColor="card"
          padding="m"
          gap="m"
        >
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text color="textSecondary" fontSize={13} fontWeight="700">Seller Rating</Text>
            <Text color="brandDark" fontSize={14} fontWeight="900">4.8 ★</Text>
          </Box>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text color="textSecondary" fontSize={13} fontWeight="700">Total Listings</Text>
            <Text color="brandDark" fontSize={14} fontWeight="900">38</Text>
          </Box>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text color="textSecondary" fontSize={13} fontWeight="700">Response Time</Text>
            <Text color="brandDark" fontSize={14} fontWeight="900">~12 mins</Text>
          </Box>
        </Box>

        <Pressable onPress={onDeviceToken}>
          <Box
            marginTop="l"
            backgroundColor="brand"
            borderRadius="m"
            paddingVertical="m"
            alignItems="center"
          >
            <Text color="onPrimary" fontWeight="800" fontSize={13}>
              Get Device Security Token
            </Text>
          </Box>
        </Pressable>

        <Text color="textSecondary" marginTop="s" fontSize={12} lineHeight={18}>
          Workshop note: this action is intentionally left as a placeholder for device API integration.
        </Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <RNView style={styles.container}>
      <RNText style={styles.heading}>Your Profile</RNText>
      <RNText style={styles.subheading}>Account health and seller insights for SnapSell.</RNText>

      <RNView style={styles.card}>
        <RNView style={styles.row}>
          <RNText style={styles.rowLabel}>Seller Rating</RNText>
          <RNText style={styles.rowValue}>4.8 ★</RNText>
        </RNView>
        <RNView style={styles.row}>
          <RNText style={styles.rowLabel}>Total Listings</RNText>
          <RNText style={styles.rowValue}>38</RNText>
        </RNView>
        <RNView style={styles.row}>
          <RNText style={styles.rowLabel}>Response Time</RNText>
          <RNText style={styles.rowValue}>~12 mins</RNText>
        </RNView>
      </RNView>

      <Pressable style={styles.nativeButton} onPress={onDeviceToken}>
        <RNText style={styles.nativeButtonText}>Get Device Security Token</RNText>
      </Pressable>

      <RNText style={styles.hintText}>
        Workshop note: this action is intentionally left as a placeholder for device API integration.
      </RNText>
      </RNView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.ui.canvas,
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 140,
  },
  heading: {
    color: colors.ui.primary,
    fontWeight: '900',
    fontSize: 22,
  },
  subheading: {
    color: colors.ui.textSecondary,
    marginTop: 4,
    marginBottom: 14,
    fontSize: 12,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.ui.border,
    backgroundColor: colors.ui.surface,
    padding: 12,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    fontSize: 13,
    color: colors.ui.textSecondary,
    fontWeight: '700',
  },
  rowValue: {
    fontSize: 14,
    color: colors.ui.primary,
    fontWeight: '900',
  },
  nativeButton: {
    marginTop: 16,
    backgroundColor: colors.ui.secondary,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  nativeButtonText: {
    color: colors.ui.onPrimary,
    fontWeight: '800',
    fontSize: 13,
  },
  hintText: {
    color: colors.ui.textMuted,
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
  },
});
