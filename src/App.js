import { useState, useEffect } from 'react';

// Import the schedule data from the JSON file — you can use it like a regular JS array
import scheduleData from './schedule_data.json';

// TODO: Build your Frosh Week Schedule page here

function MobileNavBar({ menuOpen, setMenuOpen }) {

  function handleComingSoon(e) {
    e.preventDefault();
    setMenuOpen(false);
    alert("Coming soon!");
  }

  return (
      <nav className="navbar-mobile">
      <div className="nav-logo">
        <img src="../assets-used/main-logo-2T5.png" className="frosh-logo" alt="Frosh Logo" />
      </div>

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <a href="#home" onClick={(e) => handleComingSoon(e)}>Home</a>
        <a href="#events" onClick={(e) => handleComingSoon(e)}>Events</a>
        <a href="#schedule" style={{ color: 'var(--purple-color)' }} onClick={() => setMenuOpen(false)}>Schedule</a>
        <a href="#contact" onClick={(e) => handleComingSoon(e)}>Contact</a>
      </div>
    </nav>
  )
}

function DesktopNavBar() {

  function handleComingSoon(e) {
    e.preventDefault();
    alert("Coming soon!");
  }

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src="../assets-used/main-logo-2T5.png" alt="Frosh Logo" className="frosh-logo"/>
      </div>

      <div className="nav-links">
        <a href="#home" onClick={(e) => handleComingSoon(e)}>Home</a>
        <a href="#events" onClick={(e) => handleComingSoon(e)}>Events</a>
        <a href="#schedule" style={{ color: 'var(--purple-color)' }}>Schedule</a>
        <a href="#contact" onClick={(e) => handleComingSoon(e)}>Contact</a>
      </div>

    </nav>
  );
}

function NavBar() {

  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 700);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile ? 
      ( <MobileNavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />) 
      : (<DesktopNavBar />
  );
}

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

function EventCard({event, index, eventID, isExpanded, setExpandedEvent, colorMap}) {
  const link = extractLink(event["Event Description"]);

  const hasDetails = event["Event Description"];
  const name = event["Event Name"];
  const description = event["Event Description"];
  const location = event["Event Location"];
  const startTime = event["Start Time"];
  const endTime = event["End Time"];
  const color = event["Color"];

  const timeRange =
    startTime?.trim() && endTime?.trim()
      ? `${formatTime(startTime)} - ${formatTime(endTime)}`
      : "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"; // Non-breaking spaces for alignment
  return (
    <button
      className="event-button"
      key={index}
      onClick={() => setExpandedEvent(isExpanded ? null : eventID)}
      style={{ backgroundColor: colorMap[color]}}
    >

    {hasDetails && (<span className ="expand-icon">{isExpanded ? "˄" : "˅"}</span>)}

    <div className = "event-header">
      <span className="event-time">
        {timeRange}
        {location && 
        (<p className="location-row">
          <img src="../assets-used/location-icon.png" alt="Location: " className="location-icon"/>
          {location}
          </p>)}
      </span>
      <strong className="event-name">{name}</strong>
    </div>

    {/* Show additional details if the event is expanded */}
    {isExpanded && (
      <div className="event-details">
        {description && (
          hasLink(description) ? (
            <p>
              {description.split("<a")[0]}

              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="event-link"
              >
                {link.text}
              </a>
              {description.split("</a>")[1]}
            </p>
          ) : (
            <p>{description}</p>
          )
        )}
      </div>
    )}
    </button>
  );
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
    <div className="app-container">

      <NavBar />

      <div className="main-content">
        <div className="header">
          <h1 className="header-name"> 
            Welcome to F!ROSH Week!
          </h1>
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
          <h2 className="selected-day">{selectedDay}</h2>     

          <div>{scheduleData[selectedDay].map((event, index) => {   
          
            const eventID = `${selectedDay}-${index}`;
            const isExpanded = expandedEvent === eventID;

            return (
              <EventCard
                key={index}
                event={event}
                index={index}
                eventID={eventID}
                isExpanded={isExpanded}
                setExpandedEvent={setExpandedEvent}
                colorMap={colorMap}
              />
            );

            })}
          </div>
        </div>
      </div>
      
      <footer className="footer">
        <div className="footer-logo">
          <img
            src="../assets-used/main-logo-2T5.png"
            alt="Frosh Logo"
            className="footer-logo-img"
          />
        </div>

        <div className="uoft-logo">
          <img
            src="../assets-used/uoftlogo.png"
            alt="University of Toronto Logo"
            className="uoft-logo-img"
          />
        </div>
      </footer>

    </div>
  );
}

export default App;
