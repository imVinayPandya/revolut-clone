import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

import Dropdown from "@/components/Dropdown";
import RoundButton from "@/components/RoundButton";
import Colors from "@/constants/Colors";

const Page = () => {
  // state
  const [balance, setBalance] = useState(1423);

  const handleSend = () => {
    // set random balance
    setBalance(Math.floor(Math.random() * 10000));
  };

  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance}</Text>
          <Text style={styles.currency}>€</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <RoundButton text="Add" icon={"add"} onPress={handleSend} />
        <RoundButton text="Exchange" icon={"refresh"} />
        <RoundButton text="Details" icon={"list"} />
        <Dropdown />
      </View>
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  account: {
    margin: 80,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 8,
  },
  balance: {
    fontSize: 50,
    fontWeight: "500",
  },
  currency: {
    fontSize: 20,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
});
