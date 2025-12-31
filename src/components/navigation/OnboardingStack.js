import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import ChooseAccountType from './parts/accounttype/chooseaccounttype';
import CreateCreatorScreen from './parts/createcreator/CreateCreatorScreen';
import AppStack from './AppStack';

const Stack = createNativeStackNavigator();
const OnboardingStack = () => {
  const { userAccountType, creatorCreated } = useSelector(state => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!userAccountType && (
        <Stack.Screen name="ChooseAccountType" component={ChooseAccountType} />
      )}

      {userAccountType && !creatorCreated && (
        <Stack.Screen name="CreateCreator" component={CreateCreatorScreen} />
      )}

      {userAccountType && creatorCreated && (
        <Stack.Screen name="Appin" component={AppStack} />
      )}
    </Stack.Navigator>
  );
};

export default OnboardingStack;
