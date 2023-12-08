import './App.css';
import React, { useState } from "react";
import Dropzone from "./components/Dropzone.js";
import Popup from 'react-popup';

function App() {
  const [data, setData] = React.useState(null)
  const [currSnooze, setCurrSnooze] = useState(0)
  const [currAlarm, setCurrAlarm] = useState('')
  const [alarmTime, setAlarmTime] = useState('')
  const [snoozeDuration, setSnoozeDuration] = useState(10)

  React.useEffect(() => {
    fetch('/all-settings')
      .then((res) => res.json())
      .then((data) => {
        setData(data.alarm)})
  }, [])

  const handleTimeChange = (e) => {
    setCurrAlarm(e.target.value)
  }

  const handleDropdownChange = (e) => {
    setCurrSnooze(Number(e.target.value))
  }

  const handleSubmit = () => {
    setSnoozeDuration(currSnooze)
  }

  const handleSetAlarm = async () => {
    if (!tooSoon()) {
      setAlarmTime(currAlarm)
      try {
        const response = await fetch('http://localhost:3001/api/alarm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currAlarm }),
        });
      } catch (error) {
        console.error('Error saving alarm time:', error);
      }
      console.log(currAlarm)
    } else {
      Popup.alert('Alarm time cannot be in the next 10 minutes!')
    }
  }

  function calcTime(time) {
    const timeSplit = time.split(":")
    var hours = parseInt(timeSplit[0])
    var minutes = timeSplit[1]
    var meridian = ''
    if (hours > 12) {
      meridian = 'PM'
      hours -= 12
    } else if (hours < 12) {
      meridian = 'AM'
      hours = hours
      if (hours == 0) {
        hours = 12
      }
    } else {
      meridian = 'PM'
    }
    return hours + ':' + minutes + ' ' + meridian
  }

  const tooSoon = () => {
    if (!currAlarm) {
      return false
    }
    const now = new Date()
    const alarm = new Date(`${now.toDateString()} ${currAlarm}`)
    const minDiff = (alarm - now) / (1000 * 60)
    return minDiff > 0 && minDiff <= 10
  }

  return (
    <div className='page'>
      <Popup />
      <div className='top'>
        <p>{!data ? "Loading..." : data}</p>
        <p className='smallText' id='top'>NEXT WAKE UP...</p>
        <p className='biggestText'>{alarmTime ? calcTime(alarmTime) : 'None'}</p>
      </div>
      <div className='cards'>
        <div className='card'>
          <p className='smallText'>ALARM TIME</p>
          <div>
        <input
          type="time"
          id="alarmTime"
          value={currAlarm}
          onChange={handleTimeChange}
        />
      <button onClick={handleSetAlarm}>Set</button>
      </div>
          <p id="alarm">Alarm: <strong>{alarmTime ?  calcTime(alarmTime) : 'No alarm set!'}</strong></p>
        </div>
        <div className='card'>
          <p className='smallText'>SONG SELECTION</p>
          <Dropzone/>
        </div>
        <div className='card'>
          <p className='smallText'>SNOOZE DURATION</p>
          <div>
        <select id='snoozeTime' value={currSnooze} onChange={handleDropdownChange}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <option className='test' key={value} value={value}>
              {value}
            </option>  
          ))}
        </select> minutes
      <button type="submit" onClick={handleSubmit}>Set</button>
      </div>
        <div className='currentSetting'>
          Snooze duration: <strong>{snoozeDuration} min</strong>
        </div>
        </div>
      </div>
    </div>
  )
}

export default App