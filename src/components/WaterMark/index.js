// Watermark.js
import React from 'react';
// import 'assets/css/custom_theme_dark.css'; // Import the CSS file for styling

const WaterMark = ({ text = 'Watermark', imageSrc, opacity = 0.3 }) => {
  return (
    <div className="watermark-container">
      {imageSrc ? (
        <img src={imageSrc} alt="Watermark" className="watermark-image" style={{ opacity }} />
      ) : (
        <span className="watermark-text" style={{ opacity }}>
          {text}
        </span>
      )}
    </div>
  );
};

export default WaterMark;
