import { useState } from "react";

import "./App.css";
import PixelatedImage from "./components/PixelatedImage";
import SpotifyApi from "./components/SpotifyApi";

function App() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div>
      <SpotifyApi />
    </div>
  );
}

export default App;
