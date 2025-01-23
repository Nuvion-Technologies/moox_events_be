const Service = require('../models/gallery');
const User = require('../models/user');
const mongoose = require('mongoose');

// Maximum allowed photo size in bytes (e.g., 5MB)
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

exports.add_service = async (req, res) => {
    try {
        let { user_id} = req.body;

        // Check for user existence and authorization
        const userExists = await User.findById(user_id); // Find user by ID

        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }
        const { name, active,description } = req.body;
        const { photo } = req.body; // Assuming photo is sent as a file (multipart/form-data)

        if (!photo) {
            return res.status(400).json({ message: 'Photo is required.' });
        }
        const newClient = new Service({
    title:name,
            description,
    photo: Buffer.from(photo, 'base64'), // Convert Base64 string to Buffer
    contentType: 'image/png', // Or dynamically derive this based on the photo content
    active,
});

        await newClient.save();

        res.status(201).json({ message: 'Client added successfully.', client: newClient });
    } catch (error) {
        res.status(500).json({ message: 'Error adding client.', error: error.message });
    }
};

exports.get_services=async (req, res) => {
    try {

        let { user_id } = req.body;
        const userExists = await User.findById(user_id); // Find user by ID
        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }
        const clients = await Service.find({delete:false}, 'name photo active _id');
        const clientsWithPhotos = clients.map(client => ({
            _id: client._id,
            name: client.name,
            description: client.description,
            active: client.active,
            logo: `data:${client.contentType};base64,${client.photo.toString('base64')}`,
        }));

        res.status(200).json({ clients: clientsWithPhotos });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clients.', error: error.message });
    }
}

exports.get_active_services=async (req, res) => {
    try {


        const clients = await Service.find({active:true,delete:false}, 'name description photo active _id');
        const clientsWithPhotos = clients.map(client => ({

            name: client.name,
            description: client.description,

            logo: `data:${client.contentType};base64,${client.photo.toString('base64')}`,
        }));

        res.status(200).json({ clients: clientsWithPhotos });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clients.', error: error.message });
    }
}

exports.change_status=async (req, res) => {
    const { event_id, status,user_id } = req.body;

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

exports.delete_gallery=async (req, res) => {
    
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