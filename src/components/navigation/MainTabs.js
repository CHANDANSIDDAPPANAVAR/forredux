// navigation/MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import BottomNav from '../util/Bitparts/BottomNav';
import HomeMain from '../Home/HomeMain';
import ConnectsHome from '../Connects/connects';
import Blink from '../Blink/blink';
import Discover from '../Discover/discover';
import Chat from '../Chat/chat';
import Header from '../Home/parts/Heder';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      backBehavior="none"
      screenOptions={{
        header: () => <Header />, // ✅ SAME header for all tabs
      }}
      tabBar={props => <BottomNav {...props} />}
    >
      <Tab.Screen name="DiscoverTab" component={Discover} />
      <Tab.Screen
        name="BlinkTab"
        component={Blink}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="HomeTab" component={HomeMain} />
      <Tab.Screen name="ConnectsTab" component={ConnectsHome} />
      <Tab.Screen name="ChatTab" component={Chat} />
    </Tab.Navigator>
  );
};

export default MainTabs;
