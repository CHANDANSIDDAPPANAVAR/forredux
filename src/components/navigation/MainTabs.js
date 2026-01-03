// navigation/MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DiscoverStack from './parts/discoverstack';
import BlinkStack from './parts/blinkstack';
import HomeStack from './parts/homestack';
import ConnectsStack from './parts/connectsstack';
import ChatStack from './parts/chatstack';
import BottomNav from '../util/Bitparts/BottomNav';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      backBehavior="none"
      screenOptions={{ headerShown: false }}
      tabBar={props => <BottomNav {...props} />}
    >
      <Tab.Screen name="DiscoverTab" component={DiscoverStack} />
      <Tab.Screen name="BlinkTab" component={BlinkStack} />
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="ConnectsTab" component={ConnectsStack} />
      <Tab.Screen name="ChatTab" component={ChatStack} />
    </Tab.Navigator>
  );
};

export default MainTabs;
