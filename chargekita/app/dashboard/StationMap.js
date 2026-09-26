"use client";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const STATUS_COLOR = {
  available: "#2ecc71",
  in_use: "#1e88e5",
  full: "#f39c12",
  disrupted: "#e74c3c",
};

const STATUS_LABEL = {
  available: "Tersedia",
  in_use: "Digunakan",
  full: "Penuh",
  disrupted: "Gangguan",
};

const YOGYAKARTA_CENTER = [-7.7828, 110.3672];

export default function StationMap({ stations }) {
  const withCoords = stations.filter((s) => s.latitude != null && s.longitude != null);
  const center = withCoords.length ? [withCoords[0].latitude, withCoords[0].longitude] : YOGYAKARTA_CENTER;

  return (
    <MapContainer center={center} zoom={13} style={{ height: 360, width: "100%", borderRadius: 10 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {withCoords.map((s) => (
        <CircleMarker
          key={s.id}
          center={[s.latitude, s.longitude]}
          radius={11}
          pathOptions={{
            color: STATUS_COLOR[s.status] || "#999",
            fillColor: STATUS_COLOR[s.status] || "#999",
            fillOpacity: 0.9,
            weight: 2,
          }}
        >
          <Popup>
            <strong>{s.name}</strong>
            <br />
            {s.address}
            <br />
            Status: {STATUS_LABEL[s.status] || s.status}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
