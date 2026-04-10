import { useRef, useState } from "react";

export default function App() {
  const audioRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const generateMusic = async () => {
    if (!prompt) return alert("Enter prompt");

    setLoading(true);

    await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    audioRef.current.load();
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="box">
        <h2>🎵 AI Music Generator</h2>

        <input
          placeholder="Enter music prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button onClick={generateMusic}>
          {loading ? "Generating..." : "Generate Music"}
        </button>

        <audio ref={audioRef} controls>
          <source src="http://localhost:5000/music" type="audio/mpeg" />
        </audio>

        <a href="http://localhost:5000/music" download>
          ⬇ Download Music
        </a>
      </div>
    </div>
  );
}
