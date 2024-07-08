import express from "express"; 
import bodyParser from 'body-parser';
import './db/conn.js';

import userRegisterRoutes from './routes/userRegister.js';
import userLoginRoutes from './routes/userLogin.js';
import notificationRoutes from './routes/notification.js'

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send("Welcome Home!");
});

app.use('/api/register', userRegisterRoutes);
app.use('/api/login', userLoginRoutes);
app.use('/api/notifications', notificationRoutes);




app.get('/*', (req, res) => {
    res.send("Page not Found!");
})



app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
})

export default app;