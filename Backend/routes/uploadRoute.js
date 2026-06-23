const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const auth = require('../middleware/auth');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'growup-chat-attachments',
        resource_type: 'auto',
    },
});

const upload = multer({ storage: storage });

router.post('/file', auth, (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error('Multer/Cloudinary Error:', err);
            return res.status(500).json({ message: 'Upload failed', error: err.message || err });
        }
        next();
    });
}, (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.status(200).json({
            url: req.file.path,
            type: req.file.mimetype,
            name: req.file.originalname
        });
    } catch (error) {
        console.error('Route handler error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
