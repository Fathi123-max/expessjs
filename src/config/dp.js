const mongoose = require("mongoose");

const connectDP = async () => {
  try {
    if (!process.env.DP_MONGODB_URI) {
      console.error("ERROR: DP_MONGODB_URI is not defined in .env file");
      process.exit(1);
    }

    await mongoose.connect(process.env.DP_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 100000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ DP MongoDB connected successfully");
  } catch (error) {
    console.error("❌ DP MongoDB connection error:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("DP MongoDB connection error:", err);
});

module.exports = connectDP;
