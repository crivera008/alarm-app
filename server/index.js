const path = require('path');
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.static(path.resolve(__dirname, '../client/build')));

var currAlarm = "15:20";
var currSnooze = 5;
var wav = "wavywav";

app.get('/all-settings', (req, res) => {
    res.json({
        snooze: currSnooze
    });
  });

app.post('/snooze', (req, res) => {
    const snooze = req.body;
    console.log('Snooze time: ', snooze);
    res.send('Snooze time saved successfully');
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
  
app.listen(PORT, () => {
console.log(`Server listening on ${PORT}`);
});