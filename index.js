require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("ERROR: MONGODB_URI is not defined in .env file");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB connected successfully");

    // Import models after successful connection
    const Article = require("./models/article");
    console.log("✅ Article model loaded");

    return { Article };
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// MongoDB connection events
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Routes
const setupRoutes = (Article) => {
  // Basic routes
  app.get("/", (req, res) => {
    res.send("Express server is running");
  });

  app.get("/hello", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/hi", (req, res) => {
    res.send("Hello");
  });

  app.get("/sayHello", (req, res) => {
    const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
    res.render("numbers.ejs", { name: "Fathi", numbers });
  });

  // Article endpoints
  app.post("/articles", async (req, res) => {
    try {
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
      });
      await newArticle.save();
      res.status(201).send("Article saved successfully");
    } catch (err) {
      res.status(500).json({ message: "Error saving article: " + err.message });
    }
  });

  // app.get("/articles", async (req, res) => {
  //   try {
  //     const articles = await Article.find();
  //     res.json(articles);
  //   } catch (err) {
  //     res.status(500).json({ message: err.message });
  //   }
  // });

  app.get("/article/:id", async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete("/article/:id", async (req, res) => {
    try {
      const article = await Article.findByIdAndDelete(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.put("/article/:id", async (req, res) => {
    try {
      const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // show articles

  app.get("/articles", async (req, res) => {
    try {
      const articles = await Article.find();
      res.render("articles.ejs", { articles });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

// Initialize server
const startServer = async () => {
  try {
    const { Article } = await connectDB();
    setupRoutes(Article);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the application
startServer();
