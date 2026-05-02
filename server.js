const WebSocket = require("ws");

const PORT = process.env.PORT || 10000;

const wss = new WebSocket.Server({ port: PORT });

const rooms = {};

wss.on("connection", (ws) => {
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

console.log("WebSocket running on port", PORT);