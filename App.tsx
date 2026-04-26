import {
  DefaultTheme,
  NavigationContainer,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CreateListingScreen } from './src/screens/CreateListingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { colors } from './src/theme/colors';

type RootTabParamList = {
  home: undefined;
  create: undefined;
  profile: undefined;
};

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
