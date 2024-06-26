const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const methodOverride = require('method-override');
const path = require('path');
const Player = require('./model/playerSchema.js');
const authController = require('./controllers/auth.js');
const session = require('express-session');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use('/auth', authController);

mongoose.connect(process.env.MONGODB_URI);

app.listen(3030, () => {
    console.log('Working fine!');
});

app.get('/', (req, res) => {
    res.render('homePage.ejs', {
        user: req.session.user,
    });
});

app.get('/roster', async (req, res) => {
    const fullRoster = await Player.find();
    res.render('roster.ejs', {
        fullRoster: fullRoster,
    });
});

app.get('/schedule', (req, res) => {
    res.render('schedule.ejs');
});

app.get('/roster/newPlayer', (req, res) => {
    res.render('newPlayer.ejs');
});

app.post('/roster', async (req, res) => {
    await Player.create(req.body);
    res.redirect('/roster');
});

app.put('/roster/:playerId', async (req, res) => {
    await Player.findByIdAndUpdate(req.params.playerId, req.body);
    res.redirect('/roster');
});

app.delete('/roster/:playerId', async (req, res) => {
    await Player.findByIdAndDelete(req.params.playerId);
    res.redirect('/roster'); 
});

app.get('/roster/:playerId', async (req, res) => {
    const selectedPlayer = await Player.findById(req.params.playerId);
    res.render('show.ejs', {
        selPlayer: selectedPlayer,
    });
});

app.get('/roster/:playerId/edit', async (req, res) => {
    const selectedPlayer = await Player.findById(req.params.playerId);
    res.render('edit.ejs', {
        selPlayer: selectedPlayer,
    });
});