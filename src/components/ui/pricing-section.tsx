"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Feature {
  name: string
  description: string
  included: boolean
}

interface PricingTier {
  name: string
  price: {
    monthly: number
    yearly: number
  }
  description: string
  features: Feature[]
  highlight?: boolean
  badge?: string
  icon: React.ReactNode
}

interface PricingSectionProps {
  tiers: PricingTier[]
  className?: string
}

function PricingSection({ tiers, className }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section
      className={cn(
        "relative bg-background text-foreground",
        "py-12 px-4 md:py-24 lg:py-32",
        "overflow-hidden",
        className,
      )}
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-3xl font-bold text-foreground">
            Simple, transparent pricing
          </h2>
          <div className="inline-flex items-center p-1.5 bg-card rounded-full border border-border shadow-sm">
            {["Monthly", "Yearly"].map((period) => (
              <button
                key={period}
                onClick={() => setIsYearly(period === "Yearly")}
                className={cn(
                  "px-8 py-2.5 text-sm font-medium rounded-full transition-all duration-300",
                  (period === "Yearly") === isYearly
                    ? "bg-foreground text-background shadow-lg"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative group backdrop-blur-sm",
                "rounded-3xl transition-all duration-300",
                "flex flex-col",
                tier.highlight
                  ? "bg-foreground text-background"
                  : "bg-card",
                "border",
                tier.highlight
                  ? "border-foreground shadow-xl"
                  : "border-border shadow-md",
                "hover:shadow-lg",
              )}
            >
              {tier.badge && tier.highlight && (
                <div className="absolute -top-4 left-6">
                  <Badge className="px-4 py-1.5 text-sm font-medium bg-card text-foreground border-none shadow-lg">
                    {tier.badge}
                  </Badge>
                </div>
              )}

              <div className="p-8 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl",
                      tier.highlight
                        ? "bg-background/10"
                        : "bg-secondary",
                    )}
                  >
                    {tier.icon}
                  </div>
                  <h3 className={cn(
                    "text-xl font-semibold",
                    tier.highlight ? "text-background" : "text-foreground"
                  )}>
                    {tier.name}
                  </h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className={cn(
                      "text-4xl font-bold",
                      tier.highlight ? "text-background" : "text-foreground"
                    )}>
                      ${isYearly ? tier.price.yearly : tier.price.monthly}
                    </span>
                    <span className={cn(
                      "text-sm",
                      tier.highlight ? "text-background/70" : "text-muted-foreground"
                    )}>
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                  <p className={cn(
                    "mt-2 text-sm",
                    tier.highlight ? "text-background/70" : "text-muted-foreground"
                  )}>
                    {tier.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {tier.features.map((feature) => (
                    <div key={feature.name} className="flex gap-4">
                      <div
                        className={cn(
                          "mt-1 p-0.5 rounded-full transition-colors duration-200",
                          feature.included
                            ? tier.highlight ? "text-emerald-400" : "text-emerald-600"
                            : tier.highlight ? "text-background/40" : "text-muted-foreground",
                        )}
                      >
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={cn(
                          "text-sm font-medium",
                          tier.highlight ? "text-background" : "text-foreground"
                        )}>
                          {feature.name}
                        </div>
                        <div className={cn(
                          "text-sm",
                          tier.highlight ? "text-background/70" : "text-muted-foreground"
                        )}>
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 pt-0 mt-auto">
                <Button
                  className={cn(
                    "w-full h-12 relative transition-all duration-300 font-semibold",
                    tier.highlight
                      ? "bg-card text-foreground hover:bg-card/90 shadow-lg"
                      : "bg-foreground text-background hover:bg-foreground/90",
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {tier.highlight ? (
                      <>
                        Buy now
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Get started
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { PricingSection }