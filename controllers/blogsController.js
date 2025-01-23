const Events = require('../models/Blogs');
const User = require('../models/user');
const mongoose = require('mongoose');
const service = require('../models/service');

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

// Add a new event
exports.add_event = async (req, res) => {
    try {
        console.log("started add blog")
        const { user_id, title, description, profile_photo,readTime,date,author,tags,photo1,photo2,photo3,photo4,photo5,category} = req.body;
        console.log("started add blog1")
        // Check if user exists
        const userExists = await User.findById(user_id);
        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }
        console.log("started add blog2")
        // Retrieve event type name
        // const eventTypeData = await service.findById(category);
        // if (!eventTypeData) {
        //     return res.status(400).json({ message: 'Invalid event type.' });
        // }
        console.log("started add blog3")
        // const event_name = eventTypeData.name; // Assuming service.findById returns a single object
        console.log("started add blog4")
        // Convert Base64 photo to Buffer
        const profilePhoto = Buffer.from(profile_photo, 'base64');
        if (!profilePhoto) {
            return res.status(400).json({ message: 'Invalid photo format.' });
        }
        console.log("started add blog5")
        const photoBuffer1 = Buffer.from(photo1, 'base64');
        if (!photoBuffer1) {
            return res.status(400).json({ message: 'Invalid photo format.' });
        }
        console.log("started add blog6")
        const photoBuffer2 = Buffer.from(photo2, 'base64');
        if (!photoBuffer2) {
            return res.status(400).json({ message: 'Invalid photo format.' });
        }
        console.log("started add blog7")
        const photoBuffer3 = Buffer.from(photo3, 'base64');
        if (!photoBuffer3) {
            return res.status(400).json({ message: 'Invalid photo format.' });
        }
        console.log("started add blog8")
        const photoBuffer4 = Buffer.from(photo4, 'base64');
        if (!photoBuffer4) {
            return res.status(400).json({ message: 'Invalid photo format.' });
        }
        console.log("started add blog9")
        const photoBuffer5 = Buffer.from(photo5, 'base64');
        if (!photoBuffer5) {
            return res.status(400).json({ message: 'Invalid photo format.' });
        }
        console.log("started add blog10")
        // Create new event
        const newEvent = new Events({
            title,
            description,
            profile_photo: profilePhoto,
            readTime,
            date,
            author,
            tags,
            // category_id: new mongoose.Types.ObjectId(category),
            categoryName:category,
            photo1: photoBuffer1,
            photo2: photoBuffer2,// Store as Buffer
            photo3: photoBuffer3,
            photo4: photoBuffer4,// Store as Buffer
            photo5: photoBuffer5,
            contentType: 'image/png', // Adjust if input may vary
        });
        console.log("started add blog11")
        // Save to database
        await newEvent.save();
        console.log("started add blog12")
        res.status(201).json({ message: 'Event added successfully.', event: newEvent });
    } catch (error) {
        res.status(500).json({ message: 'Error adding event.', error: error.message });
    }
};

exports.get_active_events = async (req, res) => {
    try {

        const events = await Events.find({active:true});
        const eventsWithPhotos = events.map(event => ({
            _id: event._id,
            title: event.title,
            description: event.description,
            read_time: event.read_time,
            date: event.date,
            author: event.author,
            tags:event.tags,
            category:event.categoryName,
            active: event.active,
            profile_photo: `data:${event.contentType};base64,${event.profile_photo.toString('base64')}`,
            photo1: `data:${event.contentType};base64,${event.photo1.toString('base64')}`,
            photo2: `data:${event.contentType};base64,${event.photo2.toString('base64')}`,
            photo3: `data:${event.contentType};base64,${event.photo3.toString('base64')}`,
            photo4: `data:${event.contentType};base64,${event.photo4.toString('base64')}`,
            photo5: `data:${event.contentType};base64,${event.photo5.toString('base64')}`,
        }));

        res.status(200).json({ blogs: eventsWithPhotos });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events.', error: error.message });
    }
};

// Get all events
exports.get_events = async (req, res) => {
    try {
        const { user_id } = req.body;

        const userExists = await User.findById(user_id);
        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }

        const events = await Events.find();
        const eventsWithPhotos = events.map(event => ({
            _id: event._id,
            title: event.title,
            description: event.description,
            read_time: event.read_time,
            date: event.date,
            author: event.author,
            tags:event.tags,
            category:event.categoryName,
            active: event.active,
            profile_photo: `data:${event.contentType};base64,${event.profile_photo.toString('base64')}`,
            photo1: `data:${event.contentType};base64,${event.photo1.toString('base64')}`,
            photo2: `data:${event.contentType};base64,${event.photo2.toString('base64')}`,
            photo3: `data:${event.contentType};base64,${event.photo3.toString('base64')}`,
            photo4: `data:${event.contentType};base64,${event.photo4.toString('base64')}`,
            photo5: `data:${event.contentType};base64,${event.photo5.toString('base64')}`,
        }));

        res.status(200).json({ blogs: eventsWithPhotos });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events.', error: error.message });
    }
};

// Change event status
exports.change_event_status = async (req, res) => {
    try {
        const { blog_id:event_id, status, user_id } = req.body;

        const userExists = await User.findById(user_id);
        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }

        const event = await Events.findById(event_id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.active = status;
        await event.save();

        res.json({ message: `Event status updated to ${status ? 'active' : 'inactive'}` });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update status.', error: error.message });
    }
};
