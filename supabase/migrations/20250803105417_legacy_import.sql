-- Add source column to games table
ALTER TABLE public.games 
ADD COLUMN source varchar(50) NULL;

-- Add source column to rp_games table  
ALTER TABLE public.rp_games 
ADD COLUMN source varchar(50) NULL;