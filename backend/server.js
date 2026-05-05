const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});