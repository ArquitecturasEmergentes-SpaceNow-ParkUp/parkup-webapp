import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ColorsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            ParkUp Color System
          </h1>
          <p className="text-lg text-muted-foreground">
            Visual reference for the brand color palette
          </p>
        </div>

        {/* Brand Colors */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Brand Colors
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Primary */}
            <Card>
              <CardHeader>
                <CardTitle>Primary - Azul Vibrante</CardTitle>
                <CardDescription>#0052FF</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-24 w-full rounded-lg bg-primary" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Main brand color for headers, buttons, and active states
                  </p>
                  <code className="block rounded bg-muted p-2 text-xs">
                    className="bg-primary"
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Accent */}
            <Card>
              <CardHeader>
                <CardTitle>Accent - Naranja</CardTitle>
                <CardDescription>#FF5722</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-24 w-full rounded-lg bg-accent" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    CTA buttons, alerts, and notifications
                  </p>
                  <code className="block rounded bg-muted p-2 text-xs">
                    className="bg-accent"
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Background */}
            <Card>
              <CardHeader>
                <CardTitle>Background - Gris Claro</CardTitle>
                <CardDescription>#F5F5F5</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-24 w-full rounded-lg bg-background border border-border" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    General screen background (softer than pure white)
                  </p>
                  <code className="block rounded bg-muted p-2 text-xs">
                    className="bg-background"
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Surface */}
            <Card>
              <CardHeader>
                <CardTitle>Surface - Blanco</CardTitle>
                <CardDescription>#FFFFFF</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-24 w-full rounded-lg bg-card border border-border" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Cards, modals, and text fields
                  </p>
                  <code className="block rounded bg-muted p-2 text-xs">
                    className="bg-card"
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Text Colors */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Text Colors
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Primary Text - Casi Negro (#212121)
                </h3>
                <p className="text-foreground">
                  This is the main text color used for titles and body text.
                  Maximum readability and contrast.
                </p>
                <code className="block mt-2 rounded bg-muted p-2 text-xs">
                  className="text-foreground"
                </code>
              </div>

              <div>
                <h3 className="text-base font-medium text-muted-foreground mb-2">
                  Secondary Text - Gris Oscuro (#757575)
                </h3>
                <p className="text-muted-foreground">
                  This is the secondary text color used for descriptions, help
                  text, and less important information.
                </p>
                <code className="block mt-2 rounded bg-muted p-2 text-xs">
                  className="text-muted-foreground"
                </code>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Borders */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Borders & Dividers
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Gris Pálido (#EEEEEE)
                </p>
                <div className="h-1 w-full bg-border rounded" />
                <code className="block mt-2 rounded bg-muted p-2 text-xs">
                  className="border-border"
                </code>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Component Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Component Examples
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Primary Button
                </Button>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Accent Button (CTA)
                </Button>
                <Button variant="outline" className="w-full">
                  Outline Button
                </Button>
                <Button variant="secondary" className="w-full">
                  Secondary Button
                </Button>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Badges & Labels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary text-primary-foreground">
                    Primary
                  </Badge>
                  <Badge className="bg-accent text-accent-foreground">
                    Accent
                  </Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Inputs */}
            <Card>
              <CardHeader>
                <CardTitle>Input Fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Default input"
                  className="bg-card border-input"
                />
                <Input
                  placeholder="With focus ring"
                  className="bg-card border-input focus-visible:ring-primary"
                />
              </CardContent>
            </Card>

            {/* Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Nested Card</CardTitle>
                <CardDescription>
                  Cards use the surface color (white)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border bg-muted p-4">
                  <p className="text-sm text-foreground">
                    This is content inside a card with muted background
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* States */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Interactive States
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Hover States</p>
                <div className="flex gap-2">
                  <div className="h-12 w-24 rounded-lg bg-primary hover:bg-primary/90 transition-colors" />
                  <div className="h-12 w-24 rounded-lg bg-accent hover:bg-accent/90 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Opacity Variations</p>
                <div className="flex gap-2">
                  <div className="h-12 w-16 rounded-lg bg-primary/10" />
                  <div className="h-12 w-16 rounded-lg bg-primary/20" />
                  <div className="h-12 w-16 rounded-lg bg-primary/50" />
                  <div className="h-12 w-16 rounded-lg bg-primary/90" />
                  <div className="h-12 w-16 rounded-lg bg-primary" />
                </div>
                <p className="text-xs text-muted-foreground">
                  10%, 20%, 50%, 90%, 100%
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Gradients */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Gradients</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Primary to Accent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-24 w-full rounded-lg bg-gradient-to-r from-primary to-accent" />
                <code className="block mt-2 rounded bg-muted p-2 text-xs">
                  className="bg-gradient-to-r from-primary to-accent"
                </code>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subtle Background</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-24 w-full rounded-lg bg-gradient-to-br from-background to-muted border border-border" />
                <code className="block mt-2 rounded bg-muted p-2 text-xs">
                  className="bg-gradient-to-br from-background to-muted"
                </code>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Semantic Colors */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Semantic Usage
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-primary bg-primary/5">
              <CardHeader>
                <CardTitle className="text-primary">Success</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Using primary color for success states
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent bg-accent/5">
              <CardHeader>
                <CardTitle className="text-accent">Warning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Using accent color for warnings and alerts
                </p>
              </CardContent>
            </Card>

            <Card className="border-destructive bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Using destructive color for errors
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-muted">
              <CardHeader>
                <CardTitle className="text-foreground">Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Using muted colors for informational messages
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <Card className="border-primary">
            <CardContent className="pt-6">
              <p className="text-sm text-center text-muted-foreground">
                For detailed documentation, see{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  COLOR_SYSTEM.md
                </code>
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
