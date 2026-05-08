import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const issIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    background: white;
    border-radius: 50%;
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    border: 2px solid #ef4444;
    font-size: 14px;
  ">🛸</div>`,
  iconSize:   [28, 28],
  iconAnchor: [14, 14],
});

const ISSTracker = () => {
  const position = [-18.942, 70.827];
  const path = [
    [-5.0,  55.0],
    [-10.0, 60.0],
    [-15.0, 65.5],
    [-18.942, 70.827],
  ];

  return (
    <div className="dashboard-card flex flex-col h-full">
      {/* Header row */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-white">ISS Live Tracking</h2>
        <div className="flex gap-2">
          <button className="btn-pill">Refresh Now</button>
          <button className="btn-pill">Auto-Refresh: ON</button>
        </div>
      </div>

      {/* Stat boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="stat-box">
          <p className="text-xs text-text-muted dark:text-dark-muted mb-1">Latitude / Longitude</p>
          <p className="font-bold text-sm dark:text-white">-18.942, 70.827</p>
        </div>
        <div className="stat-box">
          <p className="text-xs text-text-muted dark:text-dark-muted mb-1">Speed</p>
          <p className="font-bold text-sm dark:text-white">24864.93 km/h</p>
        </div>
        <div className="stat-box">
          <p className="text-xs text-text-muted dark:text-dark-muted mb-1">Nearest Place</p>
          <p className="font-bold text-sm dark:text-white">Over ocean / remote area</p>
        </div>
        <div className="stat-box">
          <p className="text-xs text-text-muted dark:text-dark-muted mb-1">Tracked Positions</p>
          <p className="font-bold text-sm dark:text-white">50</p>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 min-h-[280px] rounded-xl overflow-hidden border border-border-light dark:border-dark-border relative z-0">
        <MapContainer
          center={position}
          zoom={4}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={path} color="#ef4444" weight={2.5} />
          <Marker position={position} icon={issIcon} />
        </MapContainer>
      </div>
    </div>
  );
};

export default ISSTracker;
