import mongoose from 'mongoose';

const NotificationSchema = mongoose.Schema({
    id: { type: String },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false } 
  });

   
const Notification = mongoose.model('Notification', NotificationSchema);
 
export default Notification;

