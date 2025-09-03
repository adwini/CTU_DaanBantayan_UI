"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  IconPalette,
  IconSun,
  IconMoon,
  IconCheck,
  IconStar,
  IconHeart,
} from "@tabler/icons-react";

export function ThemeShowcase() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <IconPalette className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">CTU Academic Theme</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A professional academic dashboard theme combining shadcn/ui components
          with daisyUI themes, designed specifically for Cebu Technological
          University.
        </p>
        <div className="flex items-center justify-center gap-2">
          <ThemeToggle />
          <span className="text-sm text-muted-foreground">
            Try switching themes!
          </span>
        </div>
      </div>

      {/* Color Palette */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle>Color System</CardTitle>
          <CardDescription>
            Consistent colors that work perfectly in both light and dark modes
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-16 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-medium">
                Primary
              </span>
            </div>
            <p className="text-xs text-muted-foreground">CTU Blue</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-secondary rounded-lg flex items-center justify-center">
              <span className="text-secondary-foreground font-medium">
                Secondary
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Professional Gray</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-medium">Accent</span>
            </div>
            <p className="text-xs text-muted-foreground">Academic Green</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-destructive rounded-lg flex items-center justify-center">
              <span className="text-destructive-foreground font-medium">
                Destructive
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Warning Red</p>
          </div>
        </CardContent>
      </Card>

      {/* Components Showcase */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Buttons */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>
              Enhanced button styles with CTU branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button className="btn-ctu-primary">
                <IconCheck className="h-4 w-4 mr-2" />
                Primary
              </Button>
              <Button variant="secondary" className="btn-ctu-secondary">
                Secondary
              </Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">
                <IconStar className="h-4 w-4 mr-2" />
                Large
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>Academic Badges</CardTitle>
            <CardDescription>
              Status and role indicators with academic styling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Status Badges</h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="badge-academic badge-active">Active</Badge>
                <Badge className="badge-academic badge-inactive">
                  Inactive
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Role Badges</h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="badge-academic badge-admin">Admin</Badge>
                <Badge className="badge-academic badge-teacher">Teacher</Badge>
                <Badge className="badge-academic badge-student">Student</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Theme Features */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle>Theme Features</CardTitle>
          <CardDescription>
            What makes the CTU Academic Theme special
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <IconSun className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Light & Dark Modes</h4>
                  <p className="text-sm text-muted-foreground">
                    Seamless switching between light and dark themes with
                    automatic system detection
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <IconPalette className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-medium">Academic Color Palette</h4>
                  <p className="text-sm text-muted-foreground">
                    Professional colors designed for educational institutions
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <IconHeart className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">Enhanced Components</h4>
                  <p className="text-sm text-muted-foreground">
                    All components styled with professional academic aesthetics
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <IconCheck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 font-medium>Accessibility First</h4>
                  <p className="text-sm text-muted-foreground">
                    WCAG compliant colors and focus indicators for inclusive
                    design
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Note */}
      <Card className="border-dashed border-2 border-muted-foreground/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconPalette className="h-4 w-4" />
            <span className="text-sm">
              The theme automatically syncs with your system preferences and
              persists across sessions. All components are enhanced with smooth
              transitions and hover effects.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ThemeShowcase;
