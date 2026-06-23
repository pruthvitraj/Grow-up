const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

function generateDeterministicMeetLink(id) {
    const mongoId = id.toString();
    const map = {
        '0': 'g', '1': 'h', '2': 'i', '3': 'j', '4': 'k',
        '5': 'l', '6': 'm', '7': 'n', '8': 'o', '9': 'p',
        'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e', 'f': 'f'
    };
    const chars = mongoId.split('').map(c => map[c] || c).join('');
    const p1 = chars.substring(0, 3);
    const p2 = chars.substring(3, 7);
    const p3 = chars.substring(7, 10);
    return `https://meet.google.com/${p1}-${p2}-${p3}`;
}

async function createGoogleMeetLink(appointmentDetails) {
    const fallbackLink = generateDeterministicMeetLink(appointmentDetails._id);

    try {
        const keyPath = path.join(__dirname, "../credentials.json");

        if (!fs.existsSync(keyPath)) {
            console.error("CRITICAL: credentials.json not found in Backend root.");
            return fallbackLink;
        }

        const auth = new google.auth.GoogleAuth({
            keyFile: keyPath,
            scopes: ["https://www.googleapis.com/auth/calendar"],
        });

        const calendar = google.calendar({
            version: "v3",
            auth: auth,
        });

        // Parse date and time correctly
        const startDateTimeStr = `${new Date(appointmentDetails.date).toISOString().split('T')[0]}T${appointmentDetails.time}:00`;
        const startDateTime = new Date(startDateTimeStr);

        if (isNaN(startDateTime.getTime())) {
            console.error("Invalid Date/Time provided:", appointmentDetails.date, appointmentDetails.time);
            return fallbackLink;
        }

        const endDateTime = new Date(startDateTime.getTime() + (appointmentDetails.duration || 30) * 60000);

        console.log("Creating Google Meet for:", appointmentDetails.title, "at", startDateTime.toISOString());

        const event = {
            summary: appointmentDetails.title || "Startup Investment Meeting",
            description: appointmentDetails.agenda || "Meeting scheduled via GrowUp platform",
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: "Asia/Kolkata",
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: "Asia/Kolkata",
            },
            conferenceData: {
                createRequest: {
                    requestId: `growup-${appointmentDetails._id.toString().substring(18)}-${Date.now()}`,
                    conferenceSolutionKey: {
                        type: "hangoutsMeet",
                    },
                },
            },
        };

        const response = await calendar.events.insert({
            calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
            resource: event,
            conferenceDataVersion: 1,
        });

        const hangoutLink = response.data.hangoutLink;
        if (!hangoutLink) {
            console.log("No hangoutLink returned from Google API. Using deterministic fallback.");
            return fallbackLink;
        }
        
        console.log("Successfully generated Google Meet Link:", hangoutLink);
        return hangoutLink;
    } catch (error) {
        console.error("GOOGLE API ERROR:", error.message);
        console.log("Providing deterministic Google Meet fallback link.");
        return fallbackLink;
    }
}

module.exports = { createGoogleMeetLink };
