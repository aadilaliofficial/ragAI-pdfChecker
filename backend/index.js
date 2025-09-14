const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");
const fs = require("fs");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const upload = multer({ dest: "uploads/" });

app.use(
  cors({
    origin: "https://rag-ai-pdfchecker.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let pdfData = ""; 
let lastUploadedFile = null;

// upload pdf
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(fileBuffer);
    pdfData = data.text;
    lastUploadedFile = req.file.filename;

    res.json({
      message: "PDF uploaded successfully",
      pdfUrl: `http://localhost:${port}/pdf/${req.file.filename}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to parse PDF" });
  }
});

// pdf serve
app.use("/pdf", express.static("uploads"));

// endpoint for chat
app.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;

    if (!pdfData) {
      return res.status(400).json({ error: "No PDF uploaded yet" });
    }

    // short ans prompt
    const userContent = `
Answer the following question in a very short and concise way (max 1-2 lines).
Question: ${question}
Resume Content: ${pdfData}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(userContent);

    res.json({ answer: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
});

// server status
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});

