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
import Eopen from '../../profile/parts/identity/Eparts/Eopen';
import Ebuss from '../../profile/parts/identity/Eparts/Ebuss';
import Eproff from '../../profile/parts/identity/Eparts/Eproff';
import Eserv from '../../profile/parts/identity/Eparts/Eserv';
import CreateEventScreen from '../../profile/parts/Eventmaster/screens/CreateEvent';
import EventViewScreen from '../../profile/parts/Eventmaster/screens/EventViewScreen';

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
      <Stack.Screen name="Eopen" component={Eopen} />
      <Stack.Screen name="Ebuss" component={Ebuss} />
      <Stack.Screen name="Eproff" component={Eproff} />
      <Stack.Screen name="Eserv" component={Eserv} />

      <Stack.Screen name="CreateEventScreen" component={CreateEventScreen} />
      <Stack.Screen name="EventViewScreen" component={EventViewScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
