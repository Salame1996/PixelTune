import React, { useState, useEffect, useRef } from 'react';

const PixelatedImage = ({ imageUrl }) => {
  const [pixelatedSections, setPixelatedSections] = useState([true, true, true, true]); // All sections pixelated initially
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) return; // Wait for image to load

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      // Set canvas size to image size
      canvas.width = width;
      canvas.height = height;

      const pixelateSection = (left, top, sectionWidth, sectionHeight, pixelSize = 10) => {
        const offscreenCanvas = document.createElement("canvas");
        const offscreenContext = offscreenCanvas.getContext("2d");
        offscreenCanvas.width = sectionWidth;
        offscreenCanvas.height = sectionHeight;

        offscreenContext.drawImage(canvas, left, top, sectionWidth, sectionHeight, 0, 0, sectionWidth, sectionHeight);

        offscreenContext.imageSmoothingEnabled = false;
        offscreenContext.drawImage(offscreenCanvas, 0, 0, sectionWidth / pixelSize, sectionHeight / pixelSize);
        offscreenContext.drawImage(
          offscreenCanvas,
          0,
          0,
          sectionWidth / pixelSize,
          sectionHeight / pixelSize,
          0,
          0,
          sectionWidth,
          sectionHeight
        );

        context.drawImage(offscreenCanvas, left, top);
      };

      const unpixelateSection = (left, top, sectionWidth, sectionHeight) => {
        context.drawImage(img, left, top, sectionWidth, sectionHeight, left, top, sectionWidth, sectionHeight);
      };

      const drawCanvas = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, width, height);

        if (pixelatedSections[0]) pixelateSection(0, 0, width / 2, height / 2);
        if (pixelatedSections[1]) pixelateSection(width / 2, 0, width / 2, height / 2);
        if (pixelatedSections[2]) pixelateSection(0, height / 2, width / 2, height / 2);
        if (pixelatedSections[3]) pixelateSection(width / 2, height / 2, width / 2, height / 2);
      };

      drawCanvas();
    };
  }, [imageUrl, pixelatedSections]); // Redraw whenever pixelatedSections changes

  const unpixelateNextSection = () => {
    const nextPixelatedSections = [...pixelatedSections];
    const nextIndex = nextPixelatedSections.indexOf(true);

    if (nextIndex !== -1) {
      nextPixelatedSections[nextIndex] = false; // Unpixelate the first pixelated section

      setPixelatedSections(nextPixelatedSections); // Update the state to trigger a re-render
    }
  };

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      {/* Ensure the button is rendered only once */}
      <button onClick={unpixelateNextSection}>Unpixelate Next Section</button>
    </div>
  );
};

export default PixelatedImage;
