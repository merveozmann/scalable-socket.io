const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

describe("socket.io project unit test", () => {
    let io, serverSocket, clientSocket;

    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = new Client(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });

    test("should socket.io", (done) => {
        clientSocket.on("hello", (arg) => {
            expect(arg).toBe("world");
            done();
          });
          serverSocket.emit("hello", "world");

    });
});