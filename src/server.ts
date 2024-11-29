const clients: Map<any, any> = new Map(); 

const server = Bun.listen({
  port: 3000,
  hostname: "localhost",
  socket: {
    open(socket) {
      console.log("Novo client conectou-se");
      socket.write("Bem-vindo ao servidor!\n");
    },
    data(socket, data) {
      const message = data.toString().trim();

      if (!clients.has(socket)) {
        clients.set(socket, message);
        console.log(`Client conectado com nome: ${message}`);
        socket.write(`Olá ${message}! Você se conectou!\n`);
        return;
      }

      const clientName = clients.get(socket);
      console.log(`[${clientName}] diz: ${message}`);

      clients.forEach((name, clientSocket) => {
        if (clientSocket !== socket) {
          clientSocket.write(`[${clientName}]: ${message}\n`);
        }
      });
    },
    close(socket) {
      const clientName = clients.get(socket);
      console.log(`Client desconectou-se: ${clientName || "Desconhecido"}`);
      clients.delete(socket);
    },
    error(socket, error) {
      console.error("Socket error:", error);
    },
  },
});

console.log(`Servidor TCP rodando em localhost:${server.port}`);