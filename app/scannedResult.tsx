import React, { useState } from "react";
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
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ScannedResult() {
  const { photo } = useLocalSearchParams(); // Access photo URI from the route params
  const router = useRouter(); // Use router for navigation
  const [scannedItems, setScannedItems] = useState<string[]>([]); // Store the scanned items
  const [isProcessing, setIsProcessing] = useState(false); // Track if processing is in progress

  const apiUrl = "https://detect.roboflow.com/aicook-lcv4d/3"; // Replace with the actual API URL
  const apiKey = "fAwcjwOeWTzCAttEENEQ"; // Replace with your actual API key

// Handle the API call to process the image
/// Handle the API call to process the image
async function processImage(photoUri: string) {
  setIsProcessing(true);
  try {
    // Convert the image to Base64
    const base64Image = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Make the API call
    const response = await axios.post(
      apiUrl,
      base64Image,
      {
        params: {
          api_key: apiKey,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Extract only the "class" values with confidence > 0.7
    const ingredients = response.data.predictions
      .filter((item: any) => item.confidence > 0.7) // Filter by confidence
      .map((item: any) => item.class); // Extract the "class" property

    // Remove duplicates from the array
    const uniqueIngredients = [...new Set(ingredients)];

    console.log("Extracted ingredients:", uniqueIngredients);

    // Save the ingredients to Firebase
    for (const ingredient of uniqueIngredients) {
      await addDoc(collection(db, "ingredients"), { name: ingredient });
    }

    setScannedItems(uniqueIngredients); // Update the scanned items state
    Alert.alert("Success", "Ingredients have been saved to your inventory!");
  } catch (error) {
    console.error("Error processing image:", error);
    Alert.alert("Error", "Failed to process the image. Please try again.");
  } finally {
    setIsProcessing(false);
  }
}



  // Handle Complete Scan
  const handleCompleteScan = async () => {
    try {
      Alert.alert("Success", "Scanned ingredients have been added to your inventory!");
      router.replace("/scan"); // Navigate back to the scan page
    } catch (error) {
      console.error("Error adding items to inventory:", error);
      Alert.alert("Error", "Failed to complete the scan.");
    }
  };

  // Trigger processing when the component loads
  React.useEffect(() => {
    if (photo) {
      processImage(photo as string);
    }
  }, [photo]);

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
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <Text style={styles.itemText}>• {item}</Text>
          )}
          ListEmptyComponent={
            !isProcessing && <Text style={styles.placeholder}>No items detected.</Text>
          }
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
    textAlign: "center",
    marginTop: 20,
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
