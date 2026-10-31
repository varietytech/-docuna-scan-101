import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#4F46E5" },
        headerTintColor: "#FFFFFF",
        contentStyle: { backgroundColor: "#F5F6FA" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Docuna Scan" }} />
    </Stack>
  );
}
