import { useState } from "react";

export function Greeting() {
  // state to check if button is pressed or not
  const [pressed, setPressed] = useState(false);

  return (
    <div>
      {/* Show text based on state */}
      <h1>{pressed ? "Button is pressed!" : "Welcome"}</h1>

      {/* Button to change state */}
      <button onClick={() => setPressed(true)}>Press Me</button>
    </div>
  );
}