import { Zap, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import { PricingSection } from "@/components/ui/pricing-section";

const defaultTiers = [
  {
    name: "Starter",
    price: {
      monthly: 15,
      yearly: 144,
    },
    description: "Perfect for individuals and small trips",
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/30 to-gray-500/30 blur-2xl rounded-full" />
        <Zap className="w-7 h-7 relative z-10 text-gray-500 dark:text-gray-400" />
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
      monthly: 49,
      yearly: 470,
    },
    description: "Ideal for frequent travelers and families",
    highlight: true,
    badge: "Most Popular",
    icon: (
      <div className="relative">
        <Sparkles className="w-7 h-7 relative z-10" />
      </div>
    ),
    features: [
      {
        name: "Unlimited Trip Planning",
        description: "Plan as many trips as you want",
        included: true,
      },
      {
        name: "Advanced Crowd Analytics",
        description: "Real-time crowd predictions & alerts",
        included: true,
      },
      {
        name: "Priority Support",
        description: "24/7 priority email and chat support",
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
