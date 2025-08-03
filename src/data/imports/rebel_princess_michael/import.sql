-- Import Rebel Princess games from Michael's export
INSERT INTO public.players (name) VALUES
('Daniel'), ('Domi'), ('Max'), ('Karsten'), ('Marcel'), ('Michael'), ('Moritz'), ('Nicole'), ('Eric'), ('Ralf'), ('Totti'), ('Severin'), ('Krissi')
ON CONFLICT (name) DO NOTHING;

DO $$
DECLARE
    game_id uuid;
    round_id uuid;
    player_ids uuid[];
BEGIN
    SELECT ARRAY(SELECT id FROM public.players WHERE name IN ('Daniel', 'Domi', 'Max', 'Karsten', 'Marcel', 'Michael', 'Moritz', 'Nicole', 'Eric', 'Ralf', 'Totti', 'Severin', 'Krissi') ORDER BY name) INTO player_ids;

    -- Game 2025-04-11T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-04-11T12:00:00+02:00', 3, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 14) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 9),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 4);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 14) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 9);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 22) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 20),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 2);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 14) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 7),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 7),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 0);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 14) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 7),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 2);


    -- Game 2025-04-11T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-04-11T12:00:00+02:00', 6, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 17) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Max'), 7),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 8),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Eric'), 2);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 17) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Max'), 7),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 8),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Eric'), 0);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 6) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 2),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Max'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Eric'), 4);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 17) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 3),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Max'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 9),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Eric'), 5);


    -- Game 2025-04-15T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-04-15T12:00:00+02:00', 6, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 17) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 4),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 4),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 9),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 28) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 8),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 8),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 7),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 4);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 17) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 2),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 9);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 17) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 10),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 2),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 17) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 4),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 9),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 4),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);


    -- Game 2025-04-16T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-04-16T12:00:00+02:00', 5, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 10),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 4);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 25) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 4),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 7),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 14);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 3),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 12);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 2),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 9),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 4);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 3),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 7),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 9),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 6),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);


    -- Game 2025-04-22T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-04-22T12:00:00+02:00', 5, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 10),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 3),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Krissi'), 2);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 25) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 6),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 16),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Krissi'), 2);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 3),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Krissi'), 5);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 10) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 3),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Krissi'), 2);


    -- Game 2025-04-24T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-04-24T12:00:00+02:00', 4, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 7),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Krissi'), 2);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 14) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 6),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 2),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 2),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Krissi'), 4);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 3),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 4),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 8),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Krissi'), 0);


    -- Game 2025-04-25T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-04-25T12:00:00+02:00', 4, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 4),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 6),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 14),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 9),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 4),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 2);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 13) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 7),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 6),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 4),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 2),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 9);


    -- Game 2025-05-22T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-05-22T12:00:00+02:00', 5, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 4),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 6),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 5);


    -- Game 2025-05-22T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-05-22T12:00:00+02:00', 6, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 17) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 10),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Moritz'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 17) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 6),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Moritz'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 6),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 29) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 13),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Moritz'), 11),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 31) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 20),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Moritz'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 11);


    -- Game 2025-05-22T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-05-22T12:00:00+02:00', 6, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 17) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Max'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 8),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Krissi'), 8);


    -- Game 2025-05-22T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-05-22T12:00:00+02:00', 6, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 17) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 2),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 14),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Krissi'), 0);


    -- Game 2025-05-22T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-05-22T12:00:00+02:00', 5, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 8) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 2),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 1);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 6),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 3),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 4),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 2);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 3),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 7);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 3),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 4),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 8),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 8),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Ralf'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 6);


    -- Game 2025-05-27T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-05-27T12:00:00+02:00', 4, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 4),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 10),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 10),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);


    -- Game 2025-05-27T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-05-27T12:00:00+02:00', 5, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 10),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Moritz'), 3),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 2);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 7),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 2),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Moritz'), 6),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);


    -- Game 2025-05-27T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-05-27T12:00:00+02:00', 4, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 3),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 11),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 1);


    -- Game 2025-05-28T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-05-28T12:00:00+02:00', 4, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 6),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Moritz'), 6),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 3);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 14) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 2),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 7),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Moritz'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 5);


    -- Game 2025-05-28T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-05-28T12:00:00+02:00', 5, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 7),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Moritz'), 6),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 2);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 8),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Moritz'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 1);


    -- Game 2025-05-28T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-05-28T12:00:00+02:00', 4, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Daniel'), 2),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 11),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 2),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Severin'), 0);


    -- Game 2025-06-16T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-06-16T12:00:00+02:00', 3, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 14) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 4),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Krissi'), 10);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 23) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 3),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 12),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Krissi'), 8);


    -- Game 2025-06-16T12:00:00+02:00
    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('2025-06-16T12:00:00+02:00', 4, 'michael_export') RETURNING id INTO game_id;
    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 0),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 2),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Krissi'), 13);

    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, 15) RETURNING id INTO round_id;
    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Domi'), 1),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Marcel'), 9),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Michael'), 5),
    (game_id, round_id, (SELECT id FROM public.players WHERE name = 'Krissi'), 0);

END $$;
