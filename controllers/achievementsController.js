const Events = require('../models/achievements');
const User = require('../models/user');
const mongoose = require('mongoose');

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

// Add a new event
exports.add_ach = async (req, res) => {
    try {
        const { user_id, title, description, achievement_date, photo } = req.body;

        const userExists = await User.findById(user_id);

        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }
        if (!photo) {
            return res.status(400).json({ message: 'Photo is required.' });
        }

        const newEvent = new Events({
            title,
            description,
            achievement_date,
            photo: Buffer.from(photo, 'base64'), // Convert Base64 to Buffer
            contentType: 'image/png', // Adjust based on input
        });

        await newEvent.save();

        res.status(201).json({ message: 'Event added successfully.', event: newEvent });
    } catch (error) {
        res.status(500).json({ message: 'Error adding event.', error: error.message });
    }
};
exports.get_active_ach = async (req, res) => {
    try {

        const events = await Events.find({active:true}, 'title description achievement_date active photo contentType');
        const eventsWithPhotos = events.map(event => ({
            _id: event._id,
            title: event.title,
            description: event.description,
            event_date: event.achievement_date,
            active: event.active,
            photo: `data:${event.contentType};base64,${event.photo.toString('base64')}`,
        }));

        res.status(200).json({ events: eventsWithPhotos });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events.', error: error.message });
    }
};

// Get all events
exports.get_ach = async (req, res) => {
    try {
        const { user_id } = req.body;

        const userExists = await User.findById(user_id);
        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }

        const events = await Events.find({}, 'title description achievement_date active photo contentType');
        const eventsWithPhotos = events.map(event => ({
            _id: event._id,
            title: event.title,
            description: event.description,
            event_date: event.achievement_date,
            active: event.active,
            photo: `data:${event.contentType};base64,${event.photo.toString('base64')}`,
        }));

        res.status(200).json({ events: eventsWithPhotos });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events.', error: error.message });
    }
};

// Change event status
exports.change_ach_status = async (req, res) => {
    try {
        const { event_id, status, user_id } = req.body;

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
