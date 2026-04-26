import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Profile</Text>
      <Text style={styles.subheading}>Account health and seller insights for SnapSell.</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Seller Rating</Text>
          <Text style={styles.rowValue}>4.8 ★</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Total Listings</Text>
          <Text style={styles.rowValue}>38</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Response Time</Text>
          <Text style={styles.rowValue}>~12 mins</Text>
        </View>
      </View>

      <Pressable
        style={styles.nativeButton}
        onPress={() => Alert.alert('Not Implemented', 'Device security token bridge will be added live.')}
      >
        <Text style={styles.nativeButtonText}>Get Device Security Token</Text>
      </Pressable>

      <Text style={styles.hintText}>
        Workshop note: this action is intentionally left as a placeholder for device API integration.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 16,
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
