import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useSignUp } from "@clerk/clerk-expo";

export default function Signup() {
  // state
  const [countryCode, setCountryCode] = useState("+49");
  const [mobileNumber, setMobileNumber] = useState("");

  // hooks
  const router = useRouter();
  const { signUp } = useSignUp();

  // variables
  const keyboardVerticalOffset = Platform.OS === "ios" ? 70 : 0;

  const handleSignup = async () => {
    const fullPhoneNumber = `${countryCode}${mobileNumber}`;
    try {
      await signUp!.create({
        phoneNumber: fullPhoneNumber,
      });
      signUp!.preparePhoneNumberVerification();
      console.log("signup started");
      router.push({
        pathname: "/verify/[phone]",
        params: { phone: fullPhoneNumber },
      });
    } catch (error) {
      console.log("error", JSON.stringify(error, null, 2));
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's get started!</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number. We will send you a confirmation code there
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

        <Link href={"/login"} replace asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>
              Already have an account? login
            </Text>
          </TouchableOpacity>
        </Link>

        <View style={{ flex: 1 }}></View>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            mobileNumber ? styles.enableButton : styles.disableButton,
            { marginBottom: 15 },
          ]}
          onPress={handleSignup}
        >
          <Text style={defaultStyles.buttonText}>Sign up</Text>
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
