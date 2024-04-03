import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { inactivityStorage } from "@/store/mmkv-storage";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const CODE_LENGTH = 6;
const Lock = () => {
  // state
  const [pin, setPin] = useState<number[]>([]);

  // hooks
  const { user } = useUser();
  const router = useRouter();
  const offset = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });
  const OFFSET = 20;
  const TIME = 60;

  // variables and functions
  const pinLength = Array(CODE_LENGTH).fill(0);

  useEffect(() => {
    if (pin.length === CODE_LENGTH) {
      if (pin.join("") === "111111") {
        router.replace("/(authenticated)/(tabs)/home");
        setPin([]);
        return;
      } else {
        offset.value = withSequence(
          withTiming(-OFFSET, { duration: TIME / 2 }),
          withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
          withTiming(0, { duration: TIME / 2 })
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setPin([]);
      }
    }
  }, [pin]);

  const handleKeyPress = (key: number) => {
    if (pin.length < CODE_LENGTH) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPin([...pin, key]);
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      Haptics.selectionAsync();
      setPin(pin.slice(0, -1));
    }
  };

  const handleBioMetricAuth = async () => {
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    console.log("🚀 ~ handleBioMetricAuth ~ isEnrolled:", isEnrolled);

    if (!isEnrolled) {
      return Alert.alert(
        "Biometric record not found",
        "Please verify your identity with your password",
        [{ text: "OK" }]
      );
    }

    const { success } = await LocalAuthentication.authenticateAsync({
      promptMessage: "custom prompt message",
    });
    console.log("🚀 ~ handleBioMetricAuth ~ success:", success);

    if (success) {
      await inactivityStorage.removeInactivity();
      return router.replace("/(authenticated)/(tabs)/home");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <SafeAreaView>
      <Text style={styles.greeting}>Welcome back, {user?.firstName}</Text>
      <Animated.View style={[styles.pinView, style]}>
        {pinLength.map((_, index) => (
          <View
            key={index}
            style={[
              styles.pinInput,
              {
                backgroundColor:
                  pin[index] !== undefined ? Colors.primary : Colors.lightGray,
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* write keypad view here */}
      <View style={styles.keypadView}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {[1, 2, 3].map((number) => (
            <TouchableOpacity
              key={number}
              onPress={() => handleKeyPress(number)}
            >
              <Text style={styles.number}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {[4, 5, 6].map((number) => (
            <TouchableOpacity
              key={number}
              onPress={() => handleKeyPress(number)}
            >
              <Text style={styles.number}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {[7, 8, 9].map((number) => (
            <TouchableOpacity
              key={number}
              onPress={() => handleKeyPress(number)}
            >
              <Text style={styles.number}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={handleBioMetricAuth}
            style={{ padding: 10, minWidth: 50 }}
          >
            <MaterialCommunityIcons
              name="face-recognition"
              size={30}
              color={Colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleKeyPress(0)}>
            <Text style={styles.number}>0</Text>
          </TouchableOpacity>

          <View style={{ minWidth: 50, padding: 10 }}>
            {pin.length > 0 && (
              <TouchableOpacity onPress={handleBackspace}>
                <Ionicons
                  name="backspace-outline"
                  size={30}
                  color={Colors.dark}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <Text
        style={{
          alignSelf: "center",
          color: Colors.primary,
          fontWeight: "500",
          fontSize: 18,
          marginTop: 20,
        }}
      >
        Forgot your passcode?
      </Text>
    </SafeAreaView>
  );
};

export default Lock;

const styles = StyleSheet.create({
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 80,
    alignSelf: "center",
  },
  pinView: {
    flex: 1,
    gap: 20,
    marginVertical: 100,
    flexDirection: "row",
    justifyContent: "center",
  },
  pinInput: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  keypadView: {
    marginHorizontal: 80,
    gap: 10,
  },
  number: {
    fontSize: 32,
    padding: 20,
  },
});
