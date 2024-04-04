import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { BlurView } from "expo-blur";
import { useHeaderHeight } from "@react-navigation/elements";
import Colors from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { setAppIcon, getAppIcon } from "expo-dynamic-app-icon";

const ICONS = [
  {
    name: "Default",
    icon: require("@/assets/images/icon.png"),
  },
  {
    name: "Dark",
    icon: require("@/assets/images/icon-dark.png"),
  },
  {
    name: "Vivid",
    icon: require("@/assets/images/icon-vivid.png"),
  },
];

const Account = () => {
  // hooks
  const { user } = useUser();
  const { signOut } = useAuth();
  const headerHeight = useHeaderHeight();

  // state
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [edit, setEdit] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeIcon, setActiveIcon] = useState("Default");

  useEffect(() => {
    const loadCurrentIconPref = async () => {
      const icon = await getAppIcon();
      console.log("🚀 ~ loadCurrentIconPref ~ icon:", icon);
      setActiveIcon(icon);
    };
    loadCurrentIconPref();
  }, []);

  const onSaveUser = async () => {
    try {
      await user?.update({
        firstName,
        lastName,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setEdit(false);
    }
  };

  const onCaptureImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
      base64: true,
    });
    if (result.canceled) {
      return;
    }

    setIsUploading(true);
    const base64 = `data:image/png;base64,${result.assets[0].base64}`;
    await user?.setProfileImage({
      file: base64,
    });
    setIsUploading(false);
  };

  const onChangeAppIcon = async (icon: string) => {
    await setAppIcon(icon.toLowerCase());
    setActiveIcon(icon);
  };

  return (
    <BlurView
      intensity={80}
      tint="dark"
      style={{
        flex: 1,
        paddingTop: headerHeight,
        backgroundColor: "rgba(0, 0,0, 0.5)",
      }}
    >
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity onPress={onCaptureImage} style={styles.captureImage}>
          {user?.imageUrl && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isUploading ? (
                <Feather name="loader" size={24} color={Colors.white} />
              ) : (
                <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
              )}
            </View>
          )}
        </TouchableOpacity>

        <View style={{}}>
          {!edit && (
            <View style={styles.editRow}>
              <Text style={{ fontSize: 20, color: Colors.white }}>
                {user?.firstName} {user?.lastName}
              </Text>
              <TouchableOpacity onPress={() => setEdit(true)}>
                <Feather name="edit-3" size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
          )}

          {edit && (
            <View style={styles.editRow}>
              <TextInput
                style={[styles.inputField]}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={[styles.inputField]}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
              />
              <TouchableOpacity onPress={onSaveUser}>
                <Ionicons
                  name="checkmark-outline"
                  size={24}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => signOut()}>
          <Ionicons name="log-out" size={24} color={"#fff"} />
          <Text style={{ color: "#fff", fontSize: 18 }}>Log out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="person" size={24} color={"#fff"} />
          <Text style={{ color: "#fff", fontSize: 18 }}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="bulb" size={24} color={"#fff"} />
          <Text style={{ color: "#fff", fontSize: 18 }}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="megaphone" size={24} color={"#fff"} />
          <Text style={{ color: "#fff", fontSize: 18, flex: 1 }}>Inbox</Text>
          <View
            style={{
              backgroundColor: Colors.primary,
              paddingHorizontal: 10,
              borderRadius: 10,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12 }}>14</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        {ICONS.map((icon) => (
          <TouchableOpacity
            key={icon.name}
            style={styles.btn}
            onPress={() => onChangeAppIcon(icon.name)}
          >
            <Image source={icon.icon} style={{ width: 24, height: 24 }} />
            <Text style={{ color: "#fff", fontSize: 18 }}>{icon.name}</Text>
            {activeIcon.toLowerCase() === icon.name.toLowerCase() && (
              <Ionicons name="checkmark" size={24} color={"#fff"} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </BlurView>
  );
};

export default Account;

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
  },
  captureImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray,
    alignSelf: "center",
  },
  inputField: {
    height: 44,
    width: 140,
    borderWidth: 1,
    borderColor: Colors.gray,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 8,
  },
  actions: {
    backgroundColor: "rgba(256, 256, 256, 0.1)",
    borderRadius: 16,
    gap: 0,
    margin: 20,
  },
  btn: {
    padding: 14,
    flexDirection: "row",
    gap: 20,
  },
});
