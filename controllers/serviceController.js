
const Service = require('../models/service');
const User = require('../models/user');
const mongoose = require('mongoose');

// Maximum allowed photo size in bytes (e.g., 5MB)
const MAX_PHOTO_SIZE = 5 * 1024 * 1024 *1024; // 5MB

// Fetch all active services
exports.get_active_services = async (req, res) => {
    try {

        const services = await Service.find({ active: true,delete:false }, 'name _id');

        res.status(200).json({ services });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching active services.', error: error.message });
    }
};

exports.update_service = async (req, res) => {
    const { name, description,id,user_id,photo} = req.body;
    const userExists = await User.findById(user_id); // Find user by ID
    try{
    if (!userExists) {
        return res.status(400).json({ message: 'Unauthorized User' });
    }
    const buffer = Buffer.from(photo, 'base64');
    const updateData = { name, description,photo: buffer};
        
        const updatedService = await Service.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found.' });
        }

        res.status(200).json({ message: 'Service updated successfully.', service: updatedService });
    } catch (error) {
        res.status(500).json({ message: 'Error updating service.', error: error.message });
    }
};


exports.add_service = async (req, res) => {
    try {
        let { user_id, name, description, photo } = req.body;

        // Check for the presence of a photo
        if (!photo) {
            return res.status(400).json({ message: 'Photo is required.' });
        }

        // Check if the photo is a Base64 string and strip the prefix if present
        if (photo.startsWith('data:image')) {
            photo = photo.split(',')[1]; // Remove the prefix part like 'data:image/png;base64,'
        }

        // Validate photo data length (check for a reasonable minimum length)
        if (photo.length < 100) {
            return res.status(400).json({ message: 'Invalid photo data.' });
        }

        // Validate photo size (before converting Base64 to Buffer)
        const buffer = Buffer.from(photo, 'base64');
        if (buffer.length > MAX_PHOTO_SIZE) {
            return res.status(400).json({ message: 'Photo is too large. Maximum allowed size is 5MB.' });
        }

        // Check for user existence and authorization
        const userExists = await User.findById(user_id); // Find user by ID
        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }

        // Ensure 'name' is provided
        if (!name) {
            return res.status(400).json({ message: 'Name is required.' });
        }

        // Create a new Service object and save it
        const newService = new Service({
            name,
            description,
            photo: buffer, // Store photo as a Buffer
        });

        // Save the service to the database
        await newService.save();

        // Return a success response
        return res.status(201).json({ message: 'Service added successfully.', service: newService });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding service.', error: error.message });
    }
};

exports.get_services=async (req, res) => {
    try {

        let { user_id } = req.body;
        const userExists = await User.findById(user_id); // Find user by ID
        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }
        const events = await Service.find({delete:false}); // Fetch all events
        
        const eventss = events.map(client => ({
            id: client._id,
            title: client.name,
            status: client.description,
            image: `data:image/png;base64,${client.photo.toString('base64')}`,
            active:client.active
        }));
        res.json({ events:eventss });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
}

exports.get_all_services=async (req, res) => {
    try {
        const events = await Service.find({active:true,delete:false}); // Fetch all events
        const eventss = events.map(client => ({
            id: client._id,
            title: client.name,
            status: client.description,
            active:client.active,
            image: `data:image/png;base64,${client.photo.toString('base64')}`,
        }));
        res.json({ events: eventss});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
}

exports.change_status=async (req, res) => {

    const { event_id, status,user_id } = req.body;
    console.log(status)
    const userExists = await User.findById(user_id); // Find user by ID
        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }
    try {

        const event = await Service.findById(event_id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.active = status; // Toggle the status
        await event.save();
        res.json({ message: `Event status updated to ${status ? 'active' : 'inactive'}` });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update status', error: error.message });
    }
}
    exports.delete_status=async (req, res) => {
        
        const { event_id,user_id } = req.body;
        console.log(1);
        const userExists = await User.findById(user_id); // Find user by ID
            if (!userExists) {
                console.log(2);
                return res.status(400).json({ message: 'Unauthorized User' });
            }
        try {
            console.log(3);
            const event = await Service.findById(event_id);
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            console.log(4);
            event.delete = true; // Toggle the status
            console.log(5);
            await event.save();
            console.log(6);
            res.json({ message: `DELETED` });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update status', error: error.message });
        }
    }