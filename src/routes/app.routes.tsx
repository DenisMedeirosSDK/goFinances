import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components';
import { MaterialIcons } from '@expo/vector-icons';

import { Register } from '../screens/Register';
import { Dashboard } from '../screens/Dashboard';
import { Resume } from '../screens/Resume';

const Tab = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarLabelPosition: 'beside-icon',
        tabBarStyle: {
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
          height: 88,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        options={{
          tabBarLabel: 'Listagem',
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name="format-list-bulleted"
              size={size}
              color={color}
            />
          ),
        }}
        component={Dashboard}
      />
      <Tab.Screen
        name="Register"
        options={{
          tabBarLabel: 'Cadastro',
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="attach-money" size={size} color={color} />
          ),
        }}
        component={Register}
      />
      <Tab.Screen
        name="Resume"
        options={{
          tabBarLabel: 'Resumo',
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="pie-chart" size={size} color={color} />
          ),
        }}
        component={Resume}
      />
    </Tab.Navigator>
  );
}
