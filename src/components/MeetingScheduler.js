import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // Make sure to install this library

import 'react-datepicker/dist/react-datepicker.css'; // Import the styles for the datepicker

const MeetingForm = () => {
  const [topic, setTopic] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [cohosts, setCohosts] = useState('');
  const [participants, setParticipants] = useState('');
  const [startDate, setStartDate] = useState(new Date());

  const handleSchedule = () => {
    // Implement your scheduling logic here
    console.log('Meeting Scheduled:', {
      topic,
      isRecurring,
      cohosts,
      participants,
      startDate,
    });
  };

  return (
    <form noValidate className="custom-form">
      <div className="form-group">
        <label>Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          maxLength={100}
          placeholder="YASH Gaur's JioMeet Meeting"
          className="ng-untouched ng-pristine ng-valid"
        />
      </div>

      <div className="form-group repeat-options">
        <div className="checkbox-wrapper">
          <div>
            <input
              type="checkbox"
              id="defaultUnchecked7"
              checked={isRecurring}
              onChange={() => setIsRecurring(!isRecurring)}
              className="ng-untouched ng-pristine ng-valid"
            />
            <label htmlFor="defaultUnchecked7" className="pointer">
              Recurring Meeting
            </label>
          </div>
        </div>
      </div>

      <hr className="divider mt-4 mb-4" />

      <div className="form-group">
        <label>Add Co-Host (Optional)</label>
        <input
          type="text"
          value={cohosts}
          onChange={(e) => setCohosts(e.target.value)}
          placeholder="Search by Name, Email ID or Mobile No (+91)"
          className="ng-untouched ng-pristine ng-valid"
        />
      </div>

      <div className="form-group">
        <label>Invite Participants (Optional)</label>
        <input
          type="text"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          placeholder="Search by Name, Email ID or Mobile No (+91)"
          className="ng-untouched ng-pristine ng-valid"
        />
      </div>

      <hr className="divider mt-4 mb-4" />

      <div className="form-group">
        <label>Meeting Date and Time</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          dateFormat="Pp"
        />
      </div>

      <div className="form-group d-flex justify-content-end popup-buttons">
        <button type="button" className="custom-button bg-secondary mr-2">
          Cancel
        </button>
        <button
          type="button"
          className="custom-button bg-primary mr-2"
          onClick={handleSchedule}
        >
          Schedule
        </button>
      </div>
    </form>
  );
};

export default MeetingForm;
