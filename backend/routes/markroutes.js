const express = require('express');
const router  = express.Router();
const { Parser } = require('json2csv');
const Bookmark = require('../models/bookmark');


router.post('/', async (req, res) => {
  try {
    const newBookmark = new Bookmark(req.body);
    const saved      = await newBookmark.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find().sort({ date: -1 });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/csv', async (req, res) => {
  try {
   
    const bookmarks = await Bookmark.find().sort({ date: -1 }).lean();

    const fields = ['url', 'date', 'notes', 'tags'];
    const opts   = { fields, transforms: [

      (item) => ({
        ...item,
        date: new Date(item.date).toLocaleString(),
        tags: item.tags.join(', ')
      })
    ]};
    const parser = new Parser(opts);
    const csv    = parser.parse(bookmarks);

    res.header('Content-Type', 'text/csv');
    res.attachment('bookmarks.csv');
    res.send(csv);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
