import { Check } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const Premium = () => {
  const { toast } = useToast();

  const handleSelectPlan = (plan: string) => {
    toast({
      title: "Plan Selected",
      description: `${plan} plan selection coming soon!`,
    });
  };

  const plans = [
    {
      name: "Explorer",
      price: "Free",
      priceNote: "",
      features: [
        "1 Trip per month",
        "Basic AI Suggestions",
        "Email Support",
      ],
      buttonText: "Select Free",
      buttonClass: "transport-btn w-full justify-center",
      popular: false,
    },
    {
      name: "Voyager",
      price: "$12",
      priceNote: "/mo",
      features: [
        "Unlimited Trips",
        "Advanced AI Customization",
        "24/7 AI Chat Assistant",
      ],
      buttonText: "Go Pro",
      buttonClass: "confirm-btn",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Contact",
      priceNote: "",
      features: [
        "Team Collaboration",
        "Custom AI Training",
        "Dedicated Account Manager",
      ],
      buttonText: "Contact Sales",
      buttonClass: "transport-btn w-full justify-center",
      popular: false,
    },
  ];

  return (
    <Layout>
      <div className="content-wrapper">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Choose Your Plan</h1>
        <p className="text-secondary mb-8">Unlock the full potential of AI travel.</p>
        
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.popular ? "popular" : ""}`}>
              {plan.popular && <div className="badge">Most Popular</div>}
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <div className="price">
                {plan.price}
                {plan.priceNote && <span>{plan.priceNote}</span>}
              </div>
              <ul className="list-none text-left mb-8 space-y-3">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2 text-foreground">
                    <Check className="h-5 w-5 text-secondary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan(plan.name)}
                className={plan.buttonClass}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Premium;
