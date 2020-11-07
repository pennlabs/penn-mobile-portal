import React, { useState } from 'react';
import { DatePicker, DatePickerInput, TimePicker, TimePickerSelect, SelectItem } from 'carbon-components-react';
import moment from 'moment'; 
import 'carbon-components/css/carbon-components.min.css';

const DatesCard = ( {updateStartDate, updateEndDate} ) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState("12:00")
  const [endTime, setEndTime] = useState("12:00")
  const [invalidStart, setInvalidStart] = useState(false);
  const [invalidEnd, setInvalidEnd] = useState(false);
  const [startTimeMode, setStartTimeMode] = useState("AM");
  const [endTimeMode, setEndTimeMode] = useState("PM");

  const handleStartDate = e => {
    const date = new Date(e);
    if (isFinite(date)) {
      setStartDate(date);
      updateStartDate(date);
    } else {
      setStartDate(new Date());
    }
  }

  const handleEndDate = (e) => {
    const date = new Date(e);
    if (isFinite(date)) {
      setEndDate(new Date(e));
      updateEndDate(new Date(e));
    }
  }

  const handleStartTime = (time, mode) => {
    let formatted = time + ' ' + mode;

    setStartTimeMode(mode);
    if (!moment(formatted, 'h:mm A', true).isValid()) {
      setInvalidStart(true);
    } else {
      setStartTime(time);
      setInvalidStart(false);
      let newDate = startDate.toDateString() + ' ' + moment(formatted, 'h:mm A').format("HH:mm");
      setStartDate(new Date(newDate))
      updateStartDate(new Date(newDate))
    }
  }

  const handleEndTime = (time, mode) => {
    let formatted = time + ' ' + mode;

    setEndTimeMode(mode)
    if (!moment(formatted, 'h:mm A', true).isValid()) {
      setInvalidEnd(true);
    } else {
      setEndTime(time);
      setInvalidEnd(false);
      let newDate = endDate.toDateString() + ' ' + moment(formatted, 'h:mm A').format("HH:mm");
      setEndDate(new Date(newDate))
      updateEndDate(new Date(newDate))
    }
  }

  return (
    <>
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
        value={startTime} invalid={invalidStart} invalidText="Invalid time." 
        onChange={e => handleStartTime(e.target.value, startTimeMode)}
        style={{fontFamily: "inherit", borderBottom: "none"}} >
          <TimePickerSelect id="time-picker-select-1" labelText="AMPM" 
            onChange={e => handleStartTime(startTime, e.target.value)}
            style={{fontFamily: "inherit", borderBottom: "none"}} >
            <SelectItem value="AM" text="AM" />
            <SelectItem value="PM" text="PM" />
          </TimePickerSelect>
      </TimePicker>
      </div>
    </div>
    <div className="columns" style={{display: "flex"}}>
      <div className="column">
      <DatePicker dateFormat="m/d/Y" datePickerType="single" minDate={startDate.toISOString()} //start date must be after current day
        onChange={e => handleEndDate(e)} style={{ textAlign: "left" }} >
        <DatePickerInput id="date-picker-end" placeholder="mm/dd/yyyy" labelText="End Date" type="text"
          style={{fontFamily: "inherit", borderBottom: "none"}} />
      </DatePicker>
      </div>
      <div className="column">
      <TimePicker id="time-picker-to" labelText="End Time" value={endTime}
        invalid={invalidEnd} invalidText="Invalid time."
        onChange={e => handleEndTime(e.target.value, endTimeMode)}
        style={{fontFamily: "inherit", borderBottom: "none"}} >
          <TimePickerSelect id="time-picker-select-2" labelText="AMPM" onChange={e => handleEndTime(endTime, e.target.value)}
          style={{fontFamily: "inherit", borderBottom: "none"}}>
            <SelectItem value="AM" text="AM" />
            <SelectItem value="PM" text="PM" />
          </TimePickerSelect>
        </TimePicker>
      </div>
    </div>
    </div>
    </>
  )

}

export default DatesCard