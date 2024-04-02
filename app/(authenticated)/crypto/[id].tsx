import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";
import Animated, {
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";

import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

const categories = [
  "Overview",
  "News",
  "Orders",
  "Transactions",
  "Stats",
  "Settings",
  "More",
];

const INIT_STATE = { x: 0, y: { price: 0 } } as const;

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color={Colors.primary} />;
}
Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const CryptoDetails = () => {
  // state
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  // hooks
  const { id } = useLocalSearchParams();
  const headerHeight = useHeaderHeight();
  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 12);
  const { state, isActive } = useChartPressState(INIT_STATE);

  useEffect(() => {
    if (isActive) Haptics.selectionAsync();
  }, [isActive]);

  const { data } = useQuery({
    queryKey: ["info", id],
    queryFn: async () => {
      const info = await fetch(`/api/info?ids=${id}`).then((res) => res.json());
      return info[+id];
    },
  });

  const { data: tickers } = useQuery({
    queryKey: ["tickers"],
    queryFn: async (): Promise<any[]> =>
      fetch(`/api/tickers`).then((res) => res.json()),
  });

  const animatedText = useAnimatedProps(() => {
    return {
      text: `${state.y.price.value.value.toFixed(2)} €`,
      defaultValue: "",
    };
  });

  const animatedDateText = useAnimatedProps(() => {
    const date = new Date(state.x.value.value);
    return {
      text: `${date.toLocaleDateString()}`,
      defaultValue: "",
    };
  });

  if (!data || !tickers) return null;

  return (
    <>
      <Stack.Screen options={{ title: data.name }} />
      <SectionList
        style={{ marginTop: headerHeight }}
        contentInsetAdjustmentBehavior="automatic"
        sections={[
          {
            title: "Section 1",
            data: [{ title: "Item 1" }],
          },
        ]}
        keyExtractor={(i) => i.title}
        renderSectionHeader={({ section }) => {
          return (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingBottom: 8,
                backgroundColor: Colors.background,
                borderBottomColor: Colors.lightGray,
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            >
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={`${category}-${index}`}
                  style={
                    activeCategoryIndex === index
                      ? styles.categoriesBtnActive
                      : styles.categoriesBtn
                  }
                  onPress={() => setActiveCategoryIndex(index)}
                >
                  <Text
                    style={
                      activeCategoryIndex === index
                        ? styles.categoryTextActive
                        : styles.categoryText
                    }
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          );
        }}
        ListHeaderComponent={() => {
          return (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginHorizontal: 16,
                }}
              >
                <Text style={styles.subtitle}>{data.symbol}</Text>
                <Image
                  source={{ uri: data.logo }}
                  style={{ width: 50, height: 50 }}
                />
              </View>

              <View style={{ flexDirection: "row", gap: 10, margin: 12 }}>
                <TouchableOpacity
                  style={[
                    defaultStyles.pillButtonSmall,
                    {
                      backgroundColor: Colors.primary,
                      flexDirection: "row",
                      gap: 16,
                    },
                  ]}
                  onPress={() => Haptics.impactAsync()}
                >
                  <Ionicons name="add" size={24} color={"#fff"} />
                  <Text style={[defaultStyles.buttonText, { color: "#fff" }]}>
                    Buy
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    defaultStyles.pillButtonSmall,
                    {
                      backgroundColor: Colors.primaryMuted,
                      flexDirection: "row",
                      gap: 16,
                    },
                  ]}
                  onPress={() => Haptics.selectionAsync()}
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color={Colors.primary}
                  />
                  <Text
                    style={[
                      defaultStyles.buttonText,
                      { color: Colors.primary },
                    ]}
                  >
                    Receive
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          );
        }}
        renderItem={({ item }) => {
          return (
            <>
              <View style={[defaultStyles.block, { height: 500 }]}>
                {!isActive && (
                  <View>
                    <Text
                      style={{
                        fontSize: 30,
                        fontWeight: "bold",
                        color: Colors.dark,
                      }}
                    >
                      {tickers[tickers.length - 1].price.toFixed(2)} €
                    </Text>
                    <Text style={{ fontSize: 18, color: Colors.gray }}>
                      Today
                    </Text>
                  </View>
                )}
                {isActive && (
                  <View>
                    <AnimatedTextInput
                      editable={false}
                      underlineColorAndroid={"transparent"}
                      style={{
                        fontSize: 30,
                        fontWeight: "bold",
                        color: Colors.dark,
                      }}
                      animatedProps={animatedText}
                    ></AnimatedTextInput>
                    <AnimatedTextInput
                      editable={false}
                      underlineColorAndroid={"transparent"}
                      style={{ fontSize: 18, color: Colors.gray }}
                      animatedProps={animatedDateText}
                    ></AnimatedTextInput>
                  </View>
                )}
                <CartesianChart
                  data={tickers}
                  chartPressState={state}
                  axisOptions={{
                    font,
                    tickCount: 5,
                    labelOffset: { x: -2, y: 0 },
                    labelColor: Colors.gray,
                    formatYLabel: (value) => `${value} €`,
                    formatXLabel: (label) => {
                      const date = new Date(label);
                      return `${date.getMonth() + 1}/${date.getFullYear()}`;
                    },
                  }}
                  xKey="timestamp"
                  yKeys={["price"]}
                >
                  {({ points }) => (
                    <>
                      <Line
                        points={points.price}
                        color={Colors.primary}
                        strokeWidth={3}
                      />
                      {isActive && (
                        <ToolTip
                          x={state.x.position}
                          y={state.y.price.position}
                        />
                      )}
                    </>
                  )}
                </CartesianChart>
              </View>
              <View style={[defaultStyles.block, { marginTop: 20 }]}>
                <Text style={styles.subtitle}>Overview</Text>
                <Text style={{ color: Colors.gray }}>
                  Bitcoin is a decentralized digital currency, without a central
                  bank or single administrator, that can be sent from user to
                  user on the peer-to-peer bitcoin network without the need for
                  intermediaries. Transactions are verified by network nodes
                  through cryptography and recorded in a public distributed
                  ledger called a blockchain.
                </Text>
              </View>
            </>
          );
        }}
      ></SectionList>
    </>
  );
};

export default CryptoDetails;

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.gray,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.gray,
  },
  categoryTextActive: {
    fontSize: 14,
    color: "#000",
  },
  categoriesBtn: {
    padding: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  categoriesBtnActive: {
    padding: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
  },
});
