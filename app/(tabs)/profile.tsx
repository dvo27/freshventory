import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

export default function ProfileScreen() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    dietaryRestrictions: string[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const storedUserData = await SecureStore.getItemAsync("userData");
      if (storedUserData) {
        setUser(JSON.parse(storedUserData));
      }
      setIsLoading(false);
    };

    loadUserData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loaderContainer}>
        <Text>No user data found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{
              uri: user.avatar || "https://i.pravatar.cc/150?img=68",
            }}
            style={styles.avatar}
          />
          <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <Text style={styles.cardContent}>Email: {user.email}</Text>
          <Text style={styles.cardContent}>Phone: {user.phone}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dietary Restrictions</Text>
          {user.dietaryRestrictions.length > 0 ? (
            user.dietaryRestrictions.map((restriction, index) => (
              <Text key={index} style={styles.cardContent}>
                • {restriction}
              </Text>
            ))
          ) : (
            <Text style={styles.cardContent}>No dietary restrictions.</Text>
          )}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Edit Restrictions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
