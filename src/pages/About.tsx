import { MapPin, Sparkles, Leaf, ArrowUpRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      icon: MapPin,
      title: "Define Trip",
      description: "Set your destination, budget, and crowd preferences.",
    },
    {
      number: 2,
      icon: Sparkles,
      title: "AI Processing",
      description: "Our engine scans historical data & live sensors.",
    },
    {
      number: 3,
      icon: Leaf,
      title: "Experience",
      description: "Travel comfortably with optimized routing.",
    },
  ];

  return (
    <Layout>
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How it works
            </h1>
            <p className="text-muted-foreground text-lg">
              We use AI to make your vacation more peaceful.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 mb-16">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    {/* Circle with icon */}
                    <div className="w-24 h-24 rounded-full bg-muted/50 border border-border flex items-center justify-center shadow-sm">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    {/* Number badge */}
                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shadow-md">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-[200px]">
                    {step.description}
                  </p>
                </div>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block text-muted-foreground/40 mx-4">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/")}
              className="h-12 px-8 text-base font-medium"
            >
              Get Started Now
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
