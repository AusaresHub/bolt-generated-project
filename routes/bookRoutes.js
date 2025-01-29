const express = require('express');
const { getBookDetails } = require('../models/Book');

const router = express.Router();

router.get('/details', async (req, res) => {
  const book = await getBookDetails();
  res.status(200).send(book);
});

module.exports = router;
