import { MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CrowdScores {
  "08:00": number;
  "12:00": number;
  "16:00": number;
  "20:00": number;
}

interface DestinationCardProps {
  name: string;
  description: string;
  coordinates: { lat: number; lng: number };
  crowdScores: CrowdScores;
  isGem?: boolean;
  type?: string;
}

const getCrowdLevel = (score: number) => {
  if (score < 30) return { label: "Low", color: "bg-green-500" };
  if (score < 60) return { label: "Moderate", color: "bg-amber-500" };
  return { label: "High", color: "bg-red-500" };
};

export const DestinationCard = ({ 
  name, 
  description, 
  coordinates, 
  crowdScores, 
  isGem = false,
  type 
}: DestinationCardProps) => {
  const timeSlots = ["08:00", "12:00", "16:00", "20:00"] as const;

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isGem && (
                <span className="text-xs px-2 py-0.5 bg-secondary/20 text-secondary rounded-full font-medium">
                  {type || "Hidden Gem"}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
          </div>
          <a 
            href={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <MapPin className="h-4 w-4 text-primary" />
          </a>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Crowd Levels</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((time) => {
              const score = crowdScores[time];
              const crowd = getCrowdLevel(score);
              return (
                <div key={time} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">{time}</div>
                  <div className={`h-2 rounded-full ${crowd.color} opacity-80`} 
                       style={{ width: `${Math.max(score, 10)}%`, margin: '0 auto' }} />
                  <div className="text-xs font-medium text-foreground mt-1">{score}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DestinationCard;
