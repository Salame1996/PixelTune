import React, { useState, useEffect, useRef } from 'react';

const PixelatedImage = () => {
  const [pixelatedSections, setPixelatedSections] = useState([true, true, true, true]); // All sections pixelated initially
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const img = new Image();

    img.src = 'https://picsum.photos/200/300';

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      // Set canvas size to image size
      canvas.width = width;
      canvas.height = height;

      // Function to pixelate a section of the image
      const pixelateSection = (left, top, sectionWidth, sectionHeight, pixelSize = 10) => {
        const offscreenCanvas = document.createElement('canvas');
        const offscreenContext = offscreenCanvas.getContext('2d');
        offscreenCanvas.width = sectionWidth;
        offscreenCanvas.height = sectionHeight;

        // Draw the section onto the offscreen canvas
        offscreenContext.drawImage(
          canvas, 
          left, top, sectionWidth, sectionHeight, 
          0, 0, sectionWidth, sectionHeight
        );

        // Pixelate the section
        offscreenContext.imageSmoothingEnabled = false;
        offscreenContext.drawImage(offscreenCanvas, 0, 0, sectionWidth / pixelSize, sectionHeight / pixelSize);
        offscreenContext.drawImage(
          offscreenCanvas, 
          0, 0, sectionWidth / pixelSize, sectionHeight / pixelSize, 
          0, 0, sectionWidth, sectionHeight
        );

        // Draw the pixelated section back to the main canvas
        context.drawImage(offscreenCanvas, left, top);
      };

      const unpixelateSection = (left, top, sectionWidth, sectionHeight) => {
        // Draw only the unpixelated section from the original image
        context.drawImage(
          img, 
          left, top, sectionWidth, sectionHeight, 
          left, top, sectionWidth, sectionHeight
        );
      };

      // Initial drawing of the image (pixelated sections)
      const drawCanvas = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, width, height); // Draw the full image initially

        if (pixelatedSections[0]) pixelateSection(0, 0, width / 2, height / 2); // Top-left
        if (pixelatedSections[1]) pixelateSection(width / 2, 0, width / 2, height / 2); // Top-right
        if (pixelatedSections[2]) pixelateSection(0, height / 2, width / 2, height / 2); // Bottom-left
        if (pixelatedSections[3]) pixelateSection(width / 2, height / 2, width / 2, height / 2); // Bottom-right
      };

      drawCanvas();

      // Handle "unpixelate" button click
      const unpixelateNextSection = () => {
        const nextPixelatedSections = [...pixelatedSections];
        const nextIndex = nextPixelatedSections.indexOf(true); // Find the next pixelated section

        if (nextIndex !== -1) {
          nextPixelatedSections[nextIndex] = false; // Mark the section as unpixelated

          // Unpixelate the specific section
          if (nextIndex === 0) unpixelateSection(0, 0, width / 2, height / 2);
          if (nextIndex === 1) unpixelateSection(width / 2, 0, width / 2, height / 2);
          if (nextIndex === 2) unpixelateSection(0, height / 2, width / 2, height / 2);
          if (nextIndex === 3) unpixelateSection(width / 2, height / 2, width / 2, height / 2);

          setPixelatedSections(nextPixelatedSections); // Update the state
        }
      };

      // Attach event listener to the button
      const button = document.getElementById('unpixelate-btn');
      button.addEventListener('click', unpixelateNextSection);

      // Cleanup
      return () => button.removeEventListener('click', unpixelateNextSection);
    };
  }, [pixelatedSections]);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <button id="unpixelate-btn">Unpixelate Next Section</button>
    </div>
  );
};

export default PixelatedImage;
