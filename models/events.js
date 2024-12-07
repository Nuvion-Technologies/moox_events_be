const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const events = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: Buffer },
    contentType: { type: String },
    event_name:{type:String},
    event_date: { type: Date },
    event_type:{type:Schema.Types.ObjectId, ref: 'service'},
    active: { type: Boolean, default: true },
    uploadedOn:{type:Date,default:Date.now},
});

// Explicitly naming the model to avoid collisions
const Events = mongoose.models.Events || mongoose.model('Events', events);

module.exports = Events;
