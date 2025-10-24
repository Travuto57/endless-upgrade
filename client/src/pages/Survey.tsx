import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const surveyQuestions = [
  {
    id: 1,
    question: "How often do you watch NFL games?",
    options: [
      "Every game",
      "Weekly during season",
      "Occasionally",
      "Rarely",
      "Never"
    ]
  },
  {
    id: 2,
    question: "What's your favorite part of the Super Bowl?",
    options: [
      "The game itself",
      "Halftime show",
      "Commercials",
      "Social gathering",
      "All of the above"
    ]
  },
  {
    id: 3,
    question: "Have you ever attended an NFL game in person?",
    options: [
      "Yes, multiple times",
      "Yes, once",
      "No, but I'd love to",
      "No, not interested"
    ]
  },
  {
    id: 4,
    question: "How would you rate your interest in sports travel experiences?",
    options: [
      "Extremely interested",
      "Very interested",
      "Moderately interested",
      "Slightly interested",
      "Not interested"
    ]
  },
  {
    id: 5,
    question: "Which best describes your typical game day plans?",
    options: [
      "Watch at home with family/friends",
      "Go to a sports bar",
      "Attend games in person",
      "Stream on mobile",
      "Don't watch sports"
    ]
  }
];

export default function Survey() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((currentQuestion + 1) / surveyQuestions.length) * 100;

  const handleAnswer = (answer: string) => {
    setAnswers({
      ...answers,
      [surveyQuestions[currentQuestion].id]: answer
    });
  };

  const handleNext = () => {
    if (!answers[surveyQuestions[currentQuestion].id]) {
      toast.error("Please select an answer");
      return;
    }

    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Redirect to external partner offer (common in giveaway funnels)
    setTimeout(() => {
      window.location.href = "https://www.stubhub.com/nfl-tickets/grouping/102?gcid=chDIG-_-geoUS-_-genNFL-_-dt240730-_-cmpBR_Gen_US_DSA-_-partBing-_-mktSearch-_-adgDSA";
    }, 500);
  };

  const currentQ = surveyQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Quick Survey</h1>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {surveyQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Just {surveyQuestions.length - currentQuestion - 1} more {surveyQuestions.length - currentQuestion - 1 === 1 ? 'question' : 'questions'} to complete your entry!
          </p>
        </div>

        {/* Question Card */}
        <Card className="p-8 shadow-xl">
          <div className="space-y-6">
            <div>
              <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                Question {currentQuestion + 1}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                {currentQ.question}
              </h2>
            </div>

            <RadioGroup
              value={answers[currentQ.id] || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {currentQ.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
                    answers[currentQ.id] === option
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  }`}
                  onClick={() => handleAnswer(option)}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              {currentQuestion > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  ← Back
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                disabled={!answers[currentQ.id] || isSubmitting}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              >
                {isSubmitting
                  ? "Submitting..."
                  : currentQuestion === surveyQuestions.length - 1
                  ? "Complete Entry →"
                  : "Next →"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span>No spam guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>Takes ~2 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

