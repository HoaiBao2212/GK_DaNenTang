// frontend/screens/AdminScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

const API_URL = "http://10.103.107.87:5000"; //

export default function AdminScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Lỗi tải danh sách:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) fetchUsers();
  }, [isFocused]);

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Danh sách người dùng</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => navigation.navigate("EditUser", { user: item })}
          >
            <Image
              source={
                item.image
                  ? { uri: item.image } // base64
                  : require("../../assets/images/android-icon-background.png")
              }
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.username}</Text>
              <Text style={styles.email}>📧 {item.email}</Text>
              <Text style={styles.password}>🔒 {item.password}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AddUser")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>+ Thêm người dùng</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 10 },
  name: { fontSize: 16, fontWeight: "bold" },
  email: { fontSize: 14, color: "#555" },
  password: { fontSize: 14, color: "#888", fontStyle: "italic" },
  addBtn: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: "90%",
  },
});
