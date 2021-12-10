const express = require('express');
const app = express();
const server = require('http').createServer(app);
const PORT = 8080;
const cors = require('cors')
const options = { cors: { origin: '*' } };
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration')
const messagesRoute = require('./routes/messages');
const fs = require('fs');

dayjs.extend(duration);

app.use(cors());
app.use('/api/v1/messages', messagesRoute);

const io = require('socket.io')(server, options);
const messages = [];

io.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */
  console.log('new client connected');
  socket.emit('connection', null);
  let disconnect = false;
  socket.on('new-msg', (data) => {
    messages.push(data);
    let reply = {};
    if (data["id"] === 1) {
      reply = { id: data["id"] + 1, text: 'Enter your name'};
    }
    if (data["id"] === 3) {
      reply = { id: data["id"] + 1, text: 'Enter your birth date'};
    }
    if (data["id"] === 5) {
      reply = { id: data["id"] + 1, text: 'Do you want to know how many days till your next birthday \n' +
      '<button name="button" id="yes">yes</button> <button name="button" id="no">no</button>'}
    }
    if (data["id"] === 0 ) {
      if (data["text"] === "yesBtnPressed") {
        let dob = messages.find(m => m['id'] === 5)['text'];
        console.log("dob--------", dayjs(dob).isValid());
        if (!dayjs(dob).isValid()) {
          reply = { id: data["count"] + 1, text: 'invalid date'};
        } else {
          const diff = daysUntil(dob);
          reply = { id: data["count"] + 1, text: "There are " + diff + " days left until your next birthday"};
        }
      }
      if (data["text"] === "noBtnPressed") {
        reply = { id: data["id"] + 1, text: 'Good Bye'};
      }
      disconnect = true;
    }
    messages.push(reply);
    socket.emit('reply-msg', reply['text']);
    if (disconnect) socket.disconnect();
    fs.writeFile('messages.json', JSON.stringify(messages), (err) => {  
      if (err) throw err;
  
      console.log('Messages saved!');
    });  
    console.log(messages);
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

function daysUntil(date) {
  let birthday = dayjs(date);
  
  let today = dayjs().format("YYYY-MM-DD");
  let age = dayjs(today).diff(birthday, 'years');
  dayjs(age).format("YYYY-MM-DD");
  
  let nextBirthday = dayjs(birthday).add(age, 'year');
  dayjs(nextBirthday).format("YYYY-MM-DD");

  if (nextBirthday.isSame(today)) {
    return 0;
  } else {
    nextBirthday = dayjs(birthday).add(age + 1, 'year');
    console.log("inside", nextBirthday);
    const days = dayjs.duration(nextBirthday.diff(today)).asDays();
    return days;
  }
}
