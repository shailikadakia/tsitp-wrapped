
  # Interactive Music Dashboard

  This is a code bundle for Interactive Music Dashboard. The original project is available at https://www.figma.com/design/xBgers3PF77oGXemxajY37/Interactive-Music-Dashboard.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.


  When they click “Start my TSITP Wrapped”, you:

Fetch:

/me (id, display_name, country)

/me/player/recently-played (last ≤50 tracks)

/me/top/tracks + /me/top/artists (maybe short_term)

/audio-features for those tracks

Immediately compute your metrics and save something like this:

1. Your OTP (Team Conrad vs Jeremiah)

Store:

team: "Conrad" or "Jeremiah" (or "Belly", "Split", etc.)

conrad_score: number 0–1

jeremiah_score: number 0–1

optional explanation fields:

%sad_lyric_tracks

%upbeat_pop_tracks

%acoustic / indie

avg valence, avg energy

This lets you render:
“Your OTP: Conrad (72% Conrad, 28% Jeremiah) – you love moody lyrics and chill indie vibes.”

2. Character Match

You’ll probably map each character to a “reference playlist profile”.

Store:

character_matches: array of:

character_id (e.g. "Conrad", "Jeremiah", "Belly", "Steven")

similarity_score (0–1)

top_character_id (best match)

maybe top_3_tracks_used_for_match (track IDs)

Then you can show a card:
“Your closest match: Belly – 0.83 similarity.”

3. Summer Stats

Nice simple stats from last 50 + top items:

Store:

unique_tracks_count

unique_artists_count

top_artist_name

top_genre

avg_bpm

avg_danceability

morning_vs_night_ratio (plays 6am–6pm vs 6pm–6am)

%tsitp_soundtrack_tracks (if you check against TSITP playlist ids)

This powers:
“23 artists, 7 genres, avg tempo 112 BPM, 60% of your listening was late-night.”

4. Mood Analysis

Use audio features from Spotify (valence, energy, danceability, acousticness, etc.):

Store:

avg_valence (0–1)

avg_energy

avg_danceability

mood_label (e.g. "Sun-soaked pop", "Stormy and introspective")

maybe a simple distribution:

%chill_tracks

%party_tracks

%sad_girl_summer_tracks

This powers your copy:
“Your vibe: Soft sunset energy – high valence but medium energy, lots of dreamy pop.”

Minimal DB shape (example)

You could keep it super simple:

users

id (your app user id)

spotify_id

analysis_runs

id

user_id

created_at

JSON fields:

otp_result

character_match

summer_stats

mood_analysis

maybe raw_tracks (optional: the 50 track IDs + played_at)
  
