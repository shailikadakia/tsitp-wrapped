export type CharacterScore = {
  playlistId: number;
  spotifyPlaylistId: string;
  name: string;
  score: number;
  scorePercent: number;
};

export type ShipScores = {
  teamConrad: CharacterScore;
  teamJeremiah: CharacterScore;
};

export type TsitpScoresResponse = {
  characterMatch: CharacterScore;                     
  characterScores: Record<string, CharacterScore>;    
  shipMatch: string;                                  
  shipScores: ShipScores;                             
  soundtrackOverlap: SoundtrackOverlap;
  artistOverlap: ArtistOverlap;
  characterAudioFeatures: AudioFeatures | null;
  summerMood: AudioFeatures | null
};

export interface Track {
  name: string;
  artist: string;
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
  plays: number;
}

export interface CharacterPlaylist {
  name: string;
  color: string;
  emoji: string;
  vibe: string;
  tracks: Track[];
  avgEnergy: number;
  avgValence: number;
}

export interface UserStats {
  bestMatch: {
    name: string;
    emoji: string;
    color: string;
    vibe: string;
    scorePercent: number;
  };
  teamConradScore: number;    
  teamJeremiahScore: number;  
  soundtrackOverlap: SoundtrackOverlap;
  artistOverlap: ArtistOverlap;
  characterAudioFeatures: AudioFeatures | null;
  summerMood: AudioFeatures | null;
}

export interface TSITPWrappedProps {
  onBack: () => void;
  userData?: Track[] | null;
}

export type SoundtrackOverlap = {
  overlapCount: number;
  overlapTracks: {
    spotifyTrackId: string;
    name: string | null;
    artist: string[] | null;
  }[];
};

export type ArtistOverlap = {
  overlapCount: number;
  overlapArtists: string[];
};

export type AudioFeatures = {
  playlistId: number;
  playlistName: string;
  count: number;
  avgDanceability: number | null;
  avgEnergy: number | null;
  avgValence: number | null;
  avgAcoustics: number | null
};
