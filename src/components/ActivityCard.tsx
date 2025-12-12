import { Camera, Clock, MapPin } from 'lucide-react';

interface ActivityCardProps {
  name: string;
  duration?: string;
  description?: string;
  location?: string;
  index: number;
}

export const ActivityCard = ({ name, duration, description, location, index }: ActivityCardProps) => {
  return (
    <div className={`flex gap-4 p-4 rounded-xl bg-card border border-border/50 shadow-soft hover:shadow-lifted transition-all duration-300 animate-slide-in opacity-0 stagger-${index + 1}`}>
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-ocean/10 flex items-center justify-center">
        <Camera className="w-5 h-5 text-ocean" />
      </div>
      
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="font-display font-semibold text-foreground">{name}</h4>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {duration}
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {location}
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};
