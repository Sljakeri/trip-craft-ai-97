import { Cloud, Lightbulb, Plane, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LogisticsProps {
  weather?: string;
  tips?: string[] | string;
  transportation?: string;
  currency?: string;
}

export const LogisticsCard = ({ weather, tips, transportation, currency }: LogisticsProps) => {
  const tipsArray = Array.isArray(tips) ? tips : tips ? [tips] : [];

  return (
    <Card className="border-border/50 shadow-soft animate-fade-in-up">
      <CardHeader className="pb-4">
        <CardTitle className="font-display text-xl flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-sunset" />
          Travel Info
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {weather && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Cloud className="w-5 h-5 text-ocean mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground text-sm">Weather</h4>
              <p className="text-muted-foreground text-sm">{weather}</p>
            </div>
          </div>
        )}
        
        {transportation && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Plane className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground text-sm">Getting There</h4>
              <p className="text-muted-foreground text-sm">{transportation}</p>
            </div>
          </div>
        )}
        
        {currency && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <CreditCard className="w-5 h-5 text-sunset mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground text-sm">Currency</h4>
              <p className="text-muted-foreground text-sm">{currency}</p>
            </div>
          </div>
        )}
        
        {tipsArray.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-foreground text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-sunset" />
              Pro Tips
            </h4>
            <ul className="space-y-2">
              {tipsArray.map((tip, index) => (
                <li key={index} className="text-sm text-muted-foreground pl-4 border-l-2 border-primary/30">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
