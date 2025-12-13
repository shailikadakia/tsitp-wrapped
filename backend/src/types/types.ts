export type BestMatch = {
  playlistId: number;
  spotifyPlaylistId: string;
  name: string;
  score: number;
  scorePercent: number;
};

export type PlaylistScore = {
  playlistId: number;
  spotifyPlaylistId: string;
  name: string;
  score: number;        
  scorePercent: number; 
};

export type ReccoBeatsAudioFeatures = {
  content?: Array<{
    id?: string;
    href?: string;
    acousticness?: number;
    danceability?: number;
    energy?: number;
    instrumentalness?: number;
    key?: number;
    liveness?: number;
    loudness?: number;
    mode?: number;
    speechiness?: number;
    tempo?: number;
    valence?: number;
  }>;
};


export type SpotifyPlaylist = {
  playlistId: string;
  name?: string | null;
  tracks: SpotifyTrack[];
};

export type SpotifyTrack = {
  spotifyTrackId: string;
  name: string | null;
  artist: string[]
};

export type SpotifyPlaylistAPIResponse = {
  name: string;
  tracks: {
    items: {
      track: {
        id: string;
        name: string;
        artists: { name: string }[];
      } | null;
    }[];
  };
};