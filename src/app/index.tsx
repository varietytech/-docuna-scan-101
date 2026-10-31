import { useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { CameraView } from "expo-camera";

export default function Index() {
  const [pages, setPages] = useState<string[]>([]);

  async function scan() {
    // Opens the phone's own document scanner (ML Kit on Android)
    const result = await CameraView.scanDocumentAsync();
    if (!result) return; // cancelled, or no scanner on this phone
    setPages(result.pages);
  }

  return (
    <View style={styles.container}>
      {pages.length > 0 && (
        <Image source={{ uri: pages[0] }} style={styles.preview} contentFit="contain" />
      )}
      <Text style={styles.empty}>{pages.length} pages scanned</Text>

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
