-- Create saved_trips table
CREATE TABLE public.saved_trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  origin TEXT,
  destination TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  budget TEXT,
  travelers_adults INTEGER DEFAULT 1,
  travelers_kids INTEGER DEFAULT 0,
  transport_modes TEXT[],
  crowd_preference TEXT,
  trip_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_trips ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_trips
CREATE POLICY "Users can view their own trips" 
ON public.saved_trips 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trips" 
ON public.saved_trips 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips" 
ON public.saved_trips 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" 
ON public.saved_trips 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_saved_trips_updated_at
  BEFORE UPDATE ON public.saved_trips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster user queries
CREATE INDEX idx_saved_trips_user_id ON public.saved_trips(user_id);
CREATE INDEX idx_saved_trips_created_at ON public.saved_trips(created_at DESC);