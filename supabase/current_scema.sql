-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.game_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  game_id uuid DEFAULT gen_random_uuid(),
  player_id uuid,
  team smallint NOT NULL,
  position smallint NOT NULL,
  tichu_call boolean,
  grand_tichu_call boolean,
  tichu_success boolean,
  bomb_count smallint,
  CONSTRAINT game_participants_pkey PRIMARY KEY (id),
  CONSTRAINT game_participants_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id),
  CONSTRAINT game_participants_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id)
);
CREATE TABLE public.game_scores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL,
  team smallint NOT NULL,
  score smallint NOT NULL,
  double_win boolean NOT NULL,
  total_score smallint NOT NULL,
  CONSTRAINT game_scores_pkey PRIMARY KEY (id),
  CONSTRAINT game_scores_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id)
);
CREATE TABLE public.games (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  beschiss boolean NOT NULL DEFAULT false,
  match_id uuid,
  source character varying,
  CONSTRAINT games_pkey PRIMARY KEY (id),
  CONSTRAINT games_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.match_series(id)
);
CREATE TABLE public.match_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL,
  player_id uuid NOT NULL,
  team integer NOT NULL CHECK (team = ANY (ARRAY[1, 2])),
  CONSTRAINT match_participants_pkey PRIMARY KEY (id),
  CONSTRAINT match_participants_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.match_series(id),
  CONSTRAINT match_participants_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id)
);
CREATE TABLE public.match_series (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  target_points integer NOT NULL,
  status character varying NOT NULL DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'completed'::character varying]::text[])),
  winning_team integer CHECK (winning_team = ANY (ARRAY[1, 2])),
  CONSTRAINT match_series_pkey PRIMARY KEY (id)
);
CREATE TABLE public.players (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name character varying NOT NULL UNIQUE,
  CONSTRAINT players_pkey PRIMARY KEY (id)
);
CREATE TABLE public.rp_games (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  number_of_players smallint,
  source character varying,
  CONSTRAINT rp_games_pkey PRIMARY KEY (id)
);
CREATE TABLE public.rp_round_participants (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  game_id uuid,
  round_id uuid,
  player_id uuid,
  princess smallint,
  points smallint,
  CONSTRAINT rp_round_participants_pkey PRIMARY KEY (id),
  CONSTRAINT rp_game_participants_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.rp_games(id),
  CONSTRAINT rp_round_participants_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id),
  CONSTRAINT rp_round_participants_round_id_fkey FOREIGN KEY (round_id) REFERENCES public.rp_rounds(id)
);
CREATE TABLE public.rp_rounds (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  game_id uuid,
  round_modifier character varying,
  points smallint,
  CONSTRAINT rp_rounds_pkey PRIMARY KEY (id),
  CONSTRAINT rp_rounds_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.rp_games(id)
);