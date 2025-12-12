import { Utensils, MapPin, Clock } from 'lucide-react';

interface DiningCardProps {
  name: string;
  cuisine?: string;
  priceRange?: string;
  description?: string;
  index: number;
}

export const DiningCard = ({ name, cuisine, priceRange, description, index }: DiningCardProps) => {
  return (
    <div className={`flex gap-4 p-4 rounded-xl bg-card border border-border/50 shadow-soft hover:shadow-lifted transition-all duration-300 animate-slide-in opacity-0 stagger-${index + 1}`}>
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sunset/10 flex items-center justify-center">
        <Utensils className="w-5 h-5 text-sunset" />
      </div>
      
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-display font-semibold text-foreground">{name}</h4>
          {priceRange && (
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {priceRange}
            </span>
          )}
        </div>
        
        {cuisine && (
          <p className="text-sm text-primary font-medium">{cuisine}</p>
        )}
        
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
};
