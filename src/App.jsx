import { useState } from "react";



import "./App.css";
import PixelatedImage from "./components/PixelatedImage";


function App() {
const [imageUrl, setImageUrl] = useState("");

  return (
    <div>
      <p className="text-rose-400">Hello World</p>
      <PixelatedImage/>
     
      
    </div>
  );
}

export default App;
