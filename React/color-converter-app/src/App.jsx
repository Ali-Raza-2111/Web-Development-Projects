import React from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="converter">
        <h1>Color Converter</h1>
        <div className="rgb-section">
          <h2>RGB</h2>
          <div className="input-groups">
            <div className="input-group">
            <label>R:</label>
            <input type="number" name="r" min="0" max="255" value={255} />
          </div>
          <div className="input-group">
            <label>G:</label>
            <input type="number" name="g" min="0" max="255" value={103} />
          </div>
          <div className="input-group">
            <label>B:</label>
            <input type="number" name="b" min="0" max="255" value={87} />
          </div>
          </div>
        </div>

        <div className="hex-section">
          <h2>HEX</h2>
          <input type="text" maxLength={7} value='#ff6757' />
        </div>
      </div>

      <div className="color-preview">

      </div>
    </div>
  );
}

export default App;
