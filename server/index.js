const path = require('path');
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.static(path.resolve(__dirname, '../client/build')));

var currAlarm = "15:20";
var currSnooze = 5;
var wav = "wavywav"

app.get('/all-settings', (req, res) => {
    res.json({
        alarm: currAlarm, 
        snooze: currSnooze, 
        file: wav
    });
  });

app.post('/api/alarm', (req, res) => {
    const { selectedTime } = req.body;
    console.log('Selected Time:', selectedTime);
    res.json({ success: true }); // Respond with a success message
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
  
app.listen(PORT, () => {
console.log(`Server listening on ${PORT}`);
});