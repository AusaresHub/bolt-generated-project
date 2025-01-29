require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(bodyParser.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const stripeRoutes = require('./routes/stripeRoutes');

app.use('/auth', authRoutes);
app.use('/book', bookRoutes);
app.use('/stripe', stripeRoutes);

// User route to fetch user data
app.get('/auth/user', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
</boltArtifact>
  
  <boltArtifact id="book-release-app" title="Book Release Application">
  <boltAction type="file" filePath="routes/authRoutes.js">const express = require('express');
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
</boltArtifact>
  
  <boltArtifact id="book-release-app" title="Book Release Application">
  <boltAction type="file" filePath="routes/stripeRoutes.js">const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sgMail = require('@sendgrid/mail');
const { createMembership, getMembershipByUserId } = require('../models/Membership');

const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  const { userId } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'The Philosophy of Ma\'at and the Resurrection of Wosir',
          },
          unit_amount: 2000, // $20.00
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/success`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    client_reference_id: userId,
  });
  res.json({ id: session.id });
});

router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const userMembership = await getMembershipByUserId(userId);
    if (!userMembership) {
      await createMembership(userId);
    }

    const msg = {
      to: session.customer_details.email,
      from: 'noreply@worldcommunity.com',
      subject: 'Thank you for your purchase!',
      text: 'You have successfully purchased "The Philosophy of Ma\'at and the Resurrection of Wosir". Welcome to the WorldCommunity!',
      html: '<strong>You have successfully purchased "The Philosophy of Ma\'at and the Resurrection of Wosir". Welcome to the WorldCommunity!</strong>',
    };
    await sgMail.send(msg);
  }

  res.json({ received: true });
});

module.exports = router;
</boltArtifact>
  
  <boltAction type="shell">npm install dotenv
