import mongoose from 'mongoose';
import 'dotenv/config';
const uri = process.env.CONNECTION_URL;
console.log(uri);


const conn = mongoose.connect(uri)
  .then(() => console.log('Database Connected!'))
  .catch(err => console.error('Could not connect to the database.', err));

export default conn;