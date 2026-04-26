import {
  DefaultTheme,
  NavigationContainer,
  getFocusedRouteNameFromRoute,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CreateListingScreen } from './src/screens/CreateListingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ListingDetailsScreen } from './src/screens/ListingDetailsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import type { HomeStackParamList, RootTabParamList } from './src/navigation/types';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const navigationTheme: NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.ui.canvas,
    card: colors.ui.surface,
    text: colors.ui.textPrimary,
    border: colors.ui.border,
    primary: colors.ui.primary,
  },
};

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="homeFeed" component={HomeScreen} />
      <HomeStack.Screen name="listingDetails" component={ListingDetailsScreen} />
    </HomeStack.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <NavigationContainer theme={navigationTheme}>
          <Tab.Navigator
            initialRouteName="home"
            screenOptions={{
              headerShown: false,
              tabBarStyle: styles.tabBar,
              tabBarItemStyle: styles.tabBarItem,
              tabBarLabelStyle: styles.tabBarLabel,
              tabBarActiveTintColor: colors.ui.onPrimary,
              tabBarInactiveTintColor: colors.ui.textPrimary,
              tabBarActiveBackgroundColor: colors.ui.primary,
              tabBarInactiveBackgroundColor: colors.ui.surfaceMuted,
              tabBarIcon: () => null,
            }}
          >
            <Tab.Screen
              name="home"
              component={HomeStackNavigator}
              options={({ route }) => {
                const nestedRoute = getFocusedRouteNameFromRoute(route) ?? 'homeFeed';
                const hideTabBar = nestedRoute === 'listingDetails';

                return {
                  title: 'Marketplace',
                  tabBarStyle: [styles.tabBar, hideTabBar && styles.tabBarHidden],
                };
              }}
            />
            <Tab.Screen
              name="create"
              component={CreateListingScreen}
              options={{
                title: 'Create Listing',
              }}
            />
            <Tab.Screen
              name="profile"
              component={ProfileScreen}
              options={{
                title: 'Profile',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.ui.canvas,
  },
  tabBar: {
    borderTopColor: colors.ui.border,
    backgroundColor: colors.ui.surface,
    paddingTop: 10,
    paddingBottom: 12,
  },
  tabBarHidden: {
    display: 'none',
  },
  tabBarItem: {
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  tabBarLabel: {
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 6,
  },
});
