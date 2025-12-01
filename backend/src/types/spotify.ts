export type SpotifyPlaylist = {
  playlistId: string;
  name?: string | null;
  tracks: SpotifyTrack[];
};

export type SpotifyTrack = {
  spotifyTrackId: string;
  name: string | null;
  artist: string | null;
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
