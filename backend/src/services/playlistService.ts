import { PrismaClient, Playlist } from "@prisma/client";
import { SpotifyPlaylist, SpotifyTrack } from "../types/spotify";
import { getPlaylistName, getTracksByPlaylist } from "./spotifyService";
import {getTrackAudioFeaturesreccoResponse } from "../services/reccoBeatsService"
import { getOrFetchAudioFeaturesForTrackPerPlaylist } from "../services/audioFeaturesService"

const prisma = new PrismaClient();

export async function addOrGetPlaylist(
  playlistId: string,
): Promise<Playlist> {
  const safeName = await getPlaylistName(playlistId)
  const playlist = await prisma.playlist.upsert({
    where: { spotifyPlaylistId: playlistId }, 
    create: {
      spotifyPlaylistId: playlistId,
      name: safeName,
    },
    update: {},
  });

  return playlist;
}

export async function addTracksToPlaylist(playlistId: string) {
    const playlist = await getTracksByPlaylist(playlistId);
    const playlistRecord = await addOrGetPlaylist(playlist.playlistId);

    const results: any[] = [];

    for (let index = 0; index < playlist.tracks.length; index++) {
      const trackInfo = playlist.tracks[index];

      if (!trackInfo) {
        continue;
      }

      const recco = await getTrackAudioFeaturesreccoResponse(
        trackInfo.spotifyTrackId,
      );

      const { track, audioFeatures } =
        await getOrFetchAudioFeaturesForTrackPerPlaylist(
          recco,
          trackInfo.spotifyTrackId,
          trackInfo,
        );

      await prisma.playlistTrack.upsert({
        where: {
          playlistId_trackId: {
            playlistId: playlistRecord.id,
            trackId: track.id,
          },
        },
        update: {
          position: index, 
        },
        create: {
          playlistId: playlistRecord.id,
          trackId: track.id,
          position: index,
        },
      });

      results.push({
        track,
        audioFeatures,
        position: index,
      });
    }

    return {
      playlist: {
        id: playlistRecord.id,
        name: playlistRecord.name,
        spotifyPlaylistId: playlistRecord.spotifyPlaylistId,
      },
      tracks: results,
    };
  }

