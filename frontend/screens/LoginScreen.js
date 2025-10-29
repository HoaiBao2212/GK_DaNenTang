// frontend/screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";

const API_URL = "http://192.168.1.11:5000";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      if (res.data.success) {
        Alert.alert("Thành công", "Đăng nhập thành công!");
        navigation.replace("Admin"); // <-- CHUYỂN NGAY ĐẾN Admin
      } else {
        Alert.alert("Lỗi", res.data.message || "Sai thông tin đăng nhập!");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    padding: 10, marginBottom: 10,
  },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
