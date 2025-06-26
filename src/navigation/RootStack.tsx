import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TeamList from '@/screens/TeamList';
import TeamDetails from '@/screens/TeamDetails';
import { RootStackParamList } from '@/types/navigation.ts';

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Teams" component={TeamList} />
    <Stack.Screen name="TeamDetails" component={TeamDetails} />
  </Stack.Navigator>
);

export default RootStack;
