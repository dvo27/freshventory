import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

interface InventoryItem {
  id: string
  name: string
  quantity: number
  unit: string
}

const mockInventory: InventoryItem[] = [
  { id: "1", name: "Milk", quantity: 1, unit: "gallon" },
  { id: "2", name: "Eggs", quantity: 12, unit: "pcs" },
  { id: "3", name: "Bread", quantity: 1, unit: "loaf" },
  { id: "4", name: "Cheese", quantity: 200, unit: "g" },
  { id: "5", name: "Apples", quantity: 6, unit: "pcs" },
]

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [newItemQuantity, setNewItemQuantity] = useState("")
  const [newItemUnit, setNewItemUnit] = useState("")

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemUnit}>{item.unit}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
          <Ionicons name="remove-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
          <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  )

  const updateQuantity = (id: string, change: number) => {
    setInventory((prevInventory) =>
      prevInventory.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item)),
    )
  }

  const addItem = () => {
    if (newItemName && newItemQuantity && newItemUnit) {
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        name: newItemName,
        quantity: Number.parseInt(newItemQuantity, 10),
        unit: newItemUnit,
      }
      setInventory((prevInventory) => [...prevInventory, newItem])
      setIsAddModalVisible(false)
      setNewItemName("")
      setNewItemQuantity("")
      setNewItemUnit("")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      
      {/* Invetory List */}
      <FlatList
        data={inventory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* Add Item Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>

      {/* Add Item Screen */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Item</Text>
            <TextInput style={styles.input} placeholder="Item Name" value={newItemName} onChangeText={setNewItemName} />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={newItemQuantity}
              onChangeText={setNewItemQuantity}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Unit (e.g., pcs, g, ml)"
              value={newItemUnit}
              onChangeText={setNewItemUnit}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAddModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addItem}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
  },
  itemUnit: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#ff3b30",
    padding: 10,
    borderRadius: 4,
    width: "45%",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#34c759",
    padding: 10,
    borderRadius: 4,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

