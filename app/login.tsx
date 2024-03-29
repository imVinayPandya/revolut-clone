import React, { useState } from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacityBase,
} from "react-native";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";

enum SignInType {
  Phone,
  Email,
  Google,
  Apple,
}

export default function Signup() {
  // state
  const [countryCode, setCountryCode] = useState("+49");
  const [mobileNumber, setMobileNumber] = useState("");

  // variables
  const keyboardVerticalOffset = Platform.OS === "ios" ? 70 : 0;
  const handleLogin = (type: SignInType) => {
    if (type === SignInType.Phone) {
      console.log("Phone");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome back!</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number associated with your account
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Country Code"
            placeholderTextColor={Colors.gray}
            value={countryCode}
            onChangeText={setCountryCode}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Mobile input"
            keyboardType="numeric"
            placeholderTextColor={Colors.gray}
            value={mobileNumber}
            onChangeText={setMobileNumber}
          />
        </View>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            mobileNumber ? styles.enableButton : styles.disableButton,
            { marginBottom: 15 },
          ]}
          onPress={() => handleLogin(SignInType.Phone)}
        >
          <Text style={defaultStyles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />
          <Text
            style={{
              color: Colors.gray,
              fontSize: 16,
            }}
          >
            or
          </Text>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />
        </View>

        {/* Email */}
        <TouchableOpacity
          onPress={() => handleLogin(SignInType.Email)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              marginTop: 20,
              backgroundColor: Colors.white,
            },
          ]}
        >
          <Ionicons name="mail" size={24} color={Colors.dark} />
          <Text style={[defaultStyles.buttonText, { color: Colors.dark }]}>
            Continue with Email
          </Text>
        </TouchableOpacity>

        {/* Google */}
        <TouchableOpacity
          onPress={() => handleLogin(SignInType.Google)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              marginTop: 20,
              backgroundColor: Colors.white,
            },
          ]}
        >
          <Ionicons name="logo-google" size={24} color={Colors.dark} />
          <Text style={[defaultStyles.buttonText, { color: Colors.dark }]}>
            Continue with Email
          </Text>
        </TouchableOpacity>

        {/* Apple */}
        <TouchableOpacity
          onPress={() => handleLogin(SignInType.Apple)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              marginTop: 20,
              backgroundColor: Colors.white,
            },
          ]}
        >
          <Ionicons name="logo-apple" size={24} color={Colors.dark} />
          <Text style={[defaultStyles.buttonText, { color: Colors.dark }]}>
            Continue with Email
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
    flexDirection: "row",
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginRight: 10,
  },
  enableButton: { backgroundColor: Colors.primary },
  disableButton: { backgroundColor: Colors.primaryMuted },
});
