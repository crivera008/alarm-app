const path = require('path');
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
  destination: (req, file, cb) => {
    const uploadFolder = path.join(__dirname, '/uploads/');
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }
    const existingFiles = fs.readdirSync(uploadFolder);
    if (existingFiles.length > 0) {
      existingFiles.forEach(existingFile => {
        const filePath = path.join(uploadFolder, existingFile);
        fs.unlinkSync(filePath);
      });
    }

    cb(null, uploadFolder);
  },
})

const upload = multer({ 
    storage: storage, 
    limits: { fileSize: 50 * 1000 * 1000 }
});

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(cors());
app.use(bodyParser.json());

var currAlarm = "";
var currSnooze = 10;
var currFileName = "";

app.get('/all-settings', (req, res) => {
    res.json({
        alarm: currAlarm,
        snooze: currSnooze,
        songname: currFileName
    });
  });

app.post('/snooze', (req, res) => {
    currSnooze = parseInt(req.body.snooze);
    message = 'Snooze time saved successfully: ' + currSnooze
    res.send(message);
});

app.post('/alarm', (req, res) => {
    currAlarm = req.body.alarm;
    console.log(currAlarm);
    message = 'Alarm time saved successfully: ' + currAlarm
    res.send(message);
});

app.post('/upload', upload.single('file'), 
    (req, res) => {
    console.log(req.file);
    currFileName = req.file.filename;
  })

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
  
app.listen(PORT, () => {
console.log(`Server listening on ${PORT}`);
});