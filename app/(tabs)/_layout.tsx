import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import HomeScreen from "./home";
import ChatScreen from "./chatAI";
import StudyPlanScreen from "./study-plan";
import ProfileScreen from "./profile";
import Exam from "./exam";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#fff",
          height: 70,
          borderRadius: 30,
          margin: 10,
          paddingTop: 10,
          display: route.name === "chat" ? "none" : "flex",
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      })}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          tabBarLabel: "Trang chủ",
        }}
      />
      <Tab.Screen
        name="exam"
        component={Exam}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="pencil" size={size} color={color} />
          ),
          tabBarLabel: "Thi",
        }}
      />
      <Tab.Screen
        name="chat"
        component={ChatScreen}
        options={{
          tabBarButton: ({ onPress }) => (
            <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
              <View style={styles.floatingButtonInner}>
                <Image
                  source={require("../../assets/images/ai.png")}
                  style={styles.AiImage}
                />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="study-plan"
        component={StudyPlanScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" size={size} color={color} />
          ),
          tabBarLabel: "Lộ trình",
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
          tabBarLabel: "Cá nhân",
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    top: -30,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "rgba(208, 238, 250, 0.53)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  AiImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
  },
});
