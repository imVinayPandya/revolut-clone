import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

import Dropdown from "@/components/Dropdown";
import RoundButton from "@/components/RoundButton";
import Colors from "@/constants/Colors";
import { useBalanceStore } from "@/store/balanceStore";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import WidgetList from "@/components/SortableList/WidgetList";

const Page = () => {
  // hooks
  const { balance, clearTransactions, runTransaction, transactions } =
    useBalanceStore();

  const handleAddOnPress = () => {
    const amount =
      Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1);
    const transactionType = amount > 0 ? "Added money" : "Spent money";

    runTransaction({
      id: Math.random().toString(),
      amount: amount,
      date: new Date(),
      title: transactionType,
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: Colors.background }}
    >
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance()}</Text>
          <Text style={styles.currency}>€</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <RoundButton text="Add" icon={"add"} onPress={handleAddOnPress} />
        <RoundButton
          text="Exchange"
          icon={"refresh"}
          onPress={clearTransactions}
        />
        <RoundButton text="Details" icon={"list"} />
        <Dropdown />
      </View>

      <Text style={defaultStyles.sectionHeader}>Transactions</Text>
      <View style={styles.transactions}>
        {transactions.length === 0 && (
          <Text
            style={{
              padding: 14,
              color: Colors.gray,
            }}
          >
            No transaction yet
          </Text>
        )}

        {/* Show only recent 5 transactions */}
        {transactions.slice(0, 5).map((transaction) => (
          <View
            key={transaction.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* add round circle with icons from ionicons, if transaction amount is positive us plus icon and if it negative use minus icon */}
            <View style={styles.circle}>
              <Ionicons
                name={transaction.amount > 0 ? "add" : "remove"}
                size={24}
                color={Colors.dark}
              />
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: "400",
                }}
              >
                {transaction.title}
              </Text>
              <Text style={{ color: Colors.gray, fontSize: 12 }}>
                {new Date(transaction.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}{" "}
                {new Date(transaction.date).toLocaleTimeString(undefined, {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>

            <Text>{transaction.amount}€</Text>
          </View>
        ))}
      </View>
      <Text style={defaultStyles.sectionHeader}>Widgets</Text>
      <WidgetList />
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
  transactions: {
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 16,
    gap: 20,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
});
