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
  totalPlays: number;
  avgEnergy: number;
  avgValence: number;
  topTrack: Track;
  summerMood: "Sunny" | "Bittersweet" | "Moody";
  bestMatch: {
    name: string;
    emoji: string;
    color: string;
    vibe: string;
    scorePercent: number;
  };
  teamConradScore: number;    // 0–100
  teamJeremiahScore: number;  // 0–100
}

export interface TSITPWrappedProps {
  onBack: () => void;
  userData?: Track[] | null;
}