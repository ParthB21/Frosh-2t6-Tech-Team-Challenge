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

  const colorMap = {
    purple: "#9848c3",
    "dark-purple": "#732e8e",
    yellow: "#dbbb51",
    green: "#51840f",
    gray: "#a6a6a6"
  };

  return (
    <div>
      <div className="header">
        <h1>Welcome to Frosh Week!</h1>

        <p>
          Your week of chaos, friends,
          and engineering traditions begins here.
        </p>

        <p>Find out what's in store for you!</p>
      </div>


            {Object.entries(scheduleData).map(([day, events]) => (
        <div key={day}>
          <h2>{day}</h2>

          <div>
            {events.map((event, index) => {
            const eventID = `${day}-${index}`;
            const isExpanded = expandedEvent === eventID;
            
            const hasDetails = event["Event Description"] || event["Event Location"];

            return (
              <button
                className="event-button"
                key={index}
                onClick={() => setExpandedEvent(isExpanded ? null : eventID)}
                style={{ backgroundColor: colorMap[event["Color"]]}}
              >

                {hasDetails && (<span className ="expand-icon">{isExpanded ? "˄" : "˅"}</span>)}

                <strong>{event["Event Name"]}</strong>

                <br />

                {formatTime(event["Start Time"])} - {" " + formatTime(event["End Time"])}
                
                {/* Show additional details if the event is expanded */}
                {isExpanded && (
                  <div className="event-details">
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
