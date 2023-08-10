const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.post("/saveOrder", (req, res) => {
  const orderedClassmates = req.body;

  const timestamp = new Date().getTime(); // Generate a unique timestamp

  const fileName = `ordered_classmates_${timestamp}.json`;

  fs.writeFile(path.join(__dirname, fileName), JSON.stringify(orderedClassmates), (err) => {
    if (err) {
      console.error("Error saving ordered classmates:", err);
      return res.status(500).json({ message: "Error saving ordered classmates" });
    }
    console.log("Ordered classmates saved successfully");
    res.json({ message: "Ordered classmates saved successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
