const { Server } = require("socket.io");

function socketConnection(server) {
  const io = new Server(server, {
    cors: {
      origin: "https://sevensky.vercel.app",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    let activeUsers = [];

    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      io.emit("get-users", activeUsers);
    });

    socket.on("setup", (userId) => {
      const existingUser = activeUsers.find((user) => user.userId === userId);
      if (!existingUser) {
        activeUsers.push({
          userId: userId,
          socketId: socket.id,
        });
      }
      io.emit("get-users", activeUsers);
      socket.join(123);
      socket.emit("connected");
    });
    

    socket.on("send_message", (data) => {
      console.log(data,"message")
      socket.to(123).emit("recieve_message", data);
    });


  });
}
module.exports=socketConnection;
