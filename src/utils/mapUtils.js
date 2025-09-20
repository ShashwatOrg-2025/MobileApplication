// Grid size in degrees (approximately 5.5 km)
export const GRID_SIZE = 0.05;

// Calculate grid cell key for a location
export const getGridKey = (latitude, longitude) => {
  const keyLat = Math.floor(latitude / GRID_SIZE);
  const keyLng = Math.floor(longitude / GRID_SIZE);
  return `${keyLat},${keyLng}`;
};

// Group alerts by grid cells
export const groupAlertsByGrid = (alerts) => {
  const gridGroups = {};
  
  alerts.forEach((alert) => {
    const gridKey = getGridKey(alert.LOCATION.latitude, alert.LOCATION.longitude);
    if (!gridGroups[gridKey]) {
      gridGroups[gridKey] = [];
    }
    gridGroups[gridKey].push(alert);
  });
  
  return gridGroups;
};

// Calculate CRS (Combined Risk Score) for a group of alerts
export const calculateCRS = (alerts) => {
  if (!alerts || alerts.length === 0) return 0;

  const weights = {
    severity: 2.5,    // Weight for severity
    count: 1.0,      // Weight for number of reports
    recency: 3.0     // Weight for time decay
  };

  const now = Date.now();
  const decayTime = 3600 * 1000; // 1 hour decay time

  // Calculate average severity
  const avgSeverity = alerts.reduce((sum, alert) => sum + (alert.severityIndex || 1), 0) / alerts.length;

  // Calculate time-based decay
  const avgRecency = alerts.reduce((sum, alert) => {
    const time = alert.timestamp ? now - new Date(alert.timestamp).getTime() : 0;
    return sum + Math.exp(-time / decayTime);
  }, 0) / alerts.length;

  // Calculate final CRS
  const crs = (
    avgSeverity * weights.severity +
    alerts.length * weights.count +
    avgRecency * weights.recency
  );

  // Scale CRS to 0-10 range
  return Math.min(10, Math.max(0, crs / 10));
};

// Get marker color based on CRS value
export const getMarkerColor = (crs) => {
  if (crs >= 7) return 'red';
  if (crs >= 4) return 'orange';
  return 'green';
};

// Get marker size based on CRS and zoom level
export const getMarkerSize = (crs, zoom, isCluster = false) => {
  const baseSize = isCluster ? 40 : 30;
  const scaleFactor = 1 + (crs / 10);
  const zoomFactor = Math.max(0.5, Math.min(1.5, zoom / 10));
  
  return baseSize * scaleFactor * zoomFactor;
};

// Calculate grid bounds for visualization
export const getGridBounds = (gridKey) => {
  const [latKey, lngKey] = gridKey.split(',').map(Number);
  
  return {
    north: (latKey + 1) * GRID_SIZE,
    south: latKey * GRID_SIZE,
    east: (lngKey + 1) * GRID_SIZE,
    west: lngKey * GRID_SIZE,
  };
};