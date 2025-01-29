const express = require('express');
const passport = require('passport');
const { createUser, getUserByEmail, getUserByOAuthId } = require('../models/User');

const router = express.Router();

// Google OAuth
passport.use(new (require('passport-google-oauth20').Strategy)({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const user = await getUserByOAuthId(profile.id, 'google');
  if (user) {
    return done(null, user);
  }
  const newUser = await createUser(profile.emails[0].value, profile.displayName, profile.id, 'google');
  done(null, newUser);
}));

// Facebook OAuth
passport.use(new (require('passport-facebook').Strategy)({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
  const user = await getUserByOAuthId(profile.id, 'facebook');
  if (user) {
    return done(null, user);
  }
  const newUser = await createUser(profile.emails[0].value, profile.displayName, profile.id, 'facebook');
  done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const values = [id];
  const result = await pool.query(query, values);
  done(null, result.rows[0]);
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
});

router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
});

router.post('/signup', async (req, res) => {
  const { email, name } = req.body;
  const user = await getUserByEmail(email);
  if (user) {
    return res.status(400).send('User already exists');
  }
  const newUser = await createUser(email, name, null, 'email');
  res.status(201).send(newUser);
});

module.exports = router;
