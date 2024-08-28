import WebSocket from "ws";
import { fetchData } from ".";
import mock from "../__mocks__/axios";
import { Server } from "http";
import { WebSocketServer } from "ws";

// Setup mock WebSocket server
const mockWsServer = new WebSocketServer({ noServer: true });
const server = new Server();

server.on("upgrade", (request, socket, head) => {
  mockWsServer.handleUpgrade(request, socket, head, (ws) => {
    mockWsServer.emit("connection", ws, request);
  });
});

// Simple WebSocket client to test messages
const createWebSocketClient = () => new WebSocket("ws://localhost:8080");

// Test WebSocket connection
test("WebSocket connection working!", async () => {
  const ws = createWebSocketClient();

  await new Promise<void>((resolve, reject) => {
    ws.onopen = () => {
      ws.send("Test message");
    };

    ws.onmessage = (event) => {
      try {
        expect(event.data).toBe("Expected data");
        ws.close();
        resolve();
      } catch (error) {
        ws.close();
        reject(error);
      }
    };

    ws.onerror = (error) => {
      ws.close();
      reject(error);
    };
  });
});

// Test fetchData function
describe("fetchData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.reset();
  });

  it("fetches data and sends to clients", async () => {
    const url = "https://data--us-east.upscope.io/status?stats=1";
    const responseData = { some: "data" };

    mock.onGet(url).reply(200, responseData);

    // Set up WebSocket client to receive messages
    await new Promise<void>((resolve, reject) => {
      const ws = createWebSocketClient();
      ws.onmessage = (event) => {
        try {
          expect(event.data).toBe(JSON.stringify([responseData]));
          ws.close();
          resolve();
        } catch (error) {
          ws.close();
          reject(error);
        }
      };

      fetchData();
    });
  });

  it("handle request errors", async () => {
    const url = "https://data--us-east.upscope.io/status?stats=1";

    mock.onGet(url).reply(500);

    await new Promise<void>((resolve, reject) => {
      const ws = createWebSocketClient();
      ws.onmessage = (event) => {
        try {
          expect(event.data).toBe("[]"); // Empty array in case of error
          ws.close();
          resolve();
        } catch (error) {
          ws.close();
          reject(error);
        }
      };

      fetchData();
    });
  });
});
