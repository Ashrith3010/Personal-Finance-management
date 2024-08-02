import React from 'react';

const DatePicker = ({ selectedDate, setSelectedDate }) => {
  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  return (
    <input
      type="date"
      value={selectedDate.toISOString().split('T')[0]}
      onChange={handleDateChange}
    />
  );
};

export default DatePicker;