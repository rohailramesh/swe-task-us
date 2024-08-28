import React, { useState, useEffect } from "react";
function App() {
  const [messages, setMessages] = useState<string[]>([]);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("Connected to server");
    };
    ws.onmessage = (event) => {
      console.log(`Received message: ${event.data}`);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };
    ws.onclose = () => {
      console.log("Connection closed");
    };
    ws.onerror = (error) => {
      console.error("Error:", error);
    };
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="App">
      <h1>Client Websocket</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message} </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
