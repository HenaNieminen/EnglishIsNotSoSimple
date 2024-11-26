import { useState, useEffect } from "react";
import connect from "./Fetchdata";
import "./App.css";

function App() {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        connect(setLocations);
    }, []);

    return (
        <div>
            <h1>Locations</h1>
            <ul>
                {locations.map((location) => (
                    <li key={location.id}>
                        ID: {location.id} Latitude: {location.latitude}, Longitude: {location.longitude}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;