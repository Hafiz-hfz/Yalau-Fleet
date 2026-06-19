
import { MapContainer, TileLayer, Marker, Tooltip , Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

function Carte () {
    const [camions, setCamions] = useState([])

  useEffect(() => {
    fetch('${import.meta.env.VITE_API_URL}/api/camions')
      .then(res => res.json())
      .then(data => setCamions(data.filter(c => c.latitude && c.longitude)))
  }, [])

    return (
        <div>
            <MapContainer
                center={[6.3654, 2.4183]} // Cotonou
                zoom={13}
                style={{ height: "350px", width: "100%" }}
            >
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                    {camions.map(camion => (
                    <Marker key={camion.id} position={[camion.latitude, camion.longitude]}>
                        {/* <Popup>{camion.immatriculation} — {camion.statut}</Popup> */}
                         <Tooltip permanent direction="top" offset={[0, -10]}>
                            <strong>{camion.immatriculation}</strong><br />
                            {camion.statut}
                        </Tooltip>
                    </Marker>
                    ))}
            </MapContainer>
        </div>
    )
}
 
export default Carte