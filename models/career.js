const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
    position_name: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    location: { type: String, required: true },
    active: { type: Boolean, default: true },
    uploadedOn:{type:Date,default:Date.now},
});

// Explicitly naming the model to avoid collisions
const Career = mongoose.models.Career || mongoose.model('Career', CareerSchema);

module.exports = Career;
