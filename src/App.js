import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrls, setShortUrls] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shortUrls"));
    if (saved) setShortUrls(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("shortUrls", JSON.stringify(shortUrls));
  }, [shortUrls]);

  const isValidUrl = (url) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)" + 
      "((([a-zA-Z0-9$-_@.&+!*\"(),])+)(\\.[a-zA-Z]{2,}))" +
      "(\\/[a-zA-Z0-9$-_@.&+!*\"(),]*)*$"
    );
    return pattern.test(url);
  };

  const generateShortCode = () =>
    Math.random().toString(36).substring(2, 8);

  const handleShorten = () => {
    if (!url) {
      showError("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      showError("Invalid URL!\nMust start with http:// or https://");
      return;
    }

    const newUrl = {
      original: url,
      short: `https://${generateShortCode()}`,
      clicks: 0,
    };

    setShortUrls([newUrl, ...shortUrls]);
    setUrl("");
  };

  const handleVisit = (index) => {
    const updated = [...shortUrls];
    updated[index].clicks += 1;
    setShortUrls(updated);
    window.open(updated[index].original, "_blank");
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000);
  };

  return (
    <div className={darkMode ? "main dark" : "main"}>
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header">
          <h1>🚀URL Shortener</h1>
          <button
            className="toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
<div className="input-section">
  <input
    type="text"
    placeholder="Paste your long URL..."
    value={url}
    onChange={(e) => setUrl(e.target.value)}
  />

  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={handleShorten}
  >
    Shorten
  </motion.button>
</div>

{/* 👇 Error Below Input */}
<AnimatePresence>
  {error && (
    <motion.p
      className="error-text"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      ❌ {error}
    </motion.p>
  )}
</AnimatePresence>


        <div className="list">
          {shortUrls.map((item, index) => (
            <motion.div key={index} className="url-box">
              <div className="url-info">
                <span className="original">{item.original}</span>
                <span
                  className="short"
                  onClick={() => handleVisit(index)}
                >
                  {item.short}
                </span>
              </div>

              <div className="right-section">
                <span>📊 {item.clicks}</span>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(item.short, index)}
                >
                  {copiedIndex === index ? "Copied ✅" : "Copy"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default App;
