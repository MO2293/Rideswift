import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MapView from "@/components/map-view";
import { useToast } from "@/hooks/use-toast";
import { Location } from "@/lib/map-utils";

export default function DriverMode() {
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const { toast } = useToast();

  const { data: activeRides } = useQuery({
    queryKey: ["/api/users/1/rides"],
    enabled: isOnline,
  });

  const updateLocationMutation = useMutation({
    mutationFn: async (location: Location) => {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1,
          location,
        }),
      });
      return res.json();
    },
  });

  useEffect(() => {
    if (!isOnline) return;

    // Simulate GPS updates
    const interval = setInterval(() => {
      const newLocation = {
        lat: 40.7128 + (Math.random() - 0.5) * 0.01,
        lng: -74.006 + (Math.random() - 0.5) * 0.01,
      };
      setCurrentLocation(newLocation);
      updateLocationMutation.mutate(newLocation);
    }, 5000);

    return () => clearInterval(interval);
  }, [isOnline]);

  const toggleOnline = () => {
    setIsOnline(!isOnline);
    toast({
      title: !isOnline ? "You're now online" : "You've gone offline",
      description: !isOnline
        ? "You can now receive ride requests"
        : "You won't receive new requests",
    });
  };

  return (
    <div className="grid md:grid-cols-[1fr,400px] gap-6">
      <Card className="p-0 overflow-hidden h-[600px]">
        <MapView
          currentLocation={currentLocation}
          isDriverMode={true}
        />
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Driver Status
              <Badge variant={isOnline ? "default" : "secondary"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              variant={isOnline ? "destructive" : "default"}
              onClick={toggleOnline}
            >
              {isOnline ? "Go Offline" : "Go Online"}
            </Button>
          </CardContent>
        </Card>

        {activeRides?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Active Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeRides.map((ride: any) => (
                  <div key={ride.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Ride #{ride.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {ride.pickup.address}
                      </p>
                    </div>
                    <Badge>{ride.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
