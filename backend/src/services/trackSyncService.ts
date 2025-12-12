import { PrismaClient } from "@prisma/client";
import { getTrackNameAuthor } from "./spotifyService";
import { getTrackAudioFeaturesreccoResponse } from "./reccoBeatsService";
import { getOrFetchAudioFeaturesForTrackPerPlaylist } from "./audioFeaturesService";

const prisma = new PrismaClient();

export async function ensureTracksSynced(spotifyTrackIds: string[]) {
  if (spotifyTrackIds.length === 0) return;

  const uniqueIds = Array.from(new Set(spotifyTrackIds));

  const existing = await prisma.track.findMany({
    where: { spotifyTrackId: { in: uniqueIds } },
    select: { spotifyTrackId: true },
  });

  const existingIds = new Set(existing.map((t) => t.spotifyTrackId));
  const missingIds = uniqueIds.filter((id) => !existingIds.has(id));

  if (missingIds.length === 0) return;

  console.log("ensureTracksSynced: missing", missingIds.length, "tracks");

  for (const spotifyTrackId of missingIds) {
    try {
      // 1) Get track name + artist from Spotify
      const trackInfo = await getTrackNameAuthor(spotifyTrackId);
      // 2) Get audio features from ReccoBeats
      const recco = await getTrackAudioFeaturesreccoResponse(spotifyTrackId);
      // 3) Store Track + AudioFeatures using your existing helper
      await getOrFetchAudioFeaturesForTrackPerPlaylist(recco, spotifyTrackId, trackInfo);
    } catch (err) {
      console.error(`Failed to sync spotifyTrackId=${spotifyTrackId}`, err);
      // You can decide whether to rethrow or just continue
    }
  }
}
