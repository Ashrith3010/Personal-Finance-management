import React from 'react';

function DateSelector({ startDate, endDate, onStartDateChange, onEndDateChange }) {
  return (
    <div>
      <label>
        Start Date:
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => onStartDateChange(e.target.value)} 
        />
      </label>
      <label>
        End Date:
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => onEndDateChange(e.target.value)} 
        />
      </label>
    </div>
  );
}

export default DateSelector;