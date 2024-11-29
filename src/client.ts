import type { Socket } from 'bun';
import * as readline from 'readline';

let socket: Socket;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = Bun.connect({
  hostname: "localhost",
  port: 3000,
  socket: {
    open(s) {
      socket = s;
      console.log("Conectado ao servidor\n");

      rl.question("Insira seu nickname: ", (name) => {
        socket.write(name + "\n"); 
        promptMessage(socket); 
      });
    },
    data(s, data) {
      console.log(`Server diz: ${data.toString().trim()}\n`);
    },
    close() {
      console.log("Desconectado do server");
      process.exit(0);
    },
    error(s, error) {
      console.error("Socket error:", error);
      process.exit(1);
    },
  },
});

function promptMessage(socket: Socket) {
  rl.question("Insira sua mensagem", (message) => {
    if (message.toLowerCase() === "exit") {
      console.log("Fechando conexão...");
      socket.end();
      rl.close();
    } else {
      socket.write(message + "\n"); 
      promptMessage(socket); 
    }
  });
}