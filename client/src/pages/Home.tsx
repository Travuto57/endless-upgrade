import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const NFL_TEAMS = [
  "Arizona Cardinals",
  "Atlanta Falcons",
  "Baltimore Ravens",
  "Buffalo Bills",
  "Carolina Panthers",
  "Chicago Bears",
  "Cincinnati Bengals",
  "Cleveland Browns",
  "Dallas Cowboys",
  "Denver Broncos",
  "Detroit Lions",
  "Green Bay Packers",
  "Houston Texans",
  "Indianapolis Colts",
  "Jacksonville Jaguars",
  "Kansas City Chiefs",
  "Las Vegas Raiders",
  "Los Angeles Chargers",
  "Los Angeles Rams",
  "Miami Dolphins",
  "Minnesota Vikings",
  "New England Patriots",
  "New Orleans Saints",
  "New York Giants",
  "New York Jets",
  "Philadelphia Eagles",
  "Pittsburgh Steelers",
  "San Francisco 49ers",
  "Seattle Seahawks",
  "Tampa Bay Buccaneers",
  "Tennessee Titans",
  "Washington Commanders"
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nflTeam: ""
  });

  const createEntry = trpc.giveaway.createEntry.useMutation({
    onSuccess: (data: any) => {
      // Store entry ID in session storage for tracking survey clicks
      if (data.entryId) {
        sessionStorage.setItem('giveawayEntryId', data.entryId.toString());
      }
      setLocation("/thank-you");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit entry");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.nflTeam) {
      toast.error("Please fill in all required fields");
      return;
    }

    createEntry.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-center">
            <img src="/logo.png" alt="PrizeHub Pro" className="h-12 md:h-16" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('/stadium-hero.jpg')] bg-cover bg-center opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50"></div>
        
        <div className="relative container py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <div className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <span className="text-lg">🔥</span>
                  LIMITED TIME OFFER
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                WIN 2 TICKETS TO THE SUPER BOWL
              </h1>

              <p className="text-lg md:text-xl text-slate-200">
                Experience the biggest game in football! Win 2 premium tickets, round-trip airfare, and luxury hotel accommodation.
              </p>

              {/* Prize Features */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-accent text-accent-foreground rounded-full p-2 mt-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">2 Premium Tickets</h3>
                    <p className="text-sm text-slate-300">Best seats in the house</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-accent text-accent-foreground rounded-full p-2 mt-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Round-Trip Airfare</h3>
                    <p className="text-sm text-slate-300">For 2 people</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-accent text-accent-foreground rounded-full p-2 mt-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Luxury Hotel Stay</h3>
                    <p className="text-sm text-slate-300">3 nights accommodation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <Card className="p-6 md:p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Enter to Win!</h2>
                <p className="text-muted-foreground">Fill out the form below to claim your entry</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nflTeam">What is your favorite NFL team? *</Label>
                  <Select
                    value={formData.nflTeam}
                    onValueChange={(value) => setFormData({ ...formData, nflTeam: value })}
                    required
                  >
                    <SelectTrigger id="nflTeam">
                      <SelectValue placeholder="Select your team" />
                    </SelectTrigger>
                    <SelectContent>
                      {NFL_TEAMS.map((team) => (
                        <SelectItem key={team} value={team}>
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-6"
                  disabled={createEntry.isPending}
                >
                  {createEntry.isPending ? "SUBMITTING..." : "ENTER NOW →"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By entering, you agree to receive promotional emails. No purchase necessary.
                </p>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  </div>
                  <span className="font-semibold">12,847</span> people have already entered!
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* What You'll Win Section */}
      <div className="container py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What You'll Win</h2>
        <p className="text-center text-muted-foreground mb-12">
          The ultimate Super Bowl experience package valued at over $23,500
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Premium Tickets</h3>
            <p className="text-muted-foreground">2 tickets to the Super Bowl with excellent sightlines and VIP access</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Round-Trip Flights</h3>
            <p className="text-muted-foreground">Business class airfare for 2 from anywhere in the continental US</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Luxury Hotel</h3>
            <p className="text-muted-foreground">3 nights at a 5-star hotel near the stadium with all amenities</p>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container text-center text-sm space-y-2">
          <p>© 2025 Super Bowl Giveaway. No purchase necessary. Must be 18+ to enter.</p>
          <div className="flex items-center justify-center gap-4">
            <a href="/terms" className="hover:underline">Official Rules & Terms</a>
            <span>•</span>
            <a href="/terms" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

