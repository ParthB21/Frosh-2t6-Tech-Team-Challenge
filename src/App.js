import { useState } from 'react';
// Import the schedule data from the JSON file — you can use it like a regular JS array
import scheduleData from './schedule_data.json';

// TODO: Build your Frosh Week Schedule page here

function formatTime(timeString) {
  if (timeString.slice(-2) === 'AM' || timeString.slice(-2) === 'PM' || timeString === " "){
    return timeString; // Already in 12-hour format or empty, return as is
  }

  timeString = timeString.slice(0, 5); // Remove seconds
  const [hour, minute] = timeString.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

function App() {
  const [expandedEvent, setExpandedEvent] = useState(null);

  return (
    <div>
      <h1>Good Luck, Applicant!</h1>

      <p>Frosh Week Schedule</p>
      <p>Find out what's in store for you!</p>

            {Object.entries(scheduleData).map(([day, events]) => (
        <div key={day}>
          <h2>{day}</h2>

          <div>
            {events.map((event, index) => {
            const eventID = `${day}-${index}`;
            const isExpanded = expandedEvent === eventID;

            return (
              <button
                className="event-button"
                key={index}
                onClick={() => setExpandedEvent(isExpanded ? null : eventID)}
                style={{ backgroundColor: event["Color"] }}
              >
                <strong>{event["Event Name"]}</strong>

                <br />

                {formatTime(event["Start Time"])} - {" " + formatTime(event["End Time"])}
                
                {/* Show additional details if the event is expanded */}
                {isExpanded && (
                  <div>
                    {event["Event Description"] && <p>{event["Event Description"]}</p>}

                    {event["Event Location"] && (<p>Location: {event["Event Location"]}</p>)}
                  </div>
                )}
              </button>
            );

          })}
          </div>
        </div>
      ))}

    </div>
  );
}

export default App;
