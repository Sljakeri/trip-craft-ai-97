import { Brain, Clock, Wallet } from "lucide-react";
import Layout from "@/components/Layout";

const About = () => {
  const features = [
    {
      icon: Brain,
      title: "Deep Learning",
      description: "Our algorithms analyze millions of travel reviews, flight paths, and local secrets to find the best route for you.",
    },
    {
      icon: Clock,
      title: "Real-Time Optimization",
      description: "We constantly check for flight delays and weather changes to update your plans instantly.",
    },
    {
      icon: Wallet,
      title: "Budget Maximization",
      description: "The AI allocates your budget efficiently, finding luxury experiences at economy prices.",
    },
  ];

  return (
    <Layout>
      <div className="content-wrapper">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">How Our AI Works</h1>
        <p className="text-muted-foreground mb-8">The technology behind your perfect itinerary.</p>
        
        <div className="info-grid">
          {features.map((feature, index) => (
            <div key={index} className="info-card">
              <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default About;
