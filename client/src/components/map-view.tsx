import { useState, useCallback, useEffect } from "react";
import { Location, generateMockRoute } from "@/lib/map-utils";
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, Libraries } from "@react-google-maps/api";

interface MapViewProps {
  pickup?: Location | null;
  dropoff?: Location | null;
  onPickupSelect?: (location: Location) => void;
  onDropoffSelect?: (location: Location) => void;
  drivers?: Array<{ id: number; location: Location }>;
  assignedDriver?: { id: number; location: Location } | null;
  currentLocation?: Location | null;
  isDriverMode?: boolean;
}

// New York City center as default
const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

// Map container style
const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
  overflow: 'hidden'
};

// Define libraries array with proper type
const libraries: Libraries = ["places", "geometry", "drawing"];

// Custom map styles to match Uber's aesthetic
const mapStyles = [
  {
    featureType: "all",
    elementType: "geometry.fill",
    stylers: [{ weight: "2.00" }]
  },
  {
    featureType: "all",
    elementType: "geometry.stroke",
    stylers: [{ color: "#9c9c9c" }]
  },
  {
    featureType: "all",
    elementType: "labels.text",
    stylers: [{ visibility: "on" }]
  },
  {
    featureType: "landscape",
    elementType: "all",
    stylers: [{ color: "#f2f2f2" }]
  },
  {
    featureType: "landscape",
    elementType: "geometry.fill",
    stylers: [{ color: "#f5f5f5" }]
  },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "road",
    elementType: "all",
    stylers: [{ saturation: -100 }, { lightness: 45 }]
  },
  {
    featureType: "road.highway",
    elementType: "all",
    stylers: [{ visibility: "simplified" }]
  },
  {
    featureType: "road.arterial",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "simplified" }]
  },
  {
    featureType: "water",
    elementType: "all",
    stylers: [{ color: "#c2e8ff" }, { visibility: "on" }]
  }
];

// Custom marker SVGs as data URLs - no need for google.maps.Point references yet

export default function MapView({
  pickup,
  dropoff,
  onPickupSelect,
  onDropoffSelect,
  drivers,
  assignedDriver,
  currentLocation,
  isDriverMode,
}: MapViewProps) {
  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  
  // Handle map click for selecting locations
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (isDriverMode || !e.latLng) return;
    
    const clickedLocation: Location = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    
    // Use Geocoder to get address if map is loaded
    if (isLoaded) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: clickedLocation }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          clickedLocation.address = results[0].formatted_address;
          
          // Depending on which field is empty, set pickup or dropoff
          if (!pickup && onPickupSelect) {
            onPickupSelect(clickedLocation);
          } else if (pickup && !dropoff && onDropoffSelect) {
            onDropoffSelect(clickedLocation);
          }
        } else {
          // Fallback if geocoding fails
          clickedLocation.address = `${clickedLocation.lat.toFixed(4)}, ${clickedLocation.lng.toFixed(4)}`;
          
          if (!pickup && onPickupSelect) {
            onPickupSelect(clickedLocation);
          } else if (pickup && !dropoff && onDropoffSelect) {
            onDropoffSelect(clickedLocation);
          }
        }
      });
    } else {
      // Fallback if map isn't loaded
      clickedLocation.address = `${clickedLocation.lat.toFixed(4)}, ${clickedLocation.lng.toFixed(4)}`;
      
      if (!pickup && onPickupSelect) {
        onPickupSelect(clickedLocation);
      } else if (pickup && !dropoff && onDropoffSelect) {
        onDropoffSelect(clickedLocation);
      }
    }
  }, [pickup, dropoff, onPickupSelect, onDropoffSelect, isDriverMode, isLoaded]);
  
  // Map callbacks
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);
  
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);
  
  // Get directions between pickup and dropoff
  useEffect(() => {
    if (isLoaded && pickup && dropoff) {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: pickup,
          destination: dropoff,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error("Directions request failed:", status);
            setDirections(null);
          }
        }
      );
    } else {
      setDirections(null);
    }
  }, [isLoaded, pickup, dropoff]);

  // Show loading or error state
  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Error loading maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p>Loading maps...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation || pickup || defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          styles: mapStyles,
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Render directions if available */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#00B4D8",
                strokeWeight: 5
              }
            }}
          />
        )}
        
        {/* Pickup marker */}
        {pickup && (
          <Marker
            position={pickup}
            icon={{
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="34" viewBox="0 0 24 34">
                  <path fill="#00B4D8" d="M12 0C5.383 0 0 5.383 0 12c0 6.617 10.846 20.566 11.302 21.123a.998.998 0 0 0 1.396 0C13.154 32.566 24 18.617 24 12c0-6.617-5.383-12-12-12zm0 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 34),
              anchor: new google.maps.Point(12, 34),
            }}
            title="Pickup Location"
          />
        )}
        
        {/* Dropoff marker */}
        {dropoff && (
          <Marker
            position={dropoff}
            icon={{
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="34" viewBox="0 0 24 34">
                  <path fill="#FF6B6B" d="M12 0C5.383 0 0 5.383 0 12c0 6.617 10.846 20.566 11.302 21.123a.998.998 0 0 0 1.396 0C13.154 32.566 24 18.617 24 12c0-6.617-5.383-12-12-12zm0 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 34),
              anchor: new google.maps.Point(12, 34),
            }}
            title="Dropoff Location"
          />
        )}
        
        {/* Driver markers */}
        {drivers && drivers.map(driver => (
          driver.id !== assignedDriver?.id && (
            <Marker
              key={driver.id}
              position={driver.location}
              icon={{
                url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="14" fill="white" stroke="#2B2D42" stroke-width="2"/>
                    <path d="M8 17a1 1 0 011-1h14a1 1 0 110 2H9a1 1 0 01-1-1z" fill="#2B2D42"/>
                    <path d="M13 22V12l8 5-8 5z" fill="#2B2D42"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 16),
              }}
              title={`Driver ${driver.id}`}
            />
          )
        ))}
        
        {/* Assigned driver marker */}
        {assignedDriver && (
          <Marker
            position={assignedDriver.location}
            icon={{
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="white" stroke="#00B4D8" stroke-width="4"/>
                  <path d="M12 21a1 1 0 011-1h14a1 1 0 110 2H13a1 1 0 01-1-1z" fill="#00B4D8"/>
                  <path d="M17 26V16l8 5-8 5z" fill="#00B4D8"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20),
            }}
            title="Your Driver"
          />
        )}
        
        {/* Current location marker for driver mode */}
        {isDriverMode && currentLocation && (
          <Marker
            position={currentLocation}
            icon={{
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="#00B4D8" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 24),
              anchor: new google.maps.Point(12, 12),
            }}
            title="Your Location"
          />
        )}
      </GoogleMap>
      
      {/* Instructions overlay */}
      <div className="absolute top-4 left-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-md text-sm z-10">
        <p className="font-medium text-gray-800">
          {isDriverMode 
            ? "Driver mode: Your current location and passengers will appear on the map"
            : !pickup 
              ? "Click on the map to set your pickup location" 
              : !dropoff 
                ? "Click on the map to set your destination"
                : "Pickup and destination set! You can book your ride now."
          }
        </p>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-md z-10">
        <div className="text-xs font-medium mb-2">Map Legend</div>
        <div className="grid grid-cols-1 gap-2">
          {pickup && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#00B4D8] mr-2"></div>
              <span className="text-xs">Pickup Location</span>
            </div>
          )}
          {dropoff && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#FF6B6B] mr-2"></div>
              <span className="text-xs">Dropoff Location</span>
            </div>
          )}
          {drivers && drivers.length > 0 && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#2B2D42] mr-2"></div>
              <span className="text-xs">Available Drivers</span>
            </div>
          )}
          {assignedDriver && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#00B4D8] mr-2"></div>
              <span className="text-xs">Your Driver</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
