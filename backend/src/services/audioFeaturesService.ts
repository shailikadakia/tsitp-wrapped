import { PrismaClient } from "@prisma/client";
import { getTrackAudioFeaturesreccoResponse } from "./reccoBeatsService";
import { ReccoBeatsAudioFeatures } from "../types/reccoBeats";
import { AnyARecord } from "dns";
import { SpotifyPlaylist, SpotifyTrack } from "../types/spotify";

const prisma = new PrismaClient();

export async function getOrFetchAudioFeaturesForTrackPerPlaylist(recco: ReccoBeatsAudioFeatures, spotifyTrackId: string, trackInfo: SpotifyTrack) {
  try {
    const data = recco?.content?.[0];
        if (!data) throw new Error("Missing content[0] from ReccoBeats");
        let track = await prisma.track.findUnique({
          where: { spotifyTrackId },
        });

        if (!track) {
          track = await prisma.track.create({
            data: {
              spotifyTrackId,
              name: trackInfo.name,
              artist: trackInfo.artist,
            },
          });
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
    return { track, audioFeatures}
  } catch(error: any) {
    console.error("Error in getOrFetchAudioFeaturesForTrack:", error);
    throw error;
  }
}
