import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './home'; 
import TestScreen from './mock-test'; 
import ChatScreen from './chatAI'; 
import StudyPlanScreen from './study-plan'; 
import ProfileScreen from './profile'; 

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
       screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { 
          position: 'absolute', 
          backgroundColor: '#fff', 
          height: 70, 
          borderTopLeftRadius: 30, 
          borderTopRightRadius: 30,
          display: route.name === 'chat' ? 'none' : 'flex', // Hide tab bar only for "chat"
        }
      })}
    >
      <Tab.Screen 
        name="home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          tabBarLabel: 'Trang chủ'
        }} 
      />
      <Tab.Screen 
        name="mock-test" 
        component={TestScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="pencil" size={size} color={color} />
          ),
          tabBarLabel: 'Thi thử'
        }} 
      />
      <Tab.Screen 
        name="chat" 
        component={ChatScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
          tabBarLabel: 'Trợ lý AI',
        }} 
      />
      <Tab.Screen 
        name="study-plan" 
        component={StudyPlanScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" size={size} color={color} />
          ),
          tabBarLabel: 'Lộ trình học'
        }} 
      />
      <Tab.Screen 
        name="profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
          tabBarLabel: 'Hồ sơ'
        }} 
      />
    </Tab.Navigator>
  );
}
