const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/user.js');

module.exports = router;

router.get('/sign-up', (req, res) => {
    res.render('sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
    const userInDb = await User.findOne({username: req.body.username});
    if (userInDb) {
        return res.send('Username already taken.');
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.send('Passwords must match!');
    }

    if (!req.body.username || !req.body.password || !req.body.confirmPassword) {
        return res.render('sign-up.ejs');
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    res.redirect('/');
});

router.get('/sign-in', (req, res) => {
    res.render('sign-in.ejs');
});

router.post('/sign-in', async (req, res) => {
    const userInDb = await User.findOne({username: req.body.username});
    if (!userInDb) {
        return res.send('Login failed. Please try again.');
    }

    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDb.password
    );
    if (!validPassword) {
        return res.send('Login failed. Please try again.');
    }

    if (!req.body.username || !req.body.password) {
        res.render('sign-in.ejs');
    }

    req.session.user = {
        username: userInDb.username,
    };

    res.redirect('/');
});

router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});