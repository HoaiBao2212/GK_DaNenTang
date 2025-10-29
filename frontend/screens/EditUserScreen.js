// frontend/screens/EditUserScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const API_URL = "http://192.168.1.11:5000";

export default function EditUserScreen({ route, navigation }) {
  const { user } = route.params;
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [image, setImage] = useState(
    user.image ? { uri: user.image } : null
  );

  // 🖼️ Chọn ảnh mới
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  // 💾 Cập nhật người dùng
  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    if (image?.uri && !image.uri.startsWith("data:")) {
      const filename = image.uri.split("/").pop();
      formData.append("image", {
        uri: image.uri,
        name: filename,
        type: "image/jpeg",
      });
    }

    try {
      const res = await fetch(`${API_URL}/users/${user._id}`, {
        method: "PUT",
        body: formData,
      });
      if (res.ok) {
        Alert.alert("✅ Thành công", "Cập nhật người dùng thành công!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("❌ Lỗi", "Không thể cập nhật người dùng.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("⚠️ Lỗi kết nối!");
    }
  };

  // 🗑️ Xóa người dùng (có xác nhận)
  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa người dùng "${username}" không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/users/${user._id}`, {
                method: "DELETE",
              });
              if (res.ok) {
                Alert.alert("🗑️ Đã xóa", "Người dùng đã được xóa!", [
                  { text: "OK", onPress: () => navigation.goBack() },
                ]);
              } else {
                Alert.alert("❌ Lỗi", "Không thể xóa người dùng.");
              }
            } catch (err) {
              console.error(err);
              Alert.alert("⚠️ Lỗi kết nối!");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Chỉnh sửa người dùng</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            image
              ? { uri: image.uri }
              : require("../../assets/images/android-icon-background.png")
          }
          style={styles.avatar}
        />
      </TouchableOpacity>

      <TextInput
        placeholder="Tên người dùng"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      {/* 🔓 Mật khẩu không còn ẩn */}
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry={false}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>💾 Cập nhật</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "red" }]}
        onPress={handleDelete}
      >
        <Text style={styles.buttonText}>🗑️ Xóa người dùng</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
