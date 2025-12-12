import { PrismaClient, Track, AudioFeatures, Prisma } from "@prisma/client";
import { ReccoBeatsAudioFeatures } from "../types/types";
import { SpotifyTrack } from "../types/types";

const prisma = new PrismaClient();

export async function getOrFetchAudioFeaturesForTrackPerPlaylist(
  recco: ReccoBeatsAudioFeatures,
  spotifyTrackId: string,
  trackInfo: SpotifyTrack,
): Promise<{ track: Track; audioFeatures: AudioFeatures | null }> {
  try {
    const artists: string[] = Array.isArray(trackInfo.artist)
      ? trackInfo.artist.filter(Boolean)
      : trackInfo.artist
      ? [trackInfo.artist]
      : [];

    const updateData: Prisma.TrackUpdateInput = {};

    if (trackInfo.name != null) {
      updateData.name = trackInfo.name;
    }
    if (artists.length > 0) {
      updateData.artist = artists;
    }

    const track = await prisma.track.upsert({
      where: { spotifyTrackId },
      create: {
        spotifyTrackId,
        name: trackInfo.name ?? null,
        artist: artists,
      },
      update: updateData,
    });

    const data = recco?.content?.[0];

    if (!data) {
      console.warn(
        `No ReccoBeats content for spotifyTrackId=${spotifyTrackId}. Skipping audioFeatures.`,
      );
      return { track, audioFeatures: null };
    }

    const audioFeatures = await prisma.audioFeatures.upsert({
      where: { trackId: track.id },
      update: {
        danceability: data.danceability ?? null,
        energy: data.energy ?? null,
        valence: data.valence ?? null,
        tempo: data.tempo ?? null,
        acousticness: data.acousticness ?? null,
        instrumentalness: data.instrumentalness ?? null,
        loudness: data.loudness ?? null,
        liveness: data.liveness ?? null,
        speechiness: data.speechiness ?? null,
      },
      create: {
        trackId: track.id,
        danceability: data.danceability ?? null,
        energy: data.energy ?? null,
        valence: data.valence ?? null,
        tempo: data.tempo ?? null,
        acousticness: data.acousticness ?? null,
        instrumentalness: data.instrumentalness ?? null,
        loudness: data.loudness ?? null,
        liveness: data.liveness ?? null,
        speechiness: data.speechiness ?? null,
      },
    });

    return { track, audioFeatures };
  } catch (error: any) {
    console.error("Error in getOrFetchAudioFeaturesForTrackPerPlaylist:", error);
    throw error;
  }
}
