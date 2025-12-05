import { PrismaClient, Playlist } from "@prisma/client";
import { SpotifyPlaylist, SpotifyTrack } from "../types/spotify";
import { getPlaylistName } from "./spotifyService";

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
