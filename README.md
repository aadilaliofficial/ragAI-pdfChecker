📄 Resume AI Assistant
Live Link https://rag-ai-pdf-checker.vercel.app/

AI-powered Resume Analyzer that allows you to upload a resume (PDF) and ask questions about it.
The app uses Google Gemini API to generate short & concise answers (2–3 lines).

🚀 Features

📂 Upload Resume (PDF)

🤖 Ask AI Questions about the resume

✍️ Always short answers (2–3 lines max)

🌐 CORS enabled for frontend (Vite/React)

📝 PDF parsing with pdf-parse

⚡ Fast response using gemini-1.5-flash

🛠️ Tech Stack

Backend: Node.js, Express.js

AI: Google Generative AI (Gemini API)

File Handling: Multer, FS

PDF Parsing: pdf-parse

Frontend (example): React + Vite

📦 Installation

Clone repo
git clone https://github.com/your-username/resume-ai-assistant.git
cd resume-ai-assistant

Install dependencies
npm install

Create .env file and add your Gemini API key
GEMINI_API_KEY=your_api_key_here
PORT=5000

Start server
node server.js

Server runs at 👉 http://localhost:5000

API Endpoints
1️⃣ Upload Resume
POST /upload

Body (form-data):

file → Resume PDF

Response:
{
  "message": "PDF uploaded successfully",
  "pdfUrl": "http://localhost:5000/pdf/filename.pdf"
}

2️⃣ Ask Question
POST /chat

Body (JSON):
{
  "question": "What are the candidate's skills?"
}

Response:
{
  "answer": "The candidate has full-stack skills with React, Node.js, MongoDB, and experience in AI model integration."
}

🎯 Example Flow

Upload resume PDF via /upload

Ask: "What are his skills?" → AI gives short summary

Ask: "What are his weaknesses?" → AI answers short & crisp

📌 Notes

By default, answers are always concise (2–3 lines).

Supported file: PDF only.

Can be connected with any frontend (React, Vue, Angular).

🔮 Future Enhancements

Toggle between short / detailed answers

Add database to store uploaded resumes

UI improvements

✨ Built with Express + Gemini API + AI magic
