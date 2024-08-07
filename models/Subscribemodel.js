import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    email: String,
    subscribed: { type: Boolean, default: true },
});

const Subscriber = mongoose.model('SUBSCRIBER', subscriberSchema);

export default Subscriber;