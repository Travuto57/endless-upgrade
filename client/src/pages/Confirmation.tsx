import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Confirmation() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary/80 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/superbowl-game.jpg')] bg-cover bg-center opacity-10"></div>
      
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className={`w-2 h-2 ${
                  i % 3 === 0
                    ? "bg-accent"
                    : i % 3 === 1
                    ? "bg-yellow-400"
                    : "bg-white"
                } opacity-80`}
                style={{
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-2xl relative z-10">
        <Card className="p-8 md:p-12 shadow-2xl text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              You're Entered!
            </h1>
            <p className="text-xl text-muted-foreground">
              Congratulations! Your entry for the Super Bowl giveaway has been confirmed.
            </p>
          </div>

          {/* Entry Number */}
          <div className="bg-primary/10 border-2 border-primary/20 rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-2">Your Entry Number</p>
            <p className="text-3xl font-bold text-primary">
              #{Math.floor(10000 + Math.random() * 90000)}
            </p>
          </div>

          {/* What's Next */}
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold">What Happens Next?</h2>
            
            <div className="grid gap-4 text-left">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-accent font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Check Your Email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation email with your entry details. Please check your inbox (and spam folder).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-accent font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Winner Announcement</h3>
                  <p className="text-sm text-muted-foreground">
                    The winner will be randomly selected and notified via email within 30 days.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-accent font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Claim Your Prize</h3>
                  <p className="text-sm text-muted-foreground">
                    If you win, we'll contact you with instructions to claim your Super Bowl package.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bonus Offer */}
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 border-2 border-accent/20 rounded-lg p-6 mt-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h3 className="text-xl font-bold">Bonus Entry Opportunity!</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Share this giveaway with friends and earn additional entries for each person who enters using your referral.
            </p>
            <Button variant="outline" className="w-full font-semibold">
              Get Your Referral Link
            </Button>
          </div>

          {/* Social Share */}
          <div className="pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Share the excitement with your friends!
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" size="icon" className="rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </Button>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <Button
              variant="outline"
              onClick={() => window.location.href = "/"}
              className="w-full"
            >
              Return to Home
            </Button>
          </div>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-white/80 text-sm mt-6">
          Good luck! We'll be in touch if you're our lucky winner. 🏆
        </p>
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

