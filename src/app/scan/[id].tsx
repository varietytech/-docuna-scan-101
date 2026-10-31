import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { deleteScan, getScan, pageUri, sharePdf, type Scan } from "@/lib/scans";

export default function ScanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [scan, setScan] = useState<Scan | null>(null);

  useEffect(() => {
    getScan(id).then(setScan);
  }, [id]);

  function remove() {
    Alert.alert("Delete this scan?", "Every page is removed from your phone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteScan(id);
          router.back();
        },
      },
    ]);
  }

  if (!scan) return null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `${scan.pages.length} pages` }} />
      <FlatList
        data={scan.pages}
        keyExtractor={(page) => page}
        contentContainerStyle={styles.pages}
        renderItem={({ item }) => (
          <Image source={{ uri: pageUri(scan, item) }} style={styles.page} contentFit="contain" />
        )}
      />

      <View style={styles.actions}>
        {scan.hasPdf && (
          <Pressable style={styles.action} onPress={() => sharePdf(scan)}>
            <Text style={styles.actionText}>Share PDF</Text>
          </Pressable>
        )}
        <Pressable style={[styles.action, styles.danger]} onPress={remove}>
          <Text style={styles.actionText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pages: {
    padding: 16,
    gap: 16,
  },
  page: {
    width: "100%",
    aspectRatio: 1 / 1.414,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  action: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#4F46E5",
  },
  danger: {
    backgroundColor: "#DC2626",
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
