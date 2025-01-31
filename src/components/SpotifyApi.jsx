import React, { useEffect, useState } from "react";
import PixelatedImage from "./PixelatedImage"; // Import the PixelatedImage component

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function SpotifyApi() {
  const [accessToken, setAccessToken] = useState("");
  const [albumImage, setAlbumImage] = useState("");

  useEffect(() => {
    // Step 1: Get Spotify Access Token
    const authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((res) => res.json())
      .then((data) => {
        setAccessToken(data.access_token);
        console.log("Spotify API Connected ✅");
        fetchRandomAlbum(data.access_token); // Step 2: Fetch Random Album
      })
      .catch((error) => console.error("Error fetching token:", error));
  }, []);

  // Step 2: Fetch a Random Album
  const fetchRandomAlbum = (token) => {
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Random letter (a-z)
    const randomOffset = Math.floor(Math.random() * 50); // Offset aleatorio (máx 50)
  
    fetch(`https://api.spotify.com/v1/search?q=${randomLetter}&type=album&limit=15&offset=${randomOffset}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.albums && data.albums.items.length > 0) {
          // Selecciona un álbum aleatorio de la lista
          const randomIndex = Math.floor(Math.random() * data.albums.items.length);
          const album = data.albums.items[randomIndex];
          setAlbumImage(album.images[0]?.url || ""); // Obtiene la imagen del álbum
          console.log("Random Album:", album.name);
          console.log("Album Artwork:", album.images[0]?.url);
        } else {
          console.warn("No album found.");
        }
      })
      .catch((error) => console.error("Error fetching album:", error));
  };
  
  return (
    <div>
      {albumImage ? (
        <PixelatedImage imageUrl={albumImage} /> // Pass the album image to PixelatedImage
      ) : (
        <p>Loading album...</p>
      )}
    </div>
  );
}

export default SpotifyApi;
