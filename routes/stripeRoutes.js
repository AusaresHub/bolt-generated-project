const express = require('express');
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
