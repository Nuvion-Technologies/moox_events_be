const Events = require('../models/Events');
const User = require('../models/user');
const mongoose = require('mongoose');
const service = require('../models/service');

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

// Add a new event
exports.add_event = async (req, res) => {
    try {
        const { user_id, title, description, event_date, event_type, photo } = req.body;

        // Check if user exists
        const userExists = await User.findById(user_id);
        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }

        // Validate required fields
        if (!title || !description || !event_date || !event_type) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        if (!photo) {
            return res.status(400).json({ message: 'Photo is required.' });
        }

        // Retrieve event type name
        const eventTypeData = await service.findById(event_type);
        if (!eventTypeData) {
            return res.status(400).json({ message: 'Invalid event type.' });
        }

        const event_name = eventTypeData.name; // Assuming service.findById returns a single object

        // Convert Base64 photo to Buffer
        const photoBuffer = Buffer.from(photo, 'base64');
        if (!photoBuffer) {
            return res.status(400).json({ message: 'Invalid photo format.' });
        }

        // Create new event
        const newEvent = new Events({
            title,
            description,
            event_date,
            event_name,
            event_type: new mongoose.Types.ObjectId(event_type),
            photo: photoBuffer, // Store as Buffer
            contentType: 'image/png', // Adjust if input may vary
        });

        // Save to database
        await newEvent.save();

        res.status(201).json({ message: 'Event added successfully.', event: newEvent });
    } catch (error) {
        res.status(500).json({ message: 'Error adding event.', error: error.message });
    }
};

exports.get_active_events = async (req, res) => {
    try {

        const events = await Events.find({active:true}, 'title description event_name event_date event_type active photo contentType');
        const eventsWithPhotos = events.map(event => ({
            _id: event._id,
            title: event.title,
            description: event.description,
            event_date: event.event_date,
            event_type: event.event_type,
            event_name: event.event_name,
            active: event.active,
            photo: `data:${event.contentType};base64,${event.photo.toString('base64')}`,
        }));

        res.status(200).json({ events: eventsWithPhotos });
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

        const events = await Events.find({}, 'title description event_date event_type active photo contentType');
        const eventsWithPhotos = events.map(event => ({
            _id: event._id,
            title: event.title,
            description: event.description,
            event_date: event.event_date,
            event_type: event.event_type,
            active: event.active,
            photo: `data:${event.contentType};base64,${event.photo.toString('base64')}`,
        }));

        res.status(200).json({ events: eventsWithPhotos });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events.', error: error.message });
    }
};

// Change event status
exports.change_event_status = async (req, res) => {
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
