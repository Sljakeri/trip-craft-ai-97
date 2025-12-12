import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { MapPin, CalendarDays, Wallet, Heart, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface TravelFormProps {
  onSubmit: (data: {
    destination: string;
    dates: string;
    budget: string;
    interests: string;
  }) => void;
  isLoading: boolean;
}

export const TravelForm = ({ onSubmit, isLoading }: TravelFormProps) => {
  const [destination, setDestination] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedDates = dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
      : '';

    onSubmit({
      destination,
      dates: formattedDates,
      budget,
      interests,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="bg-card rounded-2xl shadow-elevated p-8 md:p-10 space-y-6 border border-border/50">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
            Plan Your Dream Trip
          </h2>
          <p className="text-muted-foreground font-body">
            Tell us about your ideal getaway
          </p>
        </div>

        {/* Destination */}
        <div className="space-y-2">
          <Label htmlFor="destination" className="flex items-center gap-2 text-foreground font-medium">
            <MapPin className="w-4 h-4 text-primary" />
            Where to?
          </Label>
          <Input
            id="destination"
            placeholder="Paris, France"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="h-12 text-base bg-background border-border focus:border-primary focus:ring-primary/20"
            required
          />
        </div>

        {/* Dates */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground font-medium">
            <CalendarDays className="w-4 h-4 text-primary" />
            When?
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal bg-background border-border hover:bg-muted",
                  !dateRange && "text-muted-foreground"
                )}
              >
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Select your travel dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground font-medium">
            <Wallet className="w-4 h-4 text-primary" />
            Budget
          </Label>
          <Select value={budget} onValueChange={setBudget} required>
            <SelectTrigger className="h-12 text-base bg-background border-border focus:border-primary">
              <SelectValue placeholder="Select your budget range" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="low">Budget-Friendly</SelectItem>
              <SelectItem value="medium">Mid-Range</SelectItem>
              <SelectItem value="high">Premium</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <Label htmlFor="interests" className="flex items-center gap-2 text-foreground font-medium">
            <Heart className="w-4 h-4 text-primary" />
            Interests & Preferences
          </Label>
          <Textarea
            id="interests"
            placeholder="History, Wine tasting, Jazz music, Local cuisine, Art galleries..."
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="min-h-[100px] text-base bg-background border-border focus:border-primary focus:ring-primary/20 resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="hero"
          size="xl"
          className="w-full mt-4"
          disabled={isLoading || !destination || !budget}
        >
          <Sparkles className="w-5 h-5" />
          Plan My Trip
        </Button>
      </div>
    </form>
  );
};
