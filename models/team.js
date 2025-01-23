const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const team = new mongoose.Schema({
    name:{type:String,required:true},
    photo: { type: Buffer },
    contentType: { type: String },
    position: { type: String },
    description:{type:String,required:true},
    active:{type:Boolean,default:true},
    facebook_link:{type:String},
    instagram_link:{type:String},
    delete:{type:Boolean,default:false},
    uploadedOn:{type:Date ,default:Date.now},
});

// Explicitly naming the model to avoid collisions
const Team = mongoose.models.Team || mongoose.model('Team', team);

module.exports = Team;
