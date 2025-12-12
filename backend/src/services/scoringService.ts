import { PrismaClient, Playlist } from "@prisma/client";
import type { AudioFeatures as AudioFeaturesModel } from "@prisma/client";
import { ensureTracksSynced } from "./trackSyncService";
import { PlaylistScore, BestMatch } from "../types/types";
import 'dotenv/config';


const prisma = new PrismaClient();

const BELLY = process.env.BELLY!
const JEREMIAH = process.env.JEREMIAH!
const CONRAD = process.env.CONRAD!
const TAYLOR = process.env.TAYLOR!
const STEVEN= process.env.STEVEN!
const SHOW = process.env.SHOW!
const TEAM_CONRAD= process.env.TEAM_CONRAD!
const TEAM_JEREMIAH = process.env.TEAM_JEREMIAH!

function loudnessToUnit(loudnessDb: number): number {
  const min = -60;
  const max = 0;
  const clamped = Math.min(max, Math.max(min, loudnessDb));
  return (clamped - min) / (max - min); // [-60,0] -> [0,1]
}

function audioFeaturesToVector(af: AudioFeaturesModel | null): number[] | null {
  if (!af) return null;

  const {
    danceability,
    energy,
    valence,
    tempo,
    acousticness,
    instrumentalness,
    loudness,
    liveness,
    speechiness,
  } = af;

  if (
    danceability == null ||
    energy == null ||
    valence == null ||
    tempo == null ||
    acousticness == null ||
    instrumentalness == null ||
    loudness == null ||
    liveness == null ||
    speechiness == null
  ) {
    return null;
  }

  const tempoScaled = (tempo / 200) * 0.25; 
  const loudnessScaled = loudnessToUnit(loudness);

  return [
    danceability,
    energy,
    valence,
    tempoScaled,
    acousticness,
    instrumentalness,
    loudnessScaled,
    liveness,
    speechiness,
  ];
}

function computeCentroid(vectors: number[][]): number[] {
  if (vectors.length === 0) {
    throw new Error("computeCentroid called with no vectors");
  }

  const dim = vectors[0]!.length;
  const sum = new Array(dim).fill(0);

  for (const v of vectors) {
    for (let i = 0; i < dim; i++) {
      sum[i] += v[i];
    }
  }

  return sum.map((x) => x / vectors.length);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("cosineSimilarity: vector length mismatch");
  }

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    magA += a[i]! * a[i]!;
    magB += b[i]! * b[i]!;
  }

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  if (denom === 0) return 0;
  return dot / denom;
}

export async function getPlaylistCentroidById(
  playlistId: number
): Promise<{ playlist: Playlist; centroid: number[]; usedTracks: number }> {
  const playlist = await prisma.playlist.findUnique({
    where: { id: playlistId },
    include: {
      tracks: {
        include: {
          track: {
            include: {
              audioFeatures: true,
            },
          },
        },
      },
    },
  });

  if (!playlist) {
    throw new Error(`Playlist id=${playlistId} not found`);
  }

  const vectors: number[][] = [];

  for (const pt of playlist.tracks) {
    const v = audioFeaturesToVector(pt.track.audioFeatures);
    if (v) vectors.push(v);
  }

  if (vectors.length === 0) {
    throw new Error(
      `No usable audioFeatures for playlist id=${playlistId} (tracks without AF or with null fields).`
    );
  }

  const centroid = computeCentroid(vectors);

  return {
    playlist,
    centroid,
    usedTracks: vectors.length,
  };
}

export async function getPlaylistCentroidBySpotifyId(
  spotifyPlaylistId: string
): Promise<{ playlist: Playlist; centroid: number[]; usedTracks: number }> {
  const playlist = await prisma.playlist.findUnique({
    where: { spotifyPlaylistId },
    include: {
      tracks: {
        include: {
          track: {
            include: {
              audioFeatures: true,
            },
          },
        },
      },
    },
  });

  if (!playlist) {
    throw new Error(
      `Playlist spotifyPlaylistId=${spotifyPlaylistId} not found in DB (did you run addTracksToPlaylist first?)`
    );
  }

  const vectors: number[][] = [];

  for (const pt of playlist.tracks) {
    const v = audioFeaturesToVector(pt.track.audioFeatures);
    if (v) vectors.push(v);
  }

  if (vectors.length === 0) {
    throw new Error(
      `No usable audioFeatures for playlist spotifyPlaylistId=${spotifyPlaylistId}.`
    );
  }

  const centroid = computeCentroid(vectors);

  return {
    playlist,
    centroid,
    usedTracks: vectors.length,
  };

  
}

export async function getUserCentroidFromSpotifyTrackIds(
  spotifyTrackIds: string[]
): Promise<{ centroid: number[]; usedTracks: number }> {
  if (spotifyTrackIds.length === 0) {
    throw new Error("No spotifyTrackIds provided");
  }

  await ensureTracksSynced(spotifyTrackIds);

  const tracks = await prisma.track.findMany({
    where: { spotifyTrackId: { in: spotifyTrackIds } },
    include: { audioFeatures: true },
  });

  const vectors: number[][] = [];

  for (const t of tracks) {
    const v = audioFeaturesToVector(t.audioFeatures);
    if (v) vectors.push(v);
  }

  if (vectors.length === 0) {
    throw new Error("No usable audioFeatures for provided spotifyTrackIds");
  }

  const centroid = computeCentroid(vectors);

  return {
    centroid,
    usedTracks: vectors.length,
  };
}

export async function scoreUserAgainstPlaylistBySpotifyId(
  spotifyPlaylistId: string,
  userSpotifyTrackIds: string[]   
): Promise<PlaylistScore> {
  const { playlist, centroid: playlistCentroid } =
    await getPlaylistCentroidBySpotifyId(spotifyPlaylistId);

  const { centroid: userCentroid } =
    await getUserCentroidFromSpotifyTrackIds(userSpotifyTrackIds);

  const raw = cosineSimilarity(userCentroid, playlistCentroid);
  const scorePercent = Math.round(raw * 100);

  return {
    playlistId: playlist.id,
    spotifyPlaylistId: playlist.spotifyPlaylistId,
    name: playlist.name,
    score: raw,
    scorePercent,
  };
}

export async function scoreUserForCharacters(
  userSpotifyTrackIds: string[]
) {
  const [belly, conrad, jeremiah, steven, taylor] = await Promise.all([
    scoreUserAgainstPlaylistBySpotifyId(BELLY, userSpotifyTrackIds),
    scoreUserAgainstPlaylistBySpotifyId(CONRAD, userSpotifyTrackIds),
    scoreUserAgainstPlaylistBySpotifyId(JEREMIAH, userSpotifyTrackIds),
    scoreUserAgainstPlaylistBySpotifyId(STEVEN, userSpotifyTrackIds),
    scoreUserAgainstPlaylistBySpotifyId(TAYLOR, userSpotifyTrackIds)
  ]);

  const all = [belly, conrad, jeremiah, steven, taylor];
  const best = all.slice().sort((a, b) => b.score - a.score)[0];

  return {
    bestMatch: best,
    allScores: {
      belly,
      conrad,
      jeremiah,
      steven, 
      taylor
    },
  };
}

export async function scoreUserForShips(
  userSpotifyTrackIds: string[]
) {
  const [teamConrad, teamJeremiah] = await Promise.all([
    scoreUserAgainstPlaylistBySpotifyId(TEAM_CONRAD, userSpotifyTrackIds),
    scoreUserAgainstPlaylistBySpotifyId(TEAM_JEREMIAH, userSpotifyTrackIds),
  ]);

  const ship =
    teamConrad.score >= teamJeremiah.score ? "Team Conrad" : "Team Jeremiah";

  return {
    shipMatch: ship,
    scores: {
      teamConrad,
      teamJeremiah,
    },
  };
}

export async function countSoundtrackOverlap(spotifyTrackIds: string[]) {
  if (!spotifyTrackIds || spotifyTrackIds.length === 0) {
    return { overlapCount: 0, overlapTracks: [] };
  }

  const overlappingTracks = await prisma.track.findMany({
    where: {
      spotifyTrackId: { in: spotifyTrackIds },

      playlistEntries: {
        some: {
          playlist: {
            spotifyPlaylistId: SHOW,
          },
        },
      },
    },
    select: {
      spotifyTrackId: true,
      name: true,
      artist: true,
    },
  });

  return {
    overlapCount: overlappingTracks.length,
    overlapTracks: overlappingTracks, 
  };
}

export async function countArtistOverlap(spotifyTrackIds: string[]) {
  if (!spotifyTrackIds || spotifyTrackIds.length === 0) {
    return {
      overlapCount: 0,
      overlapArtists: [],
    };
  }

  const showTracks = await prisma.track.findMany({
    where: {
      playlistEntries: {
        some: {
          playlist: {
            spotifyPlaylistId: SHOW,
          },
        },
      },
    },
    select: {
      artist: true, 
    },
  });

  const userTracks = await prisma.track.findMany({
    where: {
      spotifyTrackId: { in: spotifyTrackIds },
    },
    select: {
      artist: true, 
    },
  });

  const showArtistSet = new Set<string>();
  for (const t of showTracks) {
    for (const a of t.artist ?? []) {
      if (a) showArtistSet.add(a);
    }
  }

  const userArtistSet = new Set<string>();
  for (const t of userTracks) {
    for (const a of t.artist ?? []) {
      if (a) userArtistSet.add(a);
    }
  }

  const overlapArtists: string[] = [];
  for (const a of userArtistSet) {
    if (showArtistSet.has(a)) {
      overlapArtists.push(a);
    }
  }

  return {
    overlapCount: overlapArtists.length,
    overlapArtists,
  };
}


export async function getAverageAudioFeaturesForBestMatch(bestMatch: BestMatch) {
  const tracksWithFeatures = await prisma.track.findMany({
    where: {
      playlistEntries: {
        some: {
          playlistId: bestMatch.playlistId,
        },
      },
      audioFeatures: {
        isNot: null,
      },
    },
    select: {
      audioFeatures: {
        select: {
          danceability: true,
          energy: true,
          valence: true,
        },
      },
    },
  });

  if (tracksWithFeatures.length === 0) {
    return {
      playlistId: bestMatch.playlistId,
      playlistName: bestMatch.name,
      count: 0,
      avgDanceability: null,
      avgEnergy: null,
      avgValence: null,
    };
  }

  let sumDance = 0;
  let sumEnergy = 0;
  let sumValence = 0;
  let count = 0;

  for (const t of tracksWithFeatures) {
    const af = t.audioFeatures;
    if (!af) continue;

    if (af.danceability != null) {
      sumDance += af.danceability;
    }
    if (af.energy != null) {
      sumEnergy += af.energy;
    }
    if (af.valence != null) {
      sumValence += af.valence;
    }
    count++;
  }

  if (count === 0) {
    return {
      playlistId: bestMatch.playlistId,
      playlistName: bestMatch.name,
      count: 0,
      avgDanceability: null,
      avgEnergy: null,
      avgValence: null,
    };
  }

  return {
    playlistId: bestMatch.playlistId,
    playlistName: bestMatch.name,
    count,
    avgDanceability: sumDance / count,
    avgEnergy: sumEnergy / count,
    avgValence: sumValence / count,
  };
}

export async function getAverageAudioFeaturesForUser(spotifyTrackIds: string[]) {
  if (!spotifyTrackIds || spotifyTrackIds.length === 0) {
    return {
      count: 0,
      avgDanceability: null,
      avgEnergy: null,
      avgValence: null,
    };
  }

  const tracks = await prisma.track.findMany({
    where: {
      spotifyTrackId: { in: spotifyTrackIds },
      audioFeatures: { isNot: null },
    },
    select: {
      audioFeatures: {
        select: {
          danceability: true,
          energy: true,
          valence: true,
        },
      },
    },
  });

  if (tracks.length === 0) {
    return {
      count: 0,
      avgDanceability: null,
      avgEnergy: null,
      avgValence: null,
    };
  }

  let sumDance = 0;
  let sumEnergy = 0;
  let sumValence = 0;
  let count = 0;

  for (const t of tracks) {
    const af = t.audioFeatures;
    if (!af) continue;

    if (af.danceability != null) sumDance += af.danceability;
    if (af.energy != null) sumEnergy += af.energy;
    if (af.valence != null) sumValence += af.valence;

    count++;
  }

  return {
    count,
    avgDanceability: sumDance / count,
    avgEnergy: sumEnergy / count,
    avgValence: sumValence / count,
  };
}
