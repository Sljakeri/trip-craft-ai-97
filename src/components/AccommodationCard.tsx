import { Hotel, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AccommodationCardProps {
  name: string;
  price: string;
  reason: string;
  index: number;
}

export const AccommodationCard = ({ name, price, reason, index }: AccommodationCardProps) => {
  return (
    <Card className={`overflow-hidden border-border/50 shadow-soft hover:shadow-lifted transition-all duration-300 hover:-translate-y-1 animate-fade-in-up opacity-0 stagger-${index + 1}`}>
      {/* Image placeholder */}
      <div className="h-40 bg-gradient-to-br from-muted to-sand relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Hotel className="w-12 h-12 text-muted-foreground/30" />
        </div>
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 text-sunset fill-sunset" />
          <span className="text-xs font-medium text-foreground">Featured</span>
        </div>
      </div>
      
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-lg text-foreground line-clamp-2">
            {name}
          </h3>
        </div>
        
        <p className="text-primary font-semibold text-lg">
          {price}
        </p>
        
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {reason}
        </p>
      </CardContent>
    </Card>
  );
};
