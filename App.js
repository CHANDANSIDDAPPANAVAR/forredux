import React, { useEffect } from 'react';
import './src/services/axiosAuthInterceptor';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { bootstrapAuth } from './src/store/auth/authBootstrap';
import RootNavigator from './src/components/navigation/RootNavigator';
import { store } from './src/store';

/* 🔁 Runs once on app start */
function Bootstrapper({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return children;
}

function App() {
  return (
    <Provider store={store}>
      <Bootstrapper>
        <SafeAreaProvider>
          <StatusBar
            translucent
            backgroundColor="#b40f0fff"
            barStyle="dark-content"
          />

          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </Bootstrapper>
    </Provider>
  );
}

export default App;
