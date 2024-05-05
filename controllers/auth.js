const express = require('express');
const router = express.Router();
const User = require('../model/user.js');

module.exports = router;

router.get('/sign-up', (req, res) => {
    res.render('sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
    const userInDb = await user.findOne({username: req.body.username});
    if (userInDb) {
        return res.send('Username already taken.');
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.send('Passwords must match!');
    }


    const user = await User.create(req.body);
    res.send('Thanks for signing up!');
});