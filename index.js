require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// Check if MongoDB URI is set
if (!process.env.MONGODB_URI) {
  console.error("ERROR: MONGODB_URI is not defined in .env file");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err.message);
  });

// Optional: Add MongoDB connection events
// const db = mongoose.connection;
// db.on('error', (err) => console.error('MongoDB connection error:', err));
// db.once('open', () => console.log('MongoDB connection established'));

// Basic route to test the server
app.get("/", (req, res) => {
  res.send("Express server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function () {
//   console.log("Connected to MongoDB");
// });

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

app.get("/hi", (req, res) => {
  res.send("Hello ");
});

app.get("/sayHello", (req, res) => {
  let numbers = [];
  for (let i = 1; i <= 100; i++) {
    numbers.push(i);
  }
  res.render("numbers.ejs", { name: "Fathi ", numbers: numbers });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
