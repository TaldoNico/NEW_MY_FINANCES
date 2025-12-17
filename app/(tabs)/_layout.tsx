// app/(tabs)/_layout.tsx
// @ts-nocheck
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, StyleSheet } from "react-native";

export default function TabLayout() {
  const router = useRouter();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#111",
            borderTopWidth: 0,
            height: 70,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      >
        {/* HOME */}
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ size, focused }) => (
              <Ionicons
                name="home"
                size={size}
                color={focused ? "#2ecc71" : "#aaa"}
              />
            ),
            tabBarLabelStyle: { color: "#2ecc71" },
          }}
        />

        {/* CONQUISTAS */}
        <Tabs.Screen
          name="achievements"
          options={{
            title: "Conquistas",
            tabBarItemStyle: { marginRight: 18 },
            tabBarIcon: ({ size, focused }) => (
              <Ionicons
                name="trophy"
                size={size}
                color={focused ? "#FFD700" : "#aaa"}
              />
            ),
          }}
        />

        {/* REPORT ESCONDIDO */}
        <Tabs.Screen
          name="report"
          options={{
            href: null,
          }}
        />

        {/* METAS */}
        <Tabs.Screen
          name="goals"
          options={{
            title: "Metas",
            tabBarItemStyle: { marginLeft: 18 },
            tabBarIcon: ({ size, focused }) => (
              <Ionicons
                name="flag"
                size={size}
                color={focused ? "#1e90ff" : "#aaa"}
              />
            ),
          }}
        />

        {/* CONFIG */}
        <Tabs.Screen
          name="settings"
          options={{
            title: "Config",
            tabBarIcon: ({ size, focused }) => (
              <Ionicons
                name="settings"
                size={size}
                color={focused ? "#fff" : "#aaa"}
              />
            ),
          }}
        />
      </Tabs>

      {/* BOTÃO + */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/(tabs)/home?create=1")}
        >
          <Ionicons name="add" size={36} color="#000" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 28,
    alignSelf: "center",
    zIndex: 50,
  },
  fab: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
  },
});
