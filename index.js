import express from "express"; 

import bodyParser from 'body-parser';

import './db/conn.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send("Welcome Home!");
});


app.get('/*', (req, res) => {
    res.send("Page not Found!");
})



app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
})

export default app;