import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Open from '../components/screens/Genral';
import Proff from '../components/screens/Proff';
import Buss from '../components/screens/Buss';
import Service from '../components/screens/Serveice';
import Event from '../components/screens/Event';

const Stack = createNativeStackNavigator();

function Connectsnav() {
  return (
    <Stack.Navigator
      initialRouteName="Genral"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Genral" component={Open} />
      <Stack.Screen name="Proff" component={Proff} />
      <Stack.Screen name="Buss" component={Buss} />
      <Stack.Screen name="Service" component={Service} />
      <Stack.Screen name="Events" component={Event} />
    </Stack.Navigator>
  );
}

export default Connectsnav;
