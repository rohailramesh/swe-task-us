"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const _1 = require(".");
const axios_1 = __importDefault(require("./__mocks__/axios"));
const http_1 = require("http");
const ws_2 = require("ws");
// Setup mock WebSocket server
const mockWsServer = new ws_2.WebSocketServer({ noServer: true });
const server = new http_1.Server();
server.on("upgrade", (request, socket, head) => {
    mockWsServer.handleUpgrade(request, socket, head, (ws) => {
        mockWsServer.emit("connection", ws, request);
    });
});
// Simple WebSocket client to test messages
const createWebSocketClient = () => new ws_1.default("ws://localhost:8080");
// Test WebSocket connection
test("WebSocket connection working!", () => __awaiter(void 0, void 0, void 0, function* () {
    const ws = createWebSocketClient();
    yield new Promise((resolve, reject) => {
        ws.onopen = () => {
            ws.send("Test message");
        };
        ws.onmessage = (event) => {
            try {
                expect(event.data).toBe("Expected data");
                ws.close();
                resolve();
            }
            catch (error) {
                ws.close();
                reject(error);
            }
        };
        ws.onerror = (error) => {
            ws.close();
            reject(error);
        };
    });
}));
// Test fetchData function
describe("fetchData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        axios_1.default.reset();
    });
    it("fetches data and sends to clients", () => __awaiter(void 0, void 0, void 0, function* () {
        const url = "https://data--us-east.upscope.io/status?stats=1";
        const responseData = { some: "data" };
        axios_1.default.onGet(url).reply(200, responseData);
        // Set up WebSocket client to receive messages
        yield new Promise((resolve, reject) => {
            const ws = createWebSocketClient();
            ws.onmessage = (event) => {
                try {
                    expect(event.data).toBe(JSON.stringify([responseData]));
                    ws.close();
                    resolve();
                }
                catch (error) {
                    ws.close();
                    reject(error);
                }
            };
            (0, _1.fetchData)();
        });
    }));
    it("handle request errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const url = "https://data--us-east.upscope.io/status?stats=1";
        axios_1.default.onGet(url).reply(500);
        yield new Promise((resolve, reject) => {
            const ws = createWebSocketClient();
            ws.onmessage = (event) => {
                try {
                    expect(event.data).toBe("[]"); // Empty array in case of error
                    ws.close();
                    resolve();
                }
                catch (error) {
                    ws.close();
                    reject(error);
                }
            };
            (0, _1.fetchData)();
        });
    }));
});
