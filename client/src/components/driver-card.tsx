import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface DriverCardProps {
  driver: {
    name: string;
    rating: number;
    image: string;
    car: string;
  };
  status?: string;
}

export default function DriverCard({ driver, status }: DriverCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={driver.image} alt={driver.name} />
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{driver.name}</h3>
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-sm">{driver.rating}</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">{driver.car}</p>
            {status && (
              <p className="text-sm font-medium text-primary mt-1">{status}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
