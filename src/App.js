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

function hasLink(text) {
  return text && text.includes("<a href=");
}

function extractLink(htmlString) {
  if (!htmlString) return null;

  const match = htmlString.match(/<a\s+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/);

  if (!match) return null;

  return {
    url: match[1],
    text: match[2]
  };
}

function App() {
  const [expandedEvent, setExpandedEvent] = useState(null);

  const colorMap = {
    purple: "#9848c3",
    "dark-purple": "#732e8e",
    yellow: "#dbbb51",
    green: "#51840f",
    gray: "#868080"
  };

  const days = Object.keys(scheduleData);

  const [selectedDay, setSelectedDay] = useState(days[0]); // Default to the first day

  return (
    <div>

      <nav className="navbar">
        <div className="nav-logo">
          <img src="../assets-used/main-logo-2T5.png" alt="Frosh Logo" className="frosh-logo"/>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#schedule" style={{ fontWeight: 'bold' }}>Schedule</a>
          <a href="#events">Events</a>
          <a href="#contact">Contact</a>
        </div>

      </nav>

      <div className="main-content">
      <div className="header">
        <h1 className="header-name"> Welcome to F!ROSH Week!</h1>

        <p>
          Your week of chaos, friends,
          and engineering traditions begins here.
        </p>

        <p>Find out what's in store for you!</p>
      </div>

      <div className="day-tabs">
          {days.map((day) => (
            <button 
              className={`day-tab ${day === selectedDay ? "active" : ""}`}
              key={day}
              onClick={() => {setSelectedDay(day);}}
            >
              {day}
            </button>
          ))}
      </div>

      <div>
        <h2>{selectedDay}</h2>     

        <div>{scheduleData[selectedDay].map((event, index) => {   
        
          const eventID = `${selectedDay}-${index}`;
          const isExpanded = expandedEvent === eventID;
          
          const hasDetails = event["Event Description"];
          const link = extractLink(event["Event Description"]);

          return (
            <button
              className="event-button"
              key={index}
              onClick={() => setExpandedEvent(isExpanded ? null : eventID)}
              style={{ backgroundColor: colorMap[event["Color"]]}}
            >

              {hasDetails && (<span className ="expand-icon">{isExpanded ? "˄" : "˅"}</span>)}

              <strong className="event-name">{event["Event Name"]}</strong>

              <br />

              {event["Start Time"] ? `${formatTime(event["Start Time"])} - ${formatTime(event["End Time"])}` : ""}

              {event["Event Location"] && 
              (<p className="location-row">
                <img src="../assets-used/location-icon.png" alt="Location: " className="location-icon"/>
                {event["Event Location"]}
                </p>)}
              
              {/* Show additional details if the event is expanded */}
              {isExpanded && (
                <div className="event-details">
                  {event["Event Description"] && (
                    hasLink(event["Event Description"]) ? (
                      <p>
                        {event["Event Description"].split("<a")[0]}

                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="event-link"
                        >
                          {link.text}
                        </a>
                        {event["Event Description"].split("</a>")[1]}
                      </p>
                    ) : (
                      <p>{event["Event Description"]}</p>
                    )
                  )}
                </div>
              )}
            </button>
          );

          })}
        </div>
      </div>
      </div>
    </div>
  );
}

export default App;
