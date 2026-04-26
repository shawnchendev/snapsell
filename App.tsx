import {
  DefaultTheme,
  NavigationContainer,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
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

const SnapSellHeaderTitle = () => {
  return (
    <View style={styles.headerTitleWrap}>
      <Text style={styles.brand}>SnapSell</Text>
      <Text style={styles.subtitle}>St. John's & surrounding areas</Text>
    </View>
  );
};

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer theme={navigationTheme}>
        <Tab.Navigator
          initialRouteName="home"
          screenOptions={{
            headerStyle: styles.header,
            headerShadowVisible: false,
            headerTitle: () => <SnapSellHeaderTitle />,
            headerTitleAlign: 'left',
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
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.ui.surface,
  },
  headerTitleWrap: {
    marginLeft: 2,
  },
  brand: {
    color: colors.ui.primary,
    fontWeight: '900',
    fontSize: 27,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: colors.ui.textSecondary,
    fontSize: 12,
    marginTop: 2,
    marginLeft: 3,
  },
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
    backgroundColor: colors.ui.surface,
    height: 76,
    paddingHorizontal: 8,
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
