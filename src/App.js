import { useState } from "react";
import scheduleData from './schedule_data.json';

// Parse the messy time formats into something displayable
function parseTime(timeStr) {
  if (!timeStr || timeStr.trim() === "") return null;

  // Format: "13:30:00 a1/p1" — a1 = AM, p1 = PM
  const spreadsheetMatch = timeStr.match(/^(\d+):(\d+):\d+\s+(a1|p1)/i);
  if (spreadsheetMatch) {
    let hours = parseInt(spreadsheetMatch[1], 10);
    const mins = spreadsheetMatch[2];
    const meridiem = spreadsheetMatch[3].toLowerCase() === "p1" ? "PM" : "AM";
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHour}:${mins} ${meridiem}`;
  }

  // Format: "6:00 PM" — already clean
  const normalMatch = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)/i);
  if (normalMatch) {
    return `${normalMatch[1]}:${normalMatch[2]} ${normalMatch[3].toUpperCase()}`;
  }

  return timeStr.trim();
}

function formatTimeRange(start, end) {
  const s = parseTime(start);
  const e = parseTime(end);
  if (!s && !e) return null;
  if (s && e) return `${s} – ${e}`;
  return s || e;
}

const COLOR_MAP = {
  purple: { bg: "#6B21A8", accent: "#A855F7", label: "Activity" },
  "dark-purple": { bg: "#3B0764", accent: "#7C3AED", label: "Event" },
  yellow: { bg: "#854D0E", accent: "#EAB308", label: "Challenge" },
  green: { bg: "#14532D", accent: "#22C55E", label: "Break" },
  gray: { bg: "#1F2937", accent: "#9CA3AF", label: "Info" },
};

const DAYS = Object.keys(scheduleData);

const DAY_SHORT = {
  "MONDAY AUGUST 26": "MON 26",
  "TUESDAY AUGUST 27": "TUE 27",
  "WEDNESDAY AUGUST 28": "WED 28",
  "THURSDAY AUGUST 29": "THU 29",
  "FRIDAY AUGUST 30": "FRI 30",
};

function EventCard({ event, index }) {
  const [expanded, setExpanded] = useState(false);
  const color = COLOR_MAP[event["Color"]] || COLOR_MAP["gray"];
  const timeRange = formatTimeRange(event["Start Time"], event["End Time"]);
  const hasDesc = !!event["Event Description"];
  const hasLoc = !!event["Event Location"];

  return (
    <div
      className="event-card"
      style={{ "--accent": color.accent, "--bg": color.bg, animationDelay: `${index * 60}ms` }}
      onClick={() => (hasDesc || hasLoc) && setExpanded(!expanded)}
      role={hasDesc || hasLoc ? "button" : undefined}
      aria-expanded={expanded}
    >
      <div className="event-color-bar" style={{ background: color.accent }} />
      <div className="event-content">
        <div className="event-header">
          <span className="event-name">{event["Event Name"]}</span>
          <span className="event-tag" style={{ background: color.bg, color: color.accent }}>
            {color.label}
          </span>
        </div>
        {timeRange && <div className="event-time">{timeRange}</div>}
        {expanded && (
          <div className="event-details">
            {hasLoc && (
              <div className="event-location">
                <span className="detail-icon">◎</span> {event["Event Location"]}
              </div>
            )}
            {hasDesc && (
              <div
                className="event-desc"
                dangerouslySetInnerHTML={{ __html: event["Event Description"] }}
              />
            )}
          </div>
        )}
        {(hasDesc || hasLoc) && (
          <div className="event-expand-hint">{expanded ? "▲ less" : "▼ more"}</div>
        )}
      </div>
    </div>
  );
}

function DayColumn({ dayName, events, active, onClick }) {
  return (
    <div className={`day-column ${active ? "active" : ""}`}>
      <button className="day-tab" onClick={onClick} aria-pressed={active}>
        <span className="day-tab-short">{DAY_SHORT[dayName]}</span>
        <span className="day-tab-full">{dayName}</span>
      </button>
      {active && (
        <div className="events-list">
          {events.map((event, i) => (
            <EventCard key={i} event={event} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [activeDay, setActiveDay] = useState(DAYS[0]);

  return (
    <div className="app">
      {/* Background decoration */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-glow" aria-hidden="true" />

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <img src="/assets/main-logo.png" alt="F!ROSH 2T6" className="header-logo" />
          <div className="header-text">
            <h1 className="header-title">F!ROSH WEEK</h1>
            <p className="header-subtitle">2T6 &mdash; August 26&ndash;30, 2024 &mdash; UofT Engineering</p>
          </div>
          <img src="/assets/F! Crest Purple.png" alt="F!rosh Crest" className="header-crest" />
        </div>
      </header>

      {/* Day picker */}
      <nav className="day-nav" aria-label="Select a day">
        {DAYS.map((day) => (
          <button
            key={day}
            className={`day-nav-btn ${activeDay === day ? "selected" : ""}`}
            onClick={() => setActiveDay(day)}
          >
            <span className="dnb-short">{DAY_SHORT[day]}</span>
            <span className="dnb-full">{day}</span>
          </button>
        ))}
      </nav>

      {/* Schedule */}
      <main className="schedule">
        <div className="schedule-day-header">
          <h2>{activeDay}</h2>
          <span className="event-count">{scheduleData[activeDay].length} events</span>
        </div>
        <div className="events-list">
          {scheduleData[activeDay].map((event, i) => (
            <EventCard key={i} event={event} index={i} />
          ))}
        </div>
      </main>

      {/* Legend */}
      <div className="legend">
        {Object.entries(COLOR_MAP).map(([key, val]) => (
          <div key={key} className="legend-item">
            <span className="legend-dot" style={{ background: val.accent }} />
            <span>{val.label}</span>
          </div>
        ))}
      </div>

      <footer className="footer">
        <img src="/assets/uoftlogo.png" alt="UofT" className="footer-logo" />
        <p>University of Toronto Engineering &bull; F!ROSH 2T6</p>
      </footer>
    </div>
  );
}

export default App;
