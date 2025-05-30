const express = require("express");

const app = express();

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

app.get("/hi", (req, res) => {
  res.send("Hello ");
});

app.get("/h", (req, res) => {
  let number = "";
  for (let i = 0; i < 100; i++) {
    number += i;
  }
  res.send(number);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
