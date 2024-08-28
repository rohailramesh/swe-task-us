import React, { useState, useEffect } from "react";
import ServerDataDisplay from "./components/ServerDataDisplay";
import { ServerData } from "./types/serverData";

const App: React.FC = () => {
  const [data, setData] = useState<ServerData[]>([]);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("Connected to server");
    };
    ws.onmessage = (event) => {
      console.log(`Received data: ${event.data}`);
      try {
        const fetchedData: ServerData[] = JSON.parse(event.data);
        setData(fetchedData);
      } catch (error) {
        console.error("Error in parsing data:", error);
      }
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
      <h1>DevOps Dashboard</h1>
      <ServerDataDisplay data={data} />
    </div>
  );
};
export default App;
