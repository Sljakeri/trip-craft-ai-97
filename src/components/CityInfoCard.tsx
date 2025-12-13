import { Droplets, Shield, Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CityInfoProps {
  waterDrinkable: boolean;
  safetyAdvisory: string;
  currency: string;
}

export const CityInfoCard = ({ waterDrinkable, safetyAdvisory, currency }: CityInfoProps) => {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${waterDrinkable ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <Droplets className={`h-5 w-5 ${waterDrinkable ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tap Water</p>
              <p className="font-semibold text-foreground">
                {waterDrinkable ? "Safe to Drink" : "Not Recommended"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Currency</p>
              <p className="font-semibold text-foreground">{currency}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Shield className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Safety</p>
              <p className="font-semibold text-foreground text-sm">{safetyAdvisory}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CityInfoCard;
