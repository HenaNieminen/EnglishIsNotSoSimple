import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import Leaflet from 'leaflet';
//Need to import another library. Leaflet is giving me a headache

//Pigeonmaps looked cool and simple

//Fix the default icon to load when built
const DefaultIcon = Leaflet.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [28, 46],
    iconAnchor: [17, 46]
    //Anchor the icon so it doesn't drift away when zooming out
});

Leaflet.Marker.prototype.options.icon = DefaultIcon;

function Map({ locations }) {
    return (
        //Map goes to TAMK by default
        <MapContainer
            center={[61.50351935724264, 23.807905063133823]}
            zoom={15}
        >
        {/*Lay down the image chunks with tilelayer */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/*Map out the locations with props taken from App.jsx. Sets the key from the id
            and position from the prop object. Popup will display its latitude and longitude when
            clicked*/}
            {locations.map((location) => (
                <Marker key={location.id} position={[location.latitude, location.longitude]}>
                    <Popup>
                        Latitude: {location.latitude}, Longitude: {location.longitude}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default Map;
