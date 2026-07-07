import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockLocations } from "@/lib/mock-data";
import { Location, calculateFare } from "@/lib/map-utils";

interface RideFormProps {
  pickup: Location | null;
  dropoff: Location | null;
  onPickupSelect: (location: Location) => void;
  onDropoffSelect: (location: Location) => void;
  onSubmit: (fare: number) => void;
  isLoading?: boolean;
}

export default function RideForm({
  pickup,
  dropoff,
  onPickupSelect,
  onDropoffSelect,
  onSubmit,
  isLoading,
}: RideFormProps) {
  const form = useForm({
    defaultValues: {
      pickup: "",
      dropoff: "",
    },
  });

  const handleSubmit = form.handleSubmit(() => {
    if (!pickup || !dropoff) return;
    const fare = calculateFare(pickup, dropoff);
    onSubmit(fare);
  });

  const fare = pickup && dropoff ? calculateFare(pickup, dropoff) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Your Ride</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="pickup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Location</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const location = mockLocations.find(
                        (loc) => loc.label === value
                      );
                      if (location) onPickupSelect(location.value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pickup location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockLocations.map((location) => (
                        <SelectItem key={location.label} value={location.label}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dropoff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dropoff Location</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const location = mockLocations.find(
                        (loc) => loc.label === value
                      );
                      if (location) onDropoffSelect(location.value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dropoff location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockLocations.map((location) => (
                        <SelectItem key={location.label} value={location.label}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {fare && (
              <div className="py-4 text-center">
                <p className="text-lg font-semibold">Estimated Fare</p>
                <p className="text-3xl font-bold text-primary">${fare}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!pickup || !dropoff || isLoading}
            >
              {isLoading ? "Finding your driver..." : "Book Now"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
