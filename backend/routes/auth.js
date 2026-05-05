// backend/routes/auth.js

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const users = require("../data/users");

const router = express.Router();

const SECRET = "mysecretkey"; // เปลี่ยนได้

// 🔐 REGISTER
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  // เช็ค user ซ้ำ
  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // hash password
  const hashed = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    email,
    password: hashed,
    name,
  };

  users.push(newUser);

  res.status(201).json({ message: "Register success" });
});


// 🔐 LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);

  // ❗ ตามสไลด์: ห้ามบอกว่า email หรือ password ผิด
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // สร้าง JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

module.exports = router;