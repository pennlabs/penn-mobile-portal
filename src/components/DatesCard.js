import React, { useState } from 'react';
import { DatePicker, DatePickerInput, TimePicker, TimePickerSelect, SelectItem } from 'carbon-components-react';
import moment from 'moment'; 

const DatesCard = ( {updateStartDate, updateEndDate} ) => {
  //startDate and endDate initialized to today
  const [data, setData] = useState({startDate: new Date(), endDate: new Date(), startTime: "12:00", endTime: "12:00", startTimeMode: "AM", endTimeMode: "AM"})
  const [invalidStart, setInvalidStart] = useState(false);
  const [invalidEnd, setInvalidEnd] = useState(false);

  const handleStartDate = e => {
    const date = new Date(e);
    //updates startDate if valid date, else sets startDate to null
    if (isFinite(date)) {
      setData({
        ...data,
        startDate: date,
      })
      updateStartDate(date);
    } else {
      setData({
        ...data,
        startDate: new Date(),
      })
      updateStartDate(null);
    }
  }

  const handleEndDate = (e) => {
    const date = new Date(e);
    //updates endDate if valid date, else sets endDate to null
    if (isFinite(date)) {
      setData({
        ...data,
        endDate: date,
      })
      updateEndDate(date);
    } else {
      updateEndDate(null);
    }
  }

  const handleStartTime = (time, mode) => {
    const formatted = time + ' ' + mode; //mode = AM or PM

    if (!moment(formatted, 'h:mm A', true).isValid()) { //input is not in valid 12-hr format
      setInvalidStart(true);
      setData({
        ...data,
        startMode: mode,
      })
    } else {
      setInvalidStart(false);
      //appends new time (12hr format) to startDate
      let newDate = data.startDate.toDateString() + ' ' + moment(formatted, 'h:mm A').format("HH:mm");
      setData({
        ...data,
        startMode: mode,
        startTime: time,
        startDate: new Date(newDate)
      })
      updateStartDate(new Date(newDate))
    }
  }

  const handleEndTime = (time, mode) => {
    const formatted = time + ' ' + mode;

    if (!moment(formatted, 'h:mm A', true).isValid()) {
      setInvalidEnd(true);
      setData({
        ...data,
        endMode: mode,
      })
    } else {
      setInvalidEnd(false);
      let newDate = data.endDate.toDateString() + ' ' + moment(formatted, 'h:mm A').format("HH:mm");
      setData({
        ...data,
        endMode: mode,
        endTime: time,
        endDate: new Date(newDate)
      })
      updateEndDate(new Date(newDate))
    }
  }

  return (
    <>
    <div className="date">
    <div className="card" style={{borderRadius: 10, margin:"30px 0px 0px 91px", boxShadow: "0 0 8px 3px #d9d9d9", marginTop:16, padding:"18px 18px 18px 18px"}}>      
    <div className="columns" style={{display: "flex"}}>
      <div className="column">
      <DatePicker dateFormat="m/d/Y" datePickerType="single" minDate={new Date().toISOString()} //start date must be after current day
        onChange={e => handleStartDate(e)} style={{ textAlign: "left", fontFamily: "inherit" }} >
        <DatePickerInput id="date-picker-start" placeholder="mm/dd/yyyy" labelText="Start Date" type="text"
          style={{fontFamily: "inherit", borderBottom: "none" }}/>
      </DatePicker>
      </div>

      <div className="column">
      <TimePicker id="time-picker-from" labelText="Start Time" 
        value={data.startTime} invalid={invalidStart} invalidText="Invalid time." 
        onChange={e => handleStartTime(e.target.value, data.startTimeMode)}
        style={{fontFamily: "inherit", borderBottom: "none"}} >
          <TimePickerSelect id="time-picker-select-1" labelText="AMPM" 
            onChange={e => handleStartTime(data.startTime, e.target.value)}
            style={{fontFamily: "inherit", borderBottom: "none"}} >
            <SelectItem value="AM" text="AM" />
            <SelectItem value="PM" text="PM" />
          </TimePickerSelect>
      </TimePicker>
      </div>
    </div>

    <div className="columns" style={{display: "flex"}}>
      <div className="column">
      <DatePicker dateFormat="m/d/Y" datePickerType="single" minDate={data.startDate.toISOString()} //end date must be after start date
        onChange={e => handleEndDate(e)} style={{ textAlign: "left" }} >
        <DatePickerInput id="date-picker-end" placeholder="mm/dd/yyyy" labelText="End Date" type="text"
          style={{fontFamily: "inherit", borderBottom: "none"}} />
      </DatePicker>
      </div>

      <div className="column">
      <TimePicker id="time-picker-to" labelText="End Time" value={data.endTime}
        invalid={invalidEnd} invalidText="Invalid time."
        onChange={e => handleEndTime(e.target.value, data.endTimeMode)}
        style={{fontFamily: "inherit", borderBottom: "none"}} >
          <TimePickerSelect id="time-picker-select-2" labelText="AMPM" onChange={e => handleEndTime(data.endTime, e.target.value)}
          style={{fontFamily: "inherit", borderBottom: "none"}}>
            <SelectItem value="AM" text="AM" />
            <SelectItem value="PM" text="PM" />
          </TimePickerSelect>
        </TimePicker>
      </div>
    </div>
    </div>
    </div>
    </>
  )

}

export default DatesCard