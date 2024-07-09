import express from "express"; 
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from "socket.io";
import './db/conn.js';

import userRegisterRoutes from './routes/userRegister.js';
import userLoginRoutes from './routes/userLogin.js';
import notificationRoutes from './routes/notification.js'
const PORT = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(bodyParser.json());
app.use(express.static("./public"));

io.on('connection', (socket) => {
    console.log('a user connected ', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });

        
    socket.on('join', (data) => {
        console.log("Joining Notification ", socket.id);
        socket.join(data.email);
    })

});

app.get('/', (req, res) => {
    res.sendFile("index.html")
});


app.use('/api/register', userRegisterRoutes);
app.use('/api/login', userLoginRoutes);
app.use('/api/notifications', notificationRoutes);




app.get('/*', (req, res) => {
    res.send("Page not Found!");
})



server.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
})

// export default app;
// export default io;
export { io };