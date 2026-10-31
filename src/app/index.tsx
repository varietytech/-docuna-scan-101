import { useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { CameraView } from "expo-camera";
import { pageUri, saveScan, type Scan } from "@/lib/scans";

export default function Index() {
  const [last, setLast] = useState<Scan | null>(null);

  async function scan() {
    // Opens the phone's own document scanner (ML Kit on Android)
    const result = await CameraView.scanDocumentAsync();
    if (!result) return; // cancelled, or no scanner on this phone
    setLast(await saveScan(result.pages));
  }

  return (
    <View style={styles.container}>
      {last && (
        <Image source={{ uri: pageUri(last, last.pages[0]) }} style={styles.preview} contentFit="contain" />
      )}
      <Text style={styles.empty}>{last ? `Saved ${last.pages.length} pages` : "No scans yet"}</Text>

      <Pressable style={styles.scanButton} onPress={scan}>
        <Text style={styles.scanText}>Scan</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  preview: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
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
