import { StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV({
  id: "balance-storage",
});

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};

const inactivityStorageInstance = new MMKV({
  id: "inactivity-storage",
});

export const inactivityStorage = {
  recordInactivity: () => {
    return inactivityStorageInstance.set("startTime", Date.now());
  },
  getInactivity: () => {
    const value = inactivityStorageInstance.getNumber("startTime");
    return value ?? 0;
  },
  removeInactivity: () => {
    return inactivityStorageInstance.delete("startTime");
  },
};
