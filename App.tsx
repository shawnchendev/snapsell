import {
  DefaultTheme,
  NavigationContainer,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FloatingTabBar } from './src/components/FloatingTabBar';
import type {
  ClassicTabParamList,
  FloatingTabParamList,
  RootStackParamList,
} from './src/navigation/types';
import { CreateListingScreen } from './src/screens/CreateListingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ListingDetailsScreen } from './src/screens/ListingDetailsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SavedScreen } from './src/screens/SavedScreen';
import { colors } from './src/theme/colors';

/**
 * Workshop switch:
 * - false => existing tab bar in-app (default)
 * - true  => new floating tab bar from reference screenshot
 */
const USE_FLOATING_TAB_BAR = false;

const RootStack = createNativeStackNavigator<RootStackParamList>();
const ClassicTab = createBottomTabNavigator<ClassicTabParamList>();
const FloatingTab = createBottomTabNavigator<FloatingTabParamList>();

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

const ClassicTabs = () => {
  return (
    <ClassicTab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.classicTabBar,
        tabBarItemStyle: styles.classicTabBarItem,
        tabBarLabelStyle: styles.classicTabBarLabel,
        tabBarActiveTintColor: colors.ui.onPrimary,
        tabBarInactiveTintColor: colors.ui.textPrimary,
        tabBarActiveBackgroundColor: colors.ui.primary,
        tabBarInactiveBackgroundColor: colors.ui.surfaceMuted,
        tabBarIcon: ({ color, size, focused }) => {
          const iconName =
            route.name === 'home'
              ? focused
                ? 'home'
                : 'home-outline'
              : route.name === 'create'
                ? focused
                  ? 'add-circle'
                  : 'add-circle-outline'
                : focused
                  ? 'person'
                  : 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <ClassicTab.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Marketplace',
        }}
      />
      <ClassicTab.Screen
        name="create"
        component={CreateListingScreen}
        options={{
          title: 'Create Listing',
        }}
      />
      <ClassicTab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </ClassicTab.Navigator>
  );
};

const FloatingTabs = () => {
  return (
    <FloatingTab.Navigator
      initialRouteName="home"
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <FloatingTab.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />
      <FloatingTab.Screen
        name="saved"
        component={SavedScreen}
        options={{
          title: 'Saved',
        }}
      />
      <FloatingTab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </FloatingTab.Navigator>
  );
};

const MainTabs = () => {
  return USE_FLOATING_TAB_BAR ? <FloatingTabs /> : <ClassicTabs />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <NavigationContainer theme={navigationTheme}>
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="tabs" component={MainTabs} />
            <RootStack.Screen
              name="listingDetails"
              component={ListingDetailsScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <RootStack.Screen
              name="createListing"
              component={CreateListingScreen}
              options={{
                animation: 'slide_from_bottom',
              }}
            />
          </RootStack.Navigator>
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
  classicTabBar: {
    borderTopColor: colors.ui.border,
    backgroundColor: colors.ui.surface,
    paddingTop: 10,
    paddingBottom: 12,
  },
  classicTabBarItem: {
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  classicTabBarLabel: {
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 6,
  },
});
