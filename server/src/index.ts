// Setting up simple WebSocket server
import WebSocket from "ws";
const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.send("Hello, client!");
  ws.on("message", (message) => {
    console.log(`Client sent:  + ${message}`);
  });
  ws.on("close", () => {
    console.log("Client disconnected");
  });
  ws.onerror = (error) => {
    console.error("Error:", error);
  };
});
console.log("Server started on port 8080");
