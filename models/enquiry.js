const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const enquiry = new mongoose.Schema({
    name:{type:String,required:true},
    mobileno:{type:String,required:true},
    email:{type:String,required:true},
    purpose_id:{type:Schema.Types.ObjectId, ref: 'service'},
    purpose_name:{type:String,required:true},
    message:{type:String,required:true},
    active:{type:Boolean,default:true},
    uploadedOn:{type:Date ,default:Date.now},
    resolvedOn:{type:Date},
});

// Explicitly naming the model to avoid collisions
const Enquiry = mongoose.models.Enquiry || mongoose.model('enquiry', enquiry);

module.exports = Enquiry;
