const Event=require('../models/Event');
const User=require('../models/User');

//Get all events
exports.getAllEvents = async (req, res) => {
    try{
        const filters={};
        if(req.query.category){
            filters.category= req.query.category;
        }
        if(req.query.ticketPrice){
            filters.ticketPrice= req.query.ticketPrice;
        }
        const events = await Event.find(filters);
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//Get event by id 
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//create event (admin only)
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, category, totalSeats, ticketPrice, imageUrl } = req.body;
        const event = new Event({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats: totalSeats,
            ticketPrice,
            imageUrl,
            createdBy: req.user._id
        });
        await event.save();
        res.status(201).json(event);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//update event (admin only)
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        } 
        const { title, description, date, location, category, totalSeats, ticketPrice, imageUrl } = req.body;
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.location = location || event.location;
        event.category = category || event.category;
        event.totalSeats = totalSeats || event.totalSeats;
        event.availableSeats = totalSeats || event.availableSeats;
        event.ticketPrice = ticketPrice || event.ticketPrice;
        event.imageUrl = imageUrl || event.imageUrl;
        await event.save();
        res.json(event);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//delete event (admin only)
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        await event.remove();
        res.json({ message: 'Event removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


