import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ScannedResult() {
  const { photo } = useLocalSearchParams(); // Access photo URI from the route params
  const router = useRouter(); // Use router for navigation

  // Mock scanned items list for demonstration
  const scannedItems = [
    { id: "1", name: "Udon" },
    { id: "2", name: "Ramen" },
    { id: "3", name: "Kimchi" },
  ];

  // Handle Complete Scan: Add items to the database
  const handleCompleteScan = async () => {
    try {
      for (const item of scannedItems) {
        await addDoc(collection(db, "ingredients"), { name: item.name }); // Add each item to Firestore
      }

      Alert.alert("Success", "Scanned ingredients have been added to your inventory!");
      router.replace("/scan"); // Navigate back to the scan page
    } catch (error) {
      console.error("Error adding items to inventory:", error);
      Alert.alert("Error", "Failed to add scanned items to the inventory.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Top half for image preview */}
      <View style={styles.topContainer}>
        <Text style={styles.title}>Scanned Image</Text>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>No photo available</Text>
        )}
      </View>

      {/* Bottom half for scanned items */}
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Detected Items</Text>
        <FlatList
          data={scannedItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.itemText}>• {item.name}</Text>
          )}
        />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/scan")}
          >
            <Text style={styles.buttonText}>Retake Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.completeButton]}
            onPress={handleCompleteScan}
          >
            <Text style={styles.buttonText}>Complete Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  topContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 16,
  },
  bottomContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "70%",
    resizeMode: "contain",
    borderRadius: 8,
  },
  placeholder: {
    fontSize: 16,
    color: "#aaa",
  },
  itemText: {
    fontSize: 18,
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
  completeButton: {
    backgroundColor: "#34c759",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
