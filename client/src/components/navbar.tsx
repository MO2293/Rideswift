import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 text-xl font-bold">
              <Car className="h-6 w-6" />
              RideSwift
            </a>
          </Link>
          
          <div className="flex gap-4">
            <Link href="/book">
              <Button variant="secondary">Book a Ride</Button>
            </Link>
            <Link href="/driver">
              <Button variant="secondary">Driver Mode</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
