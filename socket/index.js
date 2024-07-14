import { joinRoom, disconnectUser } from "./socketHandler.js";
let socketExporter;
let socketData;
export const socketConnection = async (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected ', socket.id);
        socketExporter = socket;
        socket.on('disconnect', async () => {
            await disconnectUser(socket);
            console.log('user disconnected', socket.id);
        });
    });
};


export {socketExporter};