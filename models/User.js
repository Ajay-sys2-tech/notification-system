
import mongoose from 'mongoose';
 
const UserSchema = mongoose.Schema({
  id: { type: String },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  connected: { type: Boolean, default: false } 
});
 
const User = mongoose.model('User', UserSchema);
export default User;