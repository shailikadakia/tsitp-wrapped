import { PrismaClient, Track, AudioFeatures } from "@prisma/client";
import { ReccoBeatsAudioFeatures } from "../types/reccoBeats";
import { SpotifyTrack } from "../types/spotify";

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

    let track = await prisma.track.findUnique({
      where: { spotifyTrackId },
    });

    if (!track) {
      track = await prisma.track.create({
        data: {
          spotifyTrackId,
          name: trackInfo.name ?? null,
          artist: artists,
        },
      });
    } else {
      track = await prisma.track.update({
        where: { id: track.id },
        data: {
          name: trackInfo.name ?? track.name,
          artist: artists.length > 0 ? artists : track.artist,
        },
      });
    }

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
