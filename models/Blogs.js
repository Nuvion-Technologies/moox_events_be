const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const blogs = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    profile_photo: { type: Buffer },
    contentType: { type: String },
    readTime:{type:String},
    date: { type: Date },
    author:{type:String},
    tags:{type: String},
    photo1:{type:Buffer},
    photo2:{type:Buffer},
    photo3:{type:Buffer},
    photo4:{type:Buffer},
    photo5:{type:Buffer},
    category_id:{type:Schema.Types.ObjectId, ref: 'service'},
    categoryName:{type:String},
    active: { type: Boolean, default: true },
    uploadedOn:{type:Date,default:Date.now},
});

// Explicitly naming the model to avoid collisions
const Blogs = mongoose.models.Blogs || mongoose.model('Blogs', blogs);

module.exports = Blogs;
