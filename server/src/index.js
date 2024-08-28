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
exports.fetchData = fetchData;
// Setting up simple WebSocket server
const ws_1 = __importDefault(require("ws"));
const axios_1 = __importDefault(require("axios"));
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
const wss = new ws_1.default.Server({ port: 8080 });
// Using cache to store data for 1 minute before it expires to reduce server load
const cache = {};
const CACHE_DURATION = 60000; // 1 minute
// Using an async function to fetch data while error handling and using timeout
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const now = Date.now();
            const responses = yield Promise.all(endpoints.map((url) => __awaiter(this, void 0, void 0, function* () {
                if (cache[url] && now - cache[url].timestamp < CACHE_DURATION) {
                    // Return cached data if available and valid
                    return cache[url].data;
                }
                try {
                    const response = yield axios_1.default.get(url, { timeout: 5000 }); //timeout in 5 seconds if request fails
                    cache[url] = { data: response.data, timestamp: now };
                    return response.data;
                }
                catch (error) {
                    console.error(`Request to ${url} failed: ${error}`);
                    return null;
                }
            })));
            // Filter out failed requests and empty responses
            const data = responses.filter((response) => response !== null);
            // Send data to clients
            wss.clients.forEach((client) => {
                if (client.readyState === ws_1.default.OPEN) {
                    try {
                        const jsonData = JSON.stringify(data);
                        client.send(jsonData);
                    }
                    catch (error) {
                        console.error("Error sending data:", error);
                    }
                }
            });
        }
        catch (error) {
            console.error(`Error fetching data: ${error}`);
        }
    });
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
