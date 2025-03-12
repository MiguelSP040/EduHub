import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Overlay } from "@rneui/base";

export default function Loading(props) {
  const { title, size, color, isVisible } = props;
  return (
    <Overlay isVisible={isVisible} overlayStyle={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={size} color={color} />
        <Text style={styles.title}>{title}</Text>
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: 350,
    backgroundColor: "white",
  },
  title: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
  },
});
