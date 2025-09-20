import { groupAlertsByGrid, calculateCRS } from '../utils/mapUtils';

class MapService {
  constructor() {
    this.alerts = [];
  }

  // Set alerts data
  setAlerts(alerts) {
    this.alerts = alerts;
  }

  // Get all alerts
  getAllAlerts() {
    return this.alerts;
  }

  // Get grouped alerts based on zoom level
  getGroupedAlerts(zoom) {
    if (zoom >= 10) {
      // Return individual alerts at high zoom levels
      return this.alerts.map(alert => ({
        ...alert,
        crs: calculateCRS([alert])
      }));
    } else {
      // Return clustered alerts at low zoom levels
      const gridGroups = groupAlertsByGrid(this.alerts);
      
      return Object.entries(gridGroups).map(([gridKey, alerts]) => {
        const crs = calculateCRS(alerts);
        const centerAlert = alerts[0];
        
        return {
          ...centerAlert,
          crs,
          count: alerts.length,
          isCluster: true,
          alerts: alerts
        };
      });
    }
  }

  // Get alerts by grid
  getAlertsInGrid(gridKey) {
    const grouped = groupAlertsByGrid(this.alerts);
    return grouped[gridKey] || [];
  }

  // Filter alerts by type
  filterAlertsByType(type) {
    return this.alerts.filter(alert => alert.TYPE === type);
  }

  // Filter alerts by severity range
  filterAlertsBySeverity(minSeverity, maxSeverity) {
    return this.alerts.filter(alert => 
      alert.severityIndex >= minSeverity && 
      alert.severityIndex <= maxSeverity
    );
  }
}

export default new MapService();