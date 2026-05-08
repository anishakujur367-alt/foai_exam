import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
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
    box-shadow: 0 2px 10px rgba(239,68,68,0.5);
    border: 2.5px solid #ef4444;
    font-size: 15px;
  ">🛸</div>`,
  iconSize:   [28, 28],
  iconAnchor: [14, 14],
});

/* ── Smoothly pan/fly the map to follow the ISS ────────── */
function MapController({ position }) {
  const map = useMap();
  const isFirst = useRef(true);

  useEffect(() => {
    if (!position) return;
    if (isFirst.current) {
      map.setView(position, 4, { animate: false });
      isFirst.current = false;
    } else {
      map.flyTo(position, map.getZoom(), { animate: true, duration: 1.2 });
    }
  }, [position, map]);

  return null;
}

const ISS_API = 'https://api.wheretheiss.at/v1/satellites/25544';
const GEO_API = (lat, lon) =>
  `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=5`;

const MAX_TRACK = 50;

const ISSTracker = () => {
  const [position,    setPosition]    = useState(null);
  const [speed,       setSpeed]       = useState(null);
  const [nearPlace,   setNearPlace]   = useState('Fetching…');
  const [track,       setTrack]       = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading,     setLoading]     = useState(false);
  const [lastFetch,   setLastFetch]   = useState(null);

  const intervalRef = useRef(null);

  /* ── Fetch ISS position ─────────────────────────────── */
  const fetchISS = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(ISS_API);
      const data = await res.json();

      const lat = parseFloat(data.latitude.toFixed(3));
      const lon = parseFloat(data.longitude.toFixed(3));
      const spd = parseFloat(data.velocity.toFixed(2));

      setPosition([lat, lon]);
      setSpeed(spd);
      setLastFetch(new Date());

      // Append to track (keep max MAX_TRACK points)
      setTrack(prev => {
        const next = [...prev, [lat, lon]];
        return next.length > MAX_TRACK ? next.slice(next.length - MAX_TRACK) : next;
      });

      // Reverse geocode (best-effort, silent fail)
      try {
        const geo = await fetch(GEO_API(lat, lon), {
          headers: { 'Accept-Language': 'en' }
        });
        const geoData = await geo.json();
        const place =
          geoData?.address?.country ||
          geoData?.address?.state   ||
          geoData?.address?.ocean   ||
          geoData?.name             ||
          'Over ocean / remote area';
        setNearPlace(place);
      } catch {
        setNearPlace('Over ocean / remote area');
      }
    } catch (err) {
      console.error('ISS fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Initial fetch ──────────────────────────────────── */
  useEffect(() => { fetchISS(); }, [fetchISS]);

  /* ── Auto-refresh interval ──────────────────────────── */
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchISS, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, fetchISS]);

  /* ── Helpers ────────────────────────────────────────── */
  const toggleAuto = () => setAutoRefresh(v => !v);

  const formattedPos = position
    ? `${position[0].toFixed(3)}, ${position[1].toFixed(3)}`
    : 'Loading…';

  const formattedSpeed = speed
    ? `${speed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km/h`
    : 'Loading…';

  /* ── Render ─────────────────────────────────────────── */
  return (
    <div className="dashboard-card flex flex-col h-full">

      {/* Header row */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-bold dark:text-white">ISS Live Tracking</h2>
        <div className="flex gap-2">
          <button
            id="refresh-now-btn"
            onClick={fetchISS}
            disabled={loading}
            className="btn-pill flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Spinner when loading */}
            {loading ? (
              <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83
                         M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            )}
            Refresh Now
          </button>

          <button
            id="auto-refresh-btn"
            onClick={toggleAuto}
            className={`btn-pill flex items-center gap-1.5 transition-all ${
              autoRefresh
                ? 'border-green-400 text-green-700 bg-green-50 hover:bg-green-100 dark:border-green-500 dark:text-green-400 dark:bg-green-900/20 dark:hover:bg-green-900/40'
                : 'border-gray-300 text-gray-500 dark:border-dark-border dark:text-dark-muted'
            }`}
          >
            {/* Pulse dot */}
            <span className={`inline-block w-2 h-2 rounded-full ${
              autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}/>
            Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Stat boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="stat-box">
          <p className="text-xs text-text-muted dark:text-dark-muted mb-1">Latitude / Longitude</p>
          <p className="font-bold text-sm dark:text-white font-mono">{formattedPos}</p>
        </div>
        <div className="stat-box">
          <p className="text-xs text-text-muted dark:text-dark-muted mb-1">Speed</p>
          <p className="font-bold text-sm dark:text-white">{formattedSpeed}</p>
        </div>
        <div className="stat-box">
          <p className="text-xs text-text-muted dark:text-dark-muted mb-1">Nearest Place</p>
          <p className="font-bold text-sm dark:text-white leading-tight">{nearPlace}</p>
        </div>
        <div className="stat-box">
          <p className="text-xs text-text-muted dark:text-dark-muted mb-1">Tracked Positions</p>
          <p className="font-bold text-sm dark:text-white">{track.length}</p>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 min-h-[280px] rounded-xl overflow-hidden border border-border-light dark:border-dark-border relative z-0">
        {position ? (
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
            <MapController position={position} />
            {track.length > 1 && (
              <Polyline positions={track} color="#ef4444" weight={2} opacity={0.8} />
            )}
            <Marker position={position} icon={issIcon} />
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted dark:text-dark-muted">
            <svg className="animate-spin mr-2" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83
                       M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            Loading ISS position…
          </div>
        )}
      </div>

      {/* Last updated timestamp */}
      {lastFetch && (
        <p className="text-[11px] text-text-muted dark:text-dark-muted mt-2 text-right">
          Last updated: {lastFetch.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default ISSTracker;
