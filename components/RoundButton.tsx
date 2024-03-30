import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

type RoundButtonProps = {
  text: string;
  icon: typeof Ionicons.defaultProps;
  onPress?: () => void;
};
const RoundButton = (props: RoundButtonProps) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.container}>
      <View style={styles.circle}>
        <Ionicons name={props.icon} size={30} color={Colors.dark} />
      </View>
      <Text style={styles.label}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export default RoundButton;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 10,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.dark,
  },
});
