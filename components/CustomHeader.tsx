import React from "react";
import { BlurView } from "expo-blur";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

const CustomHeader = () => {
  const { top } = useSafeAreaInsets();
  return (
    <BlurView intensity={80} tint="extraLight" style={{ paddingTop: top }}>
      <View style={[styles.container]}>
        {/* avatar */}
        <Link href="/(authenticated)/(modals)/account" asChild>
          <TouchableOpacity style={styles.avatar}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: Colors.white,
              }}
            >
              VP
            </Text>
          </TouchableOpacity>
        </Link>
        {/* search */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color={Colors.dark}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor={Colors.dark}
            style={styles.searchInput}
          />
        </View>
        {/* icons */}
        <TouchableOpacity style={styles.circle}>
          <Ionicons name="stats-chart" size={20} color={Colors.dark} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.circle}>
          <Ionicons name="card" size={20} color={Colors.dark} />
        </TouchableOpacity>
      </View>
    </BlurView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "transparent",
    height: 60,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.lightGray,
    borderRadius: 30,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingLeft: 0,
    color: Colors.dark,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
});
