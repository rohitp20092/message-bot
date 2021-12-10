const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res, next) => {
  console.log("in messages");
  let loadedMessages;
  fs.readFile('messages.json', (err, data) => {
    if (err) throw err;
  
    loadedMessages = JSON.parse(data);
    console.log(loadedMessages);
    res.json({loadedMessages});
  });
});

router.get('/:id', function(req, res, next) {
  let loadedMessages;
  fs.readFile('messages.json', (err, data) => {
    if (err) throw err;
  
    loadedMessages = JSON.parse(data);
    const message = loadedMessages.find(m => m["id"].toString() === req.params.id.toString());
    console.log(message);
    res.json({message});
  });
});

router.delete('/:id', function(req, res, next) {
  let loadedMessages;
  fs.readFile('messages.json', (err, data) => {
    if (err) throw err;
  
    loadedMessages = JSON.parse(data);
    const filteredMessages = loadedMessages.filter(m => m["id"].toString() !== req.params.id.toString());

    console.log(filteredMessages);
    res.json({filteredMessages});
  });
});

module.exports = router;
