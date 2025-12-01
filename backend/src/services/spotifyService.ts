import { SpotifyPlaylistAPIResponse, SpotifyTrack, SpotifyPlaylist } from "../types/spotify";
import { getAppAccessToken } from "./spotifyClient";

export async function getTracksByPlaylist(
  playlistId: string
): Promise<SpotifyPlaylist> {
  try {
    const accessToken = await getAppAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Spotify error ${response.status}`);
    }

    const json = await response.json();
    const res = json as SpotifyPlaylistAPIResponse
    const tracks: SpotifyTrack[] =
      res.tracks.items
        .filter((item: any) => item.track != null)
        .map((item: any) => ({
          spotifyTrackId: item.track.id,
          name: item.track.name ?? null,
          artist: item.track.artists?.[0]?.name ?? null,
        }));
    return {
      playlistId,
      name: res.name ?? null,
      tracks,
    };
  } catch (err) {
    console.error("Error fetching playlist tracks:", err);
    throw err;
  }
}
