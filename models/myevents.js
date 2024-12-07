const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const myevents = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    client_name: { type: String, required: true },
    client_email: { type: String, required: true },
    client_phone: { type: String, required: true },
    client_address: { type: String, required: true },
    amount: { type: Number, default: 0 },
    advance: { type:Number, default: 0 },
    payment_method: { type: String, required: true },
    event_name:{type:String},
    event_date: { type: Date },
    event_type:{type:Schema.Types.ObjectId, ref: 'service'},
    active: { type: Boolean, default: true },
    uploadedOn:{type:Date,default:Date.now},
});

// Explicitly naming the model to avoid collisions
const MyEvents = mongoose.models.MyEvents || mongoose.model('MyEvents', myevents);

module.exports = MyEvents;
