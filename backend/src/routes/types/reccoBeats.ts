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
