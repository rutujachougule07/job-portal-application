/**
 * Parses latitude and longitude from any Google Maps, Bing Maps, Apple Maps, or OpenStreetMap URL.
 */
export function parseMapCoordinates(inputUrl: string): { lat: number; lng: number } | null {
  if (!inputUrl || typeof inputUrl !== "string") return null;

  try {
    const decoded = decodeURIComponent(inputUrl.trim());

    // 1. Bing Maps ppois format: ppois=16.846446990966797_74.5986328125_INFOYASHONAND+TECHNOLOGY...
    const matchPpois = decoded.match(/ppois=(-?\d+\.\d+)[_~,](-?\d+\.\d+)/i);
    if (matchPpois && matchPpois[1] && matchPpois[2]) {
      const lat = parseFloat(matchPpois[1]);
      const lng = parseFloat(matchPpois[2]);
      if (isValidCoord(lat, lng)) return { lat, lng };
    }

    // 2. Bing Maps cp=lat~lng or cp=lat,lng format
    const matchCp = decoded.match(/cp=(-?\d+\.\d+)[~,_](-?\d+\.\d+)/i);
    if (matchCp && matchCp[1] && matchCp[2]) {
      const lat = parseFloat(matchCp[1]);
      const lng = parseFloat(matchCp[2]);
      if (isValidCoord(lat, lng)) return { lat, lng };
    }

    // 3. Google Maps @lat,lng format
    const matchAt = decoded.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (matchAt && matchAt[1] && matchAt[2]) {
      const lat = parseFloat(matchAt[1]);
      const lng = parseFloat(matchAt[2]);
      if (isValidCoord(lat, lng)) return { lat, lng };
    }

    // 4. Query params: q=lat,lng or ll=lat,lng or center=lat,lng or location=lat,lng
    const matchParam = decoded.match(/[?&](?:q|ll|center|where|cp|location|point)=(-?\d+\.\d+)[,~_%7E\s]+(-?\d+\.\d+)/i);
    if (matchParam && matchParam[1] && matchParam[2]) {
      const lat = parseFloat(matchParam[1]);
      const lng = parseFloat(matchParam[2]);
      if (isValidCoord(lat, lng)) return { lat, lng };
    }

    // 5. General regex match for pairs of decimal coordinates in text
    const matchCoords = decoded.match(/(-?\d{1,2}\.\d+)\s*[,~_\s]\s*(-?\d{1,3}\.\d+)/);
    if (matchCoords && matchCoords[1] && matchCoords[2]) {
      const lat = parseFloat(matchCoords[1]);
      const lng = parseFloat(matchCoords[2]);
      if (isValidCoord(lat, lng)) return { lat, lng };
    }
  } catch (e) {
    console.warn("Failed to parse map coordinates:", e);
  }

  return null;
}

function isValidCoord(lat: number, lng: number): boolean {
  return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
