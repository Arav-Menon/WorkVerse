import mongoose from "mongoose";

//add chat schema
const chat = new mongoose.Schema({
    message: {
        type: String,
        required: [true, "message is required"],
    },
    senderId: {
        type: String,
        required: [true, "senderId is required"],
    },
    receiverId: {
        type: String,
        required: [true, "receiverId is required"],
    },
})

const chatModel = mongoose.model('chatModel', chat)

export { chatModel }

