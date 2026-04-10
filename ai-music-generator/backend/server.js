const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  console.log("Prompt:", prompt);

  if (!prompt) {
    return res.status(400).json({ error: "Prompt required" });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/musicgen-small",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer",
        timeout: 120000
      }
    );

    fs.writeFileSync("output.mp3", response.data);
    res.json({ success: true });

  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Music generation failed" });
  }
});

app.get("/music", (req, res) => {
  const filePath = __dirname + "/output.mp3";

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Music not generated yet" });
  }

  res.sendFile(filePath);
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
