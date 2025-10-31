import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ParkingCircle,
  MapPin,
  Clock,
  Shield,
  ArrowRight,
  Check,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: MapPin,
      title: "Find Parking Instantly",
      description:
        "Locate available parking spots in real-time near your destination",
    },
    {
      icon: Clock,
      title: "Save Time",
      description:
        "Book your spot ahead of time and skip the endless search for parking",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description:
        "All parking locations are verified and monitored for your safety",
    },
  ];

  const benefits = [
    "Real-time availability updates",
    "Competitive pricing",
    "Easy payment options",
    "24/7 customer support",
    "Multiple location options",
    "Flexible booking times",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/logo_banner.webp"
              alt="ParkUp Logo"
              width={200}
              height={80}
              priority
              className="object-contain"
            />
          </div>

          <h1 className="mb-6 max-w-4xl text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Find & Book Parking Spots{" "}
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Effortlessly
            </span>
          </h1>

          <p className="mb-8 max-w-2xl text-lg text-gray-600 sm:text-xl">
            Say goodbye to the frustration of finding parking. ParkUp helps you
            discover, reserve, and pay for parking spots in seconds.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="text-base">
              <Link href="/register">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid w-full max-w-3xl grid-cols-3 gap-8 rounded-2xl border bg-white p-8 shadow-lg">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">5000+</p>
              <p className="mt-1 text-sm text-gray-600">Parking Spots</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">10K+</p>
              <p className="mt-1 text-sm text-gray-600">Happy Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">50+</p>
              <p className="mt-1 text-sm text-gray-600">Cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose ParkUp?
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need for stress-free parking
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="transition-all hover:shadow-xl"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need in One Place
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              ParkUp provides a comprehensive parking solution with features
              designed to make your life easier.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="flex min-h-[400px] items-center justify-center p-8">
              <div className="text-center">
                <ParkingCircle className="mx-auto mb-6 h-32 w-32 text-primary" />
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Ready to Get Started?
                </h3>
                <p className="mb-6 text-gray-600">
                  Join thousands of users who have made parking hassle-free
                </p>
                <Button asChild size="lg">
                  <Link href="/register">Create Free Account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="py-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Start Your Parking Journey Today
            </h2>
            <p className="mb-8 text-lg text-blue-50">
              Sign up now and get your first booking with exclusive benefits
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-base"
              >
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src="/logo_app.webp"
                alt="ParkUp Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-lg font-bold">ParkUp</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2025 ParkUp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
