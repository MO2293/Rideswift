export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export function generateMockRoute(start: Location, end: Location): Location[] {
  const points: Location[] = [];
  const steps = 10;
  
  for (let i = 0; i <= steps; i++) {
    points.push({
      lat: start.lat + (end.lat - start.lat) * (i / steps),
      lng: start.lng + (end.lng - start.lng) * (i / steps),
    });
  }
  
  return points;
}

export function calculateFare(start: Location, end: Location): number {
  const baseRate = 5;
  const perKmRate = 2;
  const distance = calculateDistance(start, end);
  return Math.round(baseRate + (distance * perKmRate));
}

function calculateDistance(start: Location, end: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(end.lat - start.lat);
  const dLon = toRad(end.lng - start.lng);
  const lat1 = toRad(start.lat);
  const lat2 = toRad(end.lat);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * Math.PI / 180;
}
