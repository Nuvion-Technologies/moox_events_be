const ContactUs = require("../models/enquiry");
const User = require('../models/user');
const mongoose = require("mongoose");

exports.getEnquiry = async (req, res) => {
    const { user_id } = req.body;
    const userExists = await User.findById(user_id);
    if (!userExists) {
        return res.status(400).json({ message: 'Unauthorized User' });
    }

    // Fetch queries and populate purpose_name
    const queries = await ContactUs.find();
    res.status(200).json({ queries });
}

exports.change_enquiry_status = async (req, res) => {
    try {
        const { event_id, user_id } = req.body;

        const userExists = await User.findById(user_id);
        if (!userExists) {
            return res.status(400).json({ message: 'Unauthorized User' });
        }

        const query = await ContactUs.findById(event_id);
        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }

        query.active = false;
        query.resolvedOn = Date.now();
        await query.save();

        res.json({ message: `Query Resolved` });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update status.', error: error.message });
    }
};

exports.add_enquiry = async (req, res) => {
    const { name, mobileno, email, purpose_id, purpose_name, message } = req.body;

    const newQuery = new ContactUs({
        name,
        mobileno,
        email,
        purpose_id,
        purpose_name,
        message
    });

    await newQuery.save();
    res.status(201).json({ message: 'Query added successfully.' });
}
