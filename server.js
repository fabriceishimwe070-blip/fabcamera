const WebSocket = require("ws");
const http = require("http");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const rooms = {};

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    const room = data.room;

    if (!rooms[room]) rooms[room] = [];

    if (data.type === "join") {
      rooms[room].push(ws);
      ws.room = room;
    }

    if (data.type === "signal") {
      rooms[room].forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  });

  ws.on("close", () => {
    const room = ws.room;
    if (rooms[room]) {
      rooms[room] = rooms[room].filter(c => c !== ws);
    }
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log("WebSocket running on port", PORT);
});