import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../../profile/profile';
import Logout from '../../profile/parts/logout/logout';
import Creator from '../../profile/parts/creator';
import Event from '../../profile/parts/event';
import Identity from '../../profile/parts/identity';
import Quick from '../../profile/parts/quckconnect';
import Earn from '../../profile/parts/earn';
import Managsub from '../../profile/parts/mangesub';
import Settings from '../../profile/parts/seetings';
import Support from '../../profile/parts/support';
import Order from '../../profile/parts/order';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MLogout" component={Logout} />
      <Stack.Screen name="Creator" component={Creator} />
      <Stack.Screen name="Eventmaster" component={Event} />
      <Stack.Screen name="Identity" component={Identity} />
      <Stack.Screen name="Earn" component={Earn} />
      <Stack.Screen name="Quick" component={Quick} />
      <Stack.Screen name="Managesub" component={Managsub} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen name="Orders" component={Order} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
