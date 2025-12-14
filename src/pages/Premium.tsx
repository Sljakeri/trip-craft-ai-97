import { Zap, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import { PricingSection } from "@/components/ui/pricing-section";

const defaultTiers = [
  {
    name: "Free",
    price: {
      monthly: 0,
      yearly: 0,
    },
    description: "Perfect for individuals and small trips",
    icon: (
      <div className="relative">
        <Zap className="w-7 h-7 relative z-10 text-primary" />
      </div>
    ),
    features: [
      {
        name: "Basic Trip Planning",
        description: "Plan up to 3 trips per month",
        included: true,
      },
      {
        name: "Crowd Insights",
        description: "Basic crowd level predictions",
        included: true,
      },
      {
        name: "Email Support",
        description: "Get help within 24 hours",
        included: true,
      },
      {
        name: "AI Chat Assistant",
        description: "24/7 AI-powered travel assistance",
        included: false,
      },
    ],
  },
  {
    name: "Pro",
    price: {
      monthly: 9.99,
      yearly: 99.99,
    },
    description: "Ideal for frequent travelers and families",
    highlight: true,
    badge: "Most Popular",
    icon: (
      <div className="relative">
        <Sparkles className="w-7 h-7 relative z-10 text-primary" />
      </div>
    ),
    features: [
      {
        name: "Unlimited Trip Planning",
        description: "Plan as many trips as you want",
        included: true,
      },
      {
        name: "Live Map Editing",
        description: "Edit and customize your routes in real-time",
        included: true,
      },
      {
        name: "Advanced Crowd Analytics",
        description: "Real-time crowd predictions & alerts",
        included: true,
      },
      {
        name: "AI Chat Assistant",
        description: "Personal AI travel concierge",
        included: true,
      },
    ],
  },
];

const Premium = () => {
  return (
    <Layout>
      <PricingSection tiers={defaultTiers} />
    </Layout>
  );
};

export default Premium;
