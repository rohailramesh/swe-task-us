import React, { useState, useEffect } from "react";
import ServerDataDisplay from "./components/ServerDataDisplay";
import { ServerData } from "./types/serverData";
import { Typography } from "antd";
import "./App.css"; // Make sure you have a CSS file for custom styles

const { Title, Text } = Typography;

const App: React.FC = () => {
  const [data, setData] = useState<ServerData[]>([]);
  const [timestamp, setTimestamp] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket("wss://swe-task-us-1.onrender.com");

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

  useEffect(() => {
    // Update timestamp every second
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div className="header-container">
        <img src="./logo.jpeg" alt="Dashboard Logo" className="header-image" />
        <div className="header-text">
          <Title level={1}>DevOps Dashboard</Title>
          <Text type="secondary">{timestamp}</Text>
        </div>
      </div>
      <ServerDataDisplay data={data} />
    </div>
  );
};

export default App;
