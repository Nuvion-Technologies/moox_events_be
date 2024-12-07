const mongoose = require('mongoose');

// Schema for career applications
const ApplicationSchema = new mongoose.Schema({

    position_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number, required: true },
    appliedOn: { type: Date, default: Date.now },
});

// Explicitly naming the model to avoid collisions
const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

module.exports = Application;
