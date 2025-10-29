// frontend/screens/AddUserScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const API_URL = "http://192.168.1.11:5000";

export default function AddUserScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null); // { uri, width, height, type, fileName }

  // Yêu cầu quyền truy cập ảnh (chỉ 1 lần)
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Quyền bị từ chối", "Cần quyền truy cập ảnh để chọn ảnh.");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (result.canceled) return;

      // expo sdk trả về result.assets (mảng) — lấy phần tử đầu
      const asset = result.assets[0];
      setImage({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        // mime field may be asset.type or asset.uri extension
        type: asset.type || "image",
        fileName: asset.fileName || asset.uri.split("/").pop(),
      });
    } catch (err) {
      console.error("Lỗi chọn ảnh:", err);
      Alert.alert("Lỗi", "Không thể chọn ảnh");
    }
  };

  const handleAddUser = async () => {
    if (!username || !email || !password) {
      Alert.alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      if (image && image.uri) {
        // Chuẩn hóa filename và MIME type
        const uri = image.uri;
        const fileName = image.fileName || uri.split("/").pop();
        const match = /\.(\w+)$/.exec(fileName);
        const ext = match ? match[1].toLowerCase() : "jpg";
        const mime = match ? `image/${ext === "jpg" ? "jpeg" : ext}` : "image/jpeg";

        // Trên Android cần prepend 'file://' đôi khi không cần tuỳ SDK, nhưng thêm nếu thiếu
        const localUri = Platform.OS === "android" && !uri.startsWith("file://") ? "file://" + uri : uri;

        formData.append("image", {
          uri: localUri,
          name: fileName,
          type: mime,
        });
      }

      // Gửi request (fetch) — KHÔNG set Content-Type thủ công (để browser/node tự thêm boundary)
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        body: formData,
        // headers: { 'Content-Type': 'multipart/form-data' } // <-- không set nếu dùng FormData
      });

      if (res.ok) {
        Alert.alert("Thành công", "Đã thêm người dùng");
        navigation.goBack();
      } else {
        const txt = await res.text();
        console.error("Lỗi server:", res.status, txt);
        Alert.alert("Lỗi", "Server trả lỗi khi thêm người dùng");
      }
    } catch (err) {
      console.error("Lỗi upload:", err);
      Alert.alert("Lỗi", "Không thể kết nối tới server");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm người dùng</Text>

      <TouchableOpacity style={styles.avatarWrap} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: "#666" }}>Chạm để chọn ảnh</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Tên người dùng"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddUser}>
        <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  avatarWrap: { alignSelf: "center", marginVertical: 12 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
