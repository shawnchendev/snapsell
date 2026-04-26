import { ThemeProvider } from '@shopify/restyle';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ListingErrorBoundary } from './src/components/ListingErrorBoundary';
import { CreateListingScreen } from './src/screens/CreateListingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import type { AppTab } from './src/types/models';
import { theme } from './src/theme/theme';

const tabs: Array<{ label: string; value: AppTab }> = [
  { label: 'Marketplace', value: 'home' },
  { label: 'Create Listing', value: 'create' },
  { label: 'Profile', value: 'profile' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [createFlowKey, setCreateFlowKey] = useState<number>(0);

  const activeScreen = useMemo(() => {
    if (activeTab === 'home') {
      return <HomeScreen />;
    }

    if (activeTab === 'create') {
      return (
        <ListingErrorBoundary onTryAgain={() => setCreateFlowKey((current) => current + 1)}>
          <CreateListingScreen key={createFlowKey} />
        </ListingErrorBoundary>
      );
    }

    return <ProfileScreen />;
  }, [activeTab, createFlowKey]);

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />

        <View style={styles.topBar}>
          <Text style={styles.brand}>SnapSell</Text>
          <Text style={styles.subtitle}>St. John's & surrounding areas</Text>
        </View>

        <View style={styles.screenContainer}>{activeScreen}</View>

        <View style={styles.tabContainer}>
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab;

            return (
              <Pressable
                key={tab.value}
                onPress={() => setActiveTab(tab.value)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
              >
                <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F4F8',
    paddingTop: 10,
  },
  topBar: {
    paddingHorizontal: 17,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DDE2EB',
    backgroundColor: '#FFFFFF',
  },
  brand: {
    color: '#0052CC',
    fontWeight: '900',
    fontSize: 27,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: '#6B778C',
    fontSize: 12,
    marginTop: 2,
    marginLeft: 3,
  },
  screenContainer: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#DDE2EB',
    paddingHorizontal: 8,
    paddingBottom: 12,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C1C7D0',
    paddingVertical: 11,
    paddingHorizontal: 6,
    backgroundColor: '#F7F9FC',
  },
  tabButtonActive: {
    backgroundColor: '#0052CC',
    borderColor: '#0052CC',
  },
  tabButtonText: {
    color: '#172B4D',
    fontWeight: '700',
    fontSize: 12,
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
});
