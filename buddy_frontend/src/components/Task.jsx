import React from 'react';

export default function Task() {
  return (
    <div style={{ flex: 1, padding: '20px', maxWidth: '400px'}}>
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Name: </label>
          <input
            style={{ backgroundColor: '#f0f0f0', color: '#000' }}
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            style={{ backgroundColor: '#f0f0f0', color: '#000', minHeight: '100px', padding: '0.5rem' }}
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Date: </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Time:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  
  );
}