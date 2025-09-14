import React, { useState } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

function App() {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("https://ragai-pdfchecker.onrender.com/upload", formData);
    setPdfUrl(res.data.pdfUrl);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const res = await axios.post("https://ragai-pdfchecker.onrender.com/chat", {
      question: input,
    });
    setChat((prev) => [...prev, { q: input, a: res.data.answer }]);
    setInput("");
  };

  const handleClear = () => {
    setChat([]);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4">
          {/* Upload File */}
          <div className="bg-gradient-to-br from-purple-700 to-black p-4 rounded-2xl shadow-lg">
            <h2 className="text-lg font-bold mb-2">Upload File</h2>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="mb-2 text-sm text-gray-200"
            />
            <button
              onClick={handleUpload}
              className="bg-purple-500 hover:bg-purple-600 px-4 py-1 rounded"
            >
              Upload
            </button>
          </div>

          {/* Resume Viewer */}
          <div className="flex-1 bg-gradient-to-br from-purple-700 to-black p-4 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out">
            <h2 className="text-lg font-bold mb-2">Resume</h2>
            {pdfUrl ? (
              <>
                <Document
                  file={pdfUrl}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                >
                  <Page pageNumber={pageNumber} />
                </Document>
                <div className="flex gap-2 mt-2 justify-center">
                  <button
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(pageNumber - 1)}
                    className="px-3 py-1 bg-gray-700 rounded"
                  >
                    Prev
                  </button>
                  <p>
                    Page {pageNumber} of {numPages}
                  </p>
                  <button
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber(pageNumber + 1)}
                    className="px-3 py-1 bg-gray-700 rounded"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-400">No PDF uploaded yet</p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4">
          {/* Ask Question */}
          <div className="bg-gradient-to-br from-purple-700 to-black p-4 rounded-2xl shadow-lg">
            <h2 className="text-lg font-bold mb-2">Ask Question</h2>
            <div className="flex">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border px-2 py-1 text-black rounded"
                placeholder="Ask about PDF..."
              />
              <button
                onClick={handleSend}
                className="ml-2 bg-green-500 hover:bg-green-600 px-4 py-1 rounded"
              >
                Send
              </button>
            </div>
          </div>

          {/* AI Answer */}
<div className="flex-1 bg-gradient-to-br from-purple-700 to-black p-4 rounded-2xl shadow-lg transition-all duration-500 ease-in-out relative flex flex-col">
  <div className="flex justify-between items-center mb-2">
    <h2 className="text-lg font-bold">AI Answer</h2>
    {chat.length > 0 && (
      <button
        onClick={handleClear}
        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
      >
        Clear
      </button>
    )}
  </div>
  {/* Content area with scroll only when needed */}
  <div className="space-y-2 overflow-y-auto flex-1 pr-2">
    {chat.map((c, i) => (
      <div key={i} className="mb-2">
        <p>
          <b>You:</b> {c.q}
        </p>
        <p>
          <b>AI:</b> {c.a}
        </p>
      </div>
    ))}
    {!chat.length && (
      <p className="text-gray-400">No questions asked yet</p>
    )}
  </div>
</div>

        </div>
      </div>
    </div>
  );
}

export default App;
