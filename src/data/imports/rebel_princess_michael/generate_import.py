#!/usr/bin/env python3
import csv
import sys
from datetime import datetime
from zoneinfo import ZoneInfo

# Read CSV and generate SQL
with open('export.csv', 'r') as f:
    reader = csv.reader(f)
    header = next(reader)
    players = [name for name in header[2:15] if name.strip()]
    
    print("-- Import Rebel Princess games from Michael's export")
    print("INSERT INTO public.players (name) VALUES")
    print("(" + "), (".join([f"'{p}'" for p in players]) + ")")
    print("ON CONFLICT (name) DO NOTHING;\n")
    
    print("DO $$")
    print("DECLARE")
    print("    game_id uuid;")
    print("    round_id uuid;")
    print("    player_ids uuid[];")
    print("BEGIN")
    print("    SELECT ARRAY(SELECT id FROM public.players WHERE name IN ('" + "', '".join(players) + "') ORDER BY name) INTO player_ids;\n")
    
    current_date = None
    current_players = None
    game_started = False
    
    row_count = 0
    for row in reader:
        row_count += 1
        print(f"    -- Processing row {row_count}: {row[:3]}...", file=sys.stderr)
        if len(row) < 2:
            continue
        date_str = row[0]
        try:
            check_sum = int(row[1])
        except ValueError:
            continue
        scores = [int(x) if x.strip() else None for x in row[2:2+len(players)]]
        
        # Convert date to 12:00 Berlin time
        date_obj = datetime.strptime(date_str, '%d.%m.%Y').replace(hour=12, tzinfo=ZoneInfo('Europe/Berlin')).isoformat()
        
        # Get active player indices
        active_player_indices = [i for i, s in enumerate(scores) if s is not None]
        
        # Start new game if date or players changed
        if current_date != date_obj or current_players != active_player_indices:
            if game_started:
                print()  # End previous game
            current_date = date_obj
            current_players = active_player_indices
            active_players = len(active_player_indices)
            print(f"    -- Game {date_obj}")
            print(f"    INSERT INTO public.rp_games (timestamp, number_of_players, source) VALUES ('{date_obj}', {active_players}, 'michael_export') RETURNING id INTO game_id;")
            game_started = True
        
        # Add round
        print(f"    INSERT INTO public.rp_rounds (game_id, points) VALUES (game_id, {check_sum}) RETURNING id INTO round_id;")
        
        # Add participants
        participants = []
        for i, score in enumerate(scores):
            if score is not None:
                participants.append(f"(game_id, round_id, (SELECT id FROM public.players WHERE name = '{players[i]}'), {score})")
        
        if participants:
            print(f"    INSERT INTO public.rp_round_participants (game_id, round_id, player_id, points) VALUES")
            print("    " + ",\n    ".join(participants) + ";")
        print()
    
    print("END $$;")