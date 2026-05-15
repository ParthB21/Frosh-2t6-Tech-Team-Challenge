// Import the schedule data from the JSON file — you can use it like a regular JS array
import scheduleData from './schedule_data.json';

// TODO: Build your Frosh Week Schedule page here

function App() {
  return (
    <div>
      <h1>Good Luck, Applicant!</h1>

      <p>Frosh Week Schedule</p>
      <p>Find out what's in store for you!</p>

            {Object.entries(scheduleData).map(([day, events]) => (
        <div key={day}>
          <h2>{day}</h2>

          <ul>
            {events.map((event, index) => (
              <li key={index}>
                <strong>{event["Event Name"]}</strong>

                <br />

                {event["Start Time"]} - {event["End Time"]}
              </li>
            ))}
          </ul>
        </div>
      ))}

    </div>
  );
}

export default App;
