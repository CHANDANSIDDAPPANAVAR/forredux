import React, { useLayoutEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import HomeMain from '../../Home/HomeMain';
import Header from '../../Home/parts/Heder';
import WebViewScreen from '../../Home/parts/webview/WebViewScreen';
import QRScanner from '../../Home/parts/qr-scan/QRScanner';

const Stack = createNativeStackNavigator();

const HomeStack = ({ navigation, route }) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeMain';

    // 🔥 Hide tab bar for these screens
    const hideTabBarScreens = ['QRScanner', 'WebViewScreen'];

    if (hideTabBarScreens.includes(routeName)) {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
    } else {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'flex' },
      });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeMain}
        options={{
          header: () => <Header />,
        }}
      />

      {/* 🔍 QR Scanner — Full screen */}
      <Stack.Screen
        name="QRScanner"
        component={QRScanner}
        options={{ headerShown: false }}
      />

      {/* 🌐 WebView — Full screen */}
      <Stack.Screen
        name="WebViewScreen"
        component={WebViewScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
