import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";

export default function ThankYou() {
  const surveyUrl = "https://surveyboss.typeform.com/to/vbilA4PF?typeform-source=superbowl-lw6rh2sj.manus.space";
  const [entryId, setEntryId] = useState<number | null>(null);
  const markSurvey = trpc.giveaway.markSurveyClicked.useMutation();

  useEffect(() => {
    // Get entry ID from session storage (set by Home page after successful submission)
    const storedId = sessionStorage.getItem('giveawayEntryId');
    if (storedId) {
      setEntryId(parseInt(storedId));
    }
  }, []);

  const handleSurveyClick = () => {
    if (entryId) {
      markSurvey.mutate({ entryId });
    }
    window.open(surveyUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-center">
            <img src="/logo.png" alt="PrizeHub Pro" className="h-12 md:h-16" />
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">You're Entered!</h1>
          <p className="text-lg text-muted-foreground">
            Your entry for the Super Bowl giveaway has been confirmed.
          </p>
        </div>

        {/* Bonus Offer Card */}
        <Card className="overflow-hidden border-4 border-[#FF6B35] shadow-2xl">
          {/* Orange Header */}
          <div className="bg-[#FF6B35] text-white p-8 text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-4">
              🎁 EXCLUSIVE BONUS OFFER
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get a 4-Night Hotel Stay courtesy of big brands eager for your feedback
            </h2>
            <p className="text-xl text-white/90">
              Complete our 3-minute survey and claim your reward
            </p>
          </div>

          {/* White Content Area */}
          <div className="bg-white p-8">
            {/* Value Props */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-3">
                  <svg className="w-8 h-8 text-[#FF6B35]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">$800+ Value</h3>
                <p className="text-sm text-muted-foreground">
                  4-night hotel accommodation at select destinations
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Only 3 Minutes</h3>
                <p className="text-sm text-muted-foreground">
                  Quick and easy survey about your travel preferences
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Limited Time</h3>
                <p className="text-sm text-muted-foreground">
                  Over 10,000 people have already claimed this offer
                </p>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
              <p className="text-muted-foreground italic mb-3">
                "I couldn't believe it was real! Completed the survey and got my hotel voucher within 24 hours. Used it for our anniversary trip to Miami!"
              </p>
              <p className="text-sm font-semibold">- Sarah M., verified participant</p>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleSurveyClick}
              className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-bold text-lg py-8 text-xl"
            >
              Claim My 4-Night Hotel Stay →
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              No credit card required • Instant confirmation • 100% free
            </p>

            {/* Referral Section */}
            <div className="mt-8 pt-8 border-t text-center">
              <p className="text-sm text-muted-foreground mb-3">
                💡 Want to increase your chances of winning the Super Bowl trip?
              </p>
              <Button variant="outline" className="font-semibold text-[#FF6B35] border-[#FF6B35]">
                Get Your Referral Link & Earn Bonus Entries
              </Button>
            </div>
          </div>
        </Card>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-3">Is this really free?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! Major brands sponsor these surveys to understand customer preferences. Your 4-night stay is completely free with no hidden fees.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg mb-3">When will I receive my voucher?</h3>
              <p className="text-muted-foreground text-sm">
                You'll receive your hotel voucher via email within 24-48 hours after completing the survey.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg mb-3">When will the Super Bowl winner be announced?</h3>
              <p className="text-muted-foreground text-sm">
                The winner will be randomly selected at the end of the contest period and notified via email and phone within 48 hours.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg mb-3">Can I enter multiple times?</h3>
              <p className="text-muted-foreground text-sm">
                One entry per person, but you can earn bonus entries by referring friends using your unique referral link!
              </p>
            </Card>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <a href="/" className="text-muted-foreground hover:text-foreground underline">
            ← Back to Home
          </a>
        </div>
      </div>
      </div>
    </div>
  );
}

