const Appointment = require('../models/Appointment');

exports.requestMeeting = async (req, res) => {
    try {
        const { title, participantId, date, time, duration, type, agenda, meetingLink } = req.body;
        const hostId = req.user.id;

        const newAppointment = new Appointment({
            title,
            host: hostId,
            participant: participantId,
            date,
            time,
            duration,
            type,
            agenda,
            meetingLink
        });

        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Error scheduling meeting', error: error.message });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const appointments = await Appointment.find({
            $or: [{ host: userId }, { participant: userId }]
        }).populate('host participant', 'name email role')
            .sort({ date: 1, time: 1 });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
};

const { createGoogleMeetLink } = require('../utils/googleMeetUtils');

const User = require('../models/User');

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        let appointment = await Appointment.findById(id).populate('host participant');
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.status = status;

        // Auto-generate Google Meet link when accepted
        if (status === 'accepted' && appointment.type === 'Video Call' && !appointment.meetingLink) {
            // 1. Check if the participant (usually the one accepting) has a static meeting link
            if (appointment.participant && appointment.participant.meetingLink) {
                appointment.meetingLink = appointment.participant.meetingLink;
                appointment.linkSetAt = new Date();
                console.log("Using participant's static meeting link:", appointment.meetingLink);
            } 
            // 2. Otherwise check if the host has one
            else if (appointment.host && appointment.host.meetingLink) {
                appointment.meetingLink = appointment.host.meetingLink;
                appointment.linkSetAt = new Date();
                console.log("Using host's static meeting link:", appointment.meetingLink);
            }
            // 3. Last resort: Try to generate one (will use domestic fallback if API fails)
            else {
                const meetLink = await createGoogleMeetLink(appointment);
                if (meetLink) {
                    appointment.meetingLink = meetLink;
                    appointment.linkSetAt = new Date();
                }
            }
        }

        await appointment.save();
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};

exports.updateMeetingLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { meetingLink } = req.body;

        const appointment = await Appointment.findById(id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.meetingLink = meetingLink;
        appointment.linkSetAt = new Date();
        await appointment.save();

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating meeting link', error: error.message });
    }
};
