// Setting up simple WebSocket server
import WebSocket from "ws";
import axios, { AxiosResponse } from "axios";

// Fetching data from the upscope endpoints given
const endpoints = [
  "https://data--us-east.upscope.io/status?stats=1",
  "https://data--eu-west.upscope.io/status?stats=1",
  "https://data--eu-central.upscope.io/status?stats=1",
  "https://data--us-west.upscope.io/status?stats=1",
  "https://data--sa-east.upscope.io/status?stats=1",
  "https://data--ap-southeast.upscope.io/status?stats=1",
];

// Server on port 8080 created used web socket
const wss = new WebSocket.Server({ port: 8080 });

// Using an async function to fetch data
async function fetchData() {
  try {
    //Promise on all the endpoints by mapping onto each
    const res = await Promise.all(
      endpoints.map((endpoint) =>
        axios.get(endpoint).catch((error) => {
          console.log(`Data not fetch from ${endpoint} with error ${error}`);
          return []; //Empty array if request failed
        })
      )
    );

    //Success response action - using AxiosResponse type to filter data which is not null
    const data = res
      .filter((res): res is AxiosResponse => res !== null)
      .map((res) => res?.data);

    // Broadcasting res data to all connnected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
      console.log("Data sent to client");
    });
  } catch (error) {
    console.log(`Error fetching data: ${error}`);
  }
}

// Fetching data every 5 seconds
setInterval(fetchData, 5000);

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.send("Waiting for data from server...");
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
