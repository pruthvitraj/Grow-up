// routes/registerRoute.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.post('/',
    [
        check('name').notEmpty().withMessage("Name is required"),

        check('email')
            .isEmail()
            .withMessage("Enter a valid email"),

        check('phone')
            .matches(/^[0-9]{10}$/)
            .withMessage("Phone must be 10 digits"),

        check('password')
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
    ],
    async (req, res) => {

        console.log("Incoming data:", req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { name, email, phone, password } = req.body;

        try {
            // Check existing user
            let user = await User.findOne({ email });
            if (user)
                return res.status(400).json({ msg: 'User already exists' });

            // Create new user
            user = new User({ name, email, phone, password });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            // Create token
            const payload = { id: user._id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }
            });

        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    }
);

// -------------------------
// Select Role
// -------------------------
router.post('/select-role', auth, [
    check('role').isIn(['investor', 'founder'])
], async (req, res) => {
    const { role } = req.body;

    try {
        const user = req.user;

        if (user.role)
            return res.status(400).json({ msg: 'Role already selected' });

        user.role = role;
        await user.save();

        res.json({ msg: 'Role selected', role: user.role });

    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
