
const Career = require('../models/Career');
const Application = require('../models/Application');
const User = require("../models/user");
const mongoose = require("mongoose");

exports.all = async (req, res) => {
    try {
        const { user_id } = req.body;
        const userExists = await User.findById(user_id); // Find user by ID
        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }
        const events = await Career.find(); // Fetch all events
        res.json({ events });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add position' });
    }
};

exports.active_career = async (req, res) => {
    try {
        const events = await Career.find({active:true}); // Fetch all events

        res.json({ events });

    } catch (error) {
        res.status(500).json({ error: 'Failed to add position' });
    }
};

// Add a new career position
exports.addpos = async (req, res) => {
    try {
        const { position_name,location, description, requirements,user_id } = req.body;
        const userExists = await User.findById(user_id); // Find user by ID
        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }
        const newCareer = new Career({ position_name,location, description, requirements });
        await newCareer.save();
        res.status(201).json({ message: 'Position added successfully', position: newCareer });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add position' });
    }
};

// Fetch all applications for a position
exports.application_pos= async (req, res) => {
    try {
        const { position_id,user_id } = req.body;
        const userExists = await User.findById(user_id); // Find user by ID
        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }
        const applications = await Application.find({ position_id }).populate('position_id');
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};

// Toggle career position active status
exports.status_career= async (req, res) => {
    try {
        const { id ,user_id} = req.body;
        const userExists = await User.findById(user_id); // Find user by ID
        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }
        const career = await Career.findById(id);
        if (!career) return res.status(404).json({ error: 'Position not found' });
        career.active = !career.active;
        await career.save();
        res.status(200).json({ message: 'Position status updated', position: career });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update status' });
    }
};

// Apply for a career position
exports.apply_pos= async (req, res) => {
    try {
        const { user_id, position_id, name, email,mobileno } = req.body;



        const newApplication = new Application({ position_id, name, email, mobile:mobileno });

        await newApplication.save();

        res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit application' });
    }
};