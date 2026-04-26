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
import type { RootStackParamList, RootTabParamList } from './src/navigation/types';
import { CreateListingScreen } from './src/screens/CreateListingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ListingDetailsScreen } from './src/screens/ListingDetailsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { colors } from './src/theme/colors';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

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

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
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
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Marketplace',
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
  );
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
  tabBar: {
    borderTopColor: colors.ui.border,
    backgroundColor: colors.ui.surface,
    paddingBottom: 12,
  },
  tabBarItem: {
    borderRadius: 12,
  },
  tabBarLabel: {
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 6,
  },
});
