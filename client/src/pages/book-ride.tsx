import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import MapView from "@/components/map-view";
import RideForm from "@/components/ride-form";
import DriverCard from "@/components/driver-card";
import { Card } from "@/components/ui/card";
import { Location } from "@/lib/map-utils";
import { mockDrivers } from "@/lib/mock-data";

export default function BookRide() {
  const [selectedPickup, setSelectedPickup] = useState<Location | null>(null);
  const [selectedDropoff, setSelectedDropoff] = useState<Location | null>(null);
  const [assignedDriver, setAssignedDriver] = useState<typeof mockDrivers[0] | null>(null);
  const { toast } = useToast();

  const createRideMutation = useMutation({
    mutationFn: async (rideData: any) => {
      const res = await apiRequest("POST", "/api/rides", rideData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Ride Booked!",
        description: "A driver will be assigned to you shortly.",
      });
      // Simulate driver assignment after 2 seconds
      setTimeout(() => {
        setAssignedDriver(mockDrivers[0]);
      }, 2000);
    },
  });

  const handleBookRide = (fare: number) => {
    if (!selectedPickup || !selectedDropoff) return;

    createRideMutation.mutate({
      userId: 1, // Mock user ID
      pickup: { ...selectedPickup },
      dropoff: { ...selectedDropoff },
      fare,
    });
  };

  return (
    <div className="grid md:grid-cols-[1fr,400px] gap-6">
      <Card className="p-0 overflow-hidden h-[600px]">
        <MapView
          pickup={selectedPickup}
          dropoff={selectedDropoff}
          onPickupSelect={setSelectedPickup}
          onDropoffSelect={setSelectedDropoff}
          drivers={mockDrivers}
          assignedDriver={assignedDriver}
        />
      </Card>

      <div className="space-y-6">
        <RideForm
          pickup={selectedPickup}
          dropoff={selectedDropoff}
          onPickupSelect={setSelectedPickup}
          onDropoffSelect={setSelectedDropoff}
          onSubmit={handleBookRide}
          isLoading={createRideMutation.isPending}
        />

        {assignedDriver && (
          <DriverCard
            driver={assignedDriver}
            status="Your driver is on the way"
          />
        )}
      </div>
    </div>
  );
}
