import { update, findBySocketId } from '../repository/user.js';
export const joinRoom = async ( socket, data ) => {
    socket.join(data.email);
    try {
        const valuesToUpdate = {
            connected: true,
            socketId: socket.id
        }
        await update(data.email, valuesToUpdate);
    } catch (error) {
        console.error(error);
    }
}

export const disconnectUser = async ( socket ) => {
    try {
        const user = await findBySocketId(socket.id); 
        const valuesToUpdate = {
            connected: false,
            socketId: ""
        }
        if(user){
            await update(user.email, valuesToUpdate);
        } 
    } catch (error) {
        console.log(error);
    }
}