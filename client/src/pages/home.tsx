import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, MapPin, Star, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="text-center -mt-8 py-16 px-4 bg-gradient-to-r from-primary/10 to-[#FF6B6B]/10 rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Your Journey, Our Priority
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Experience seamless rides with RideSwift. Fast, safe, and reliable transportation at your fingertips.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/book">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Book a Ride
            </Button>
          </Link>
          <Link href="/driver">
            <Button size="lg" variant="outline">
              Become a Driver
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <Car className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Modern Fleet</h3>
            <p className="text-muted-foreground">
              Choose from our selection of comfortable, well-maintained vehicles.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <MapPin className="h-12 w-12 text-[#FF6B6B] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
            <p className="text-muted-foreground">
              Track your ride in real-time and share your journey with loved ones.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
            <p className="text-muted-foreground">
              Verified drivers and secure payment options for peace of mind.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Driver Showcase */}
      <section className="mt-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Meet Our Drivers</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <img
            src="https://images.unsplash.com/photo-1541747277704-ef7fb8e1a31c"
            alt="Driver 1"
            className="w-full h-48 object-cover rounded-lg"
          />
          <img
            src="https://images.unsplash.com/photo-1496423275314-469c5608e89a"
            alt="Driver 2"
            className="w-full h-48 object-cover rounded-lg"
          />
          <img
            src="https://images.unsplash.com/photo-1517840933437-c41356892b35"
            alt="Driver 3"
            className="w-full h-48 object-cover rounded-lg"
          />
          <img
            src="https://images.unsplash.com/photo-1576669801820-a9ab287ac2d1"
            alt="Driver 4"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      </section>
    </div>
  );
}
