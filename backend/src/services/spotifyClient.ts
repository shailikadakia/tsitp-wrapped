import 'dotenv/config';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env');
}

let cachedToken: {
  accessToken: string;
  expiresAt: number;
} | null = null;

export async function getAppAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.accessToken;
  }

  const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token request failed: ${res.status} ${text}`);
  }

  const data = await res.json() as {
    access_token: string;
    token_type: string;
    expires_in: number;
  };

  cachedToken = {
    accessToken: data.access_token,
    // subtract a small buffer
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return data.access_token;
}
/*
// Fetch *all* tracks from a playlist (handles pagination)
async function getAllPlaylistTrackIds(playlistId: string, accessToken: string): Promise<string[]> {
  const ids: string[] = [];
  let url: string | null = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Playlist tracks failed: ${res.status} ${text}`);
    }

    const data = await res.json() as {
      items: { track: { id: string | null } | null }[];
      next: string | null;
    };

    for (const item of data.items) {
      const id = item.track?.id;
      if (id) ids.push(id);
    }

    url = data.next;
  }

  return ids;
}

// Fetch audio features in batches of up to 100 IDs
async function getAudioFeaturesForTracks(trackIds: string[], accessToken: string) {
  const features: any[] = [];
  const chunkSize = 100;

  for (let i = 0; i < trackIds.length; i += chunkSize) {
    const chunk = trackIds.slice(i, i + chunkSize);
    const res = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${chunk.join(',')}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Audio features failed: ${res.status} ${text}`);
    }

    const data = await res.json() as { audio_features: any[] };
    features.push(...data.audio_features.filter(Boolean));
  }

  return features;
}

type PlaylistAverages = {
  playlistId: string;
  trackCount: number;
  averages: {
    danceability: number;
    energy: number;
    valence: number;
    tempo: number;
    acousticness: number;
  };
};

// Public function: get averages for a playlist (Team Conrad, Jeremiah, Belly)
export async function getPlaylistFeatureAverages(playlistId: string): Promise<PlaylistAverages> {
  const token = await getAppAccessToken();
  console.log(token)

  const trackIds = await getAllPlaylistTrackIds(playlistId, token);
  if (trackIds.length === 0) {
    return {
      playlistId,
      trackCount: 0,
      averages: {
        danceability: 0,
        energy: 0,
        valence: 0,
        tempo: 0,
        acousticness: 0,
      },
    };
  }

  const features = await getAudioFeaturesForTracks(trackIds, token);

  const sums = {
    danceability: 0,
    energy: 0,
    valence: 0,
    tempo: 0,
    acousticness: 0,
  };
  let count = 0;

  for (const f of features) {
    if (!f) continue;
    sums.danceability += f.danceability ?? 0;
    sums.energy += f.energy ?? 0;
    sums.valence += f.valence ?? 0;
    sums.tempo += f.tempo ?? 0;
    sums.acousticness += f.acousticness ?? 0;
    count++;
  }

  const safeDiv = (n: number) => (count === 0 ? 0 : n / count);

  return {
    playlistId,
    trackCount: count,
    averages: {
      danceability: safeDiv(sums.danceability),
      energy: safeDiv(sums.energy),
      valence: safeDiv(sums.valence),
      tempo: safeDiv(sums.tempo),
      acousticness: safeDiv(sums.acousticness),
    },
  };
}

*/