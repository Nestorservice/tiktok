import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/feed/HomeScreen';
import DiscoverScreen from '../screens/discover/DiscoverScreen';
import CameraScreen from '../screens/upload/CameraScreen';
import PostScreen from '../screens/upload/PostScreen';
import InboxScreen from '../screens/inbox/InboxScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import { PlusTabIcon } from './tabBarConfig';
import { colors } from '../theme';

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Camera: undefined;
  Inbox: undefined;
  Profile: { userId?: string } | undefined;
};
export type MainStackParamList = {
  Tabs: undefined;
  Post: { videoUri: string; duration: number };
  EditProfile: undefined;
  UserProfile: { userId: string };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<MainStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar, tabBarActiveTintColor: colors.white, tabBarInactiveTintColor: colors.gray, tabBarShowLabel: false }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="home" size={26} color={color} /> }} />
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="search" size={26} color={color} /> }} />
      <Tab.Screen name="Camera" component={CameraScreen} options={{ tabBarIcon: () => <PlusTabIcon /> }} />
      <Tab.Screen name="Inbox" component={InboxScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={26} color={color} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={26} color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Post" component={PostScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="UserProfile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: { backgroundColor: colors.background, borderTopColor: colors.grayLight, borderTopWidth: StyleSheet.hairlineWidth, height: 56 },
});
