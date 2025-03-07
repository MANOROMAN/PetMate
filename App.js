import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileCreateScreen from './my-app/app/screens/ProfileCreateScreen';  // Doğru dizin

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProfileCreate">
        <Stack.Screen name="ProfileCreate" component={ProfileCreateScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
