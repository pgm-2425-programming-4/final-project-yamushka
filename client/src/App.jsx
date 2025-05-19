import { useState } from "react";

import "../../design/css/reset.css";
import "../../design/css/main.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1>Hello Joanna's Project</h1>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Click me</button>
      </div>
    </>
  );
}

export default App;
