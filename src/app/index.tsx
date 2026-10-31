import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { CameraView } from "expo-camera";
import { router, useFocusEffect } from "expo-router";
import { listScans, pageUri, saveScan, type Scan } from "@/lib/scans";

export default function Index() {
  const [scans, setScans] = useState<Scan[]>([]);

  // Reload every time this screen comes back into view
  useFocusEffect(
    useCallback(() => {
      listScans().then(setScans);
    }, [])
  );

  async function scan() {
    // Opens the phone's own document scanner (ML Kit on Android)
    const result = await CameraView.scanDocumentAsync();
    if (!result) return; // cancelled, or no scanner on this phone
    const saved = await saveScan(result.pages);
    setScans((list) => [saved, ...list]);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={scans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No scans yet. Tap Scan to start.</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push({ pathname: "/scan/[id]", params: { id: item.id } })}
          >
            <Image source={{ uri: pageUri(item, item.pages[0]) }} style={styles.thumb} />
            <View style={styles.info}>
              <Text style={styles.title}>Scan {new Date(item.createdAt).toLocaleDateString()}</Text>
              <Text style={styles.meta}>
                {item.pages.length} {item.pages.length === 1 ? "page" : "pages"} ·{" "}
                {new Date(item.createdAt).toLocaleTimeString()}
              </Text>
            </View>
          </Pressable>
        )}
      />

      <Pressable style={styles.scanButton} onPress={scan}>
        <Text style={styles.scanText}>Scan</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 120,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    elevation: 1,
  },
  thumb: {
    width: 56,
    height: 72,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  meta: {
    marginTop: 4,
    color: "#6B7280",
  },
  empty: {
    textAlign: "center",
    color: "#6B7280",
    marginVertical: 24,
  },
  scanButton: {
    position: "absolute",
    right: 24,
    bottom: 32,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 32,
    backgroundColor: "#4F46E5",
    elevation: 4,
  },
  scanText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
