import express from "express"; 
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from "socket.io";
import './db/conn.js';
import './kafka/admin.js';
import { startKafkaConsumer } from './kafka/consumer.js'
import swaggerUi from 'swagger-ui-express'
import {swaggerSpec} from './swagger.js'

import userRegisterRoutes from './routes/userRegister.js';
import userLoginRoutes from './routes/userLogin.js';
import notificationRoutes from './routes/notification.js'
import { socketConnection } from "./socket/index.js";
const PORT = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(express.static("./public"));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

startKafkaConsumer(io);
socketConnection(io);

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
// swaggerDocs(app, PORT)
export { io };