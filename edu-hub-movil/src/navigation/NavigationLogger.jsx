import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from "@rneui/base";
import Profile from "../modules/home/screens/Profile";
import Home from "../modules/home/screens/Home";
import Courses from "../modules/home/screens/Courses";
import Alerts from "../modules/home/screens/Alerts";
import Certificates from "../modules/home/screens/Certificates";

const Tab = createBottomTabNavigator();

export default function NavigationLogger({ setIsLoggedIn }) {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const { iconName, iconType } = getIconName(route.name, focused);
          return (
            <Icon name={iconName} type={iconType} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#180A2E",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}>
        <Tab.Screen name="Home" component={Home} options={{ title: 'Inicio' }} />
        <Tab.Screen name="Courses" component={Courses} options={{ title: 'Cursos' }} />
        {/* Pasa setIsLoggedIn a Profile */}
        <Tab.Screen name="Profile">
          {(props) => <Profile {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Tab.Screen>
        <Tab.Screen name="Alerts" component={Alerts} options={{ title: 'Alertas' }} />
        <Tab.Screen name="Certificates" component={Certificates} options={{ title: 'Certificados' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const getIconName = (routeName, focused) => {
  let iconName = "";
  const iconType = "material-community";

  switch (routeName) {
    case "Profile":
      iconName = focused ? "account" : "account-outline";
      break;
    case "Home":
      iconName = focused ? "home" : "home-outline";
      break;
    case "Courses":
      iconName = focused ? "book-open" : "book-open-outline";
      break;
    case "Alerts":
      iconName = focused ? "bell" : "bell-outline";
      break;
    case "Certificates":
      iconName = focused ? "certificate" : "certificate-outline";
      break;
  }

  return { iconName, iconType };
};