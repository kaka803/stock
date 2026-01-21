import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
  },
  message: {
    type: String,
    required: [true, 'Please provide your message'],
  },
  status: {
    type: String,
    enum: ['pending', 'read', 'replied'],
    default: 'pending',
  }
}, { timestamps: true });

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
