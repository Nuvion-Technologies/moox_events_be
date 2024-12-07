const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photo: { type: Buffer, required: true },
    contentType: { type: String },
    active: { type: Boolean, default: true },
    uploadedOn:{type:Date,default:Date.now},
});

// Explicitly naming the model to avoid collisions
const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);

module.exports = Client;
