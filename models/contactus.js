const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const contact = new mongoose.Schema({
    name:{type:String,required:true},
    mobileno:{type:String,required:true},
    email:{type:String,required:true},
    purpose:{type:String,required:true},
    active:{type:Boolean,default:true},
    uploadedOn:{type:Date ,default:Date.now},
    resolvedOn:{type:Date},
});

// Explicitly naming the model to avoid collisions
const ContactUs = mongoose.models.ContactUs || mongoose.model('ContactUs', contact);

module.exports = ContactUs;
