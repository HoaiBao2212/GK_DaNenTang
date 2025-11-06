// ====== Import thư viện ======
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ====== Khởi tạo app ======
const app = express();
const PORT = 5000;

// ====== Middleware ======
app.use(express.json());
app.use(cors());

// ====== Kết nối MongoDB Atlas ======
mongoose
  .connect(
    "mongodb+srv://baophan37201_db_user:123@cluster0.waey67h.mongodb.net/user_admin?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas"))
  .catch((err) => console.error("❌ Lỗi MongoDB:", err));

// ====== Định nghĩa Schema ======
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  image: {
    data: Buffer,
    contentType: String,
  },
});

const User = mongoose.model("User", userSchema, "users");

// ====== Cấu hình multer để lưu file tạm ======
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ====== API ======

// 🟢 Kiểm tra server
app.get("/", (req, res) => {
  res.send("Server đang chạy trong MongoDB");
});

// 🟢 Lấy danh sách người dùng
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    // Trả về base64
    const formatted = users.map((u) => ({
      _id: u._id,
      username: u.username,
      email: u.email,
      password: u.password,
      image:
        u.image && u.image.data
          ? `data:${u.image.contentType};base64,${u.image.data.toString("base64")}`
          : null,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== LOGIN API =====
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.json({ success: false, message: "Không tìm thấy người dùng" });
  if (user.password !== password)
    return res.json({ success: false, message: "Sai mật khẩu" });

  res.json({ success: true, message: "Đăng nhập thành công", user });
});
// 🟢 Thêm người dùng (upload ảnh vào MongoDB)
app.post("/users", upload.single("image"), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let imageData = null;

    if (req.file) {
      const filePath = path.join(__dirname, "uploads", req.file.filename);
      imageData = {
        data: fs.readFileSync(filePath),
        contentType: req.file.mimetype,
      };

      // Xóa file tạm sau khi đọc
      fs.unlinkSync(filePath);
    }

    const newUser = new User({
      username,
      email,
      password,
      image: imageData,
    });

    await newUser.save();
    res.json({ message: "Đã thêm user và lưu ảnh vào MongoDB", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Cập nhật người dùng
app.put("/users/:id", upload.single("image"), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const updateData = { username, email, password };

    if (req.file) {
      const filePath = path.join(__dirname, "uploads", req.file.filename);
      updateData.image = {
        data: fs.readFileSync(filePath),
        contentType: req.file.mimetype,
      };
      fs.unlinkSync(filePath);
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Đã cập nhật user", user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Xóa người dùng
app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====== Chạy server ======
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server đang chạy tại http://10.103.107.87:${PORT}`);
});
