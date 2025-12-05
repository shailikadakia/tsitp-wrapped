import {
  SpotifyPlaylistAPIResponse,
  SpotifyTrack,
  SpotifyPlaylist,
} from "../types/spotify";
import { getAppAccessToken } from "./spotifyClient";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function spotifyFetchWithRetry(
  url: string,
  attempt = 0,
): Promise<Response> {
  const accessToken = await getAppAccessToken();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Handle rate limiting (429)
  if (response.status === 429) {
    if (attempt >= 3) {
      throw new Error("Spotify rate limit hit repeatedly, giving up.");
    }

    const retryAfterHeader = response.headers.get("Retry-After");
    const retryAfterSeconds = retryAfterHeader
      ? Number.parseInt(retryAfterHeader, 10)
      : 2; // fallback if header is missing / invalid

    console.warn(
      `Spotify 429 received. Retrying in ${retryAfterSeconds}s (attempt ${
        attempt + 1
      })`,
    );

    await sleep(retryAfterSeconds * 1000);
    return spotifyFetchWithRetry(url, attempt + 1);
  }

  // Handle other non-OK statuses
  if (!response.ok) {
    const body = await response.text().catch(() => "(no body)");
    throw new Error(`Spotify error ${response.status}: ${body}`);
  }

  return response;
}

export async function getTracksByPlaylist(
  playlistId: string,
): Promise<SpotifyPlaylist> {
  try {
    const response = await spotifyFetchWithRetry(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
    );

    const json = (await response.json()) as SpotifyPlaylistAPIResponse;

    const tracks: SpotifyTrack[] = json.tracks.items
      .filter((item: any) => item.track != null)
      .map((item: any) => ({
        spotifyTrackId: item.track.id,
        name: item.track.name ?? null,
        artist: item.track.artists?.[0]?.name ?? null,
      }));

    return {
      playlistId,
      name: json.name ?? null,
      tracks,
    };
  } catch (err) {
    console.error("Error fetching playlist tracks:", err);
    throw err;
  }
}


export async function getTrackNameAuthor(
  trackId: string,
): Promise<SpotifyTrack> {
  try {
    const response = await spotifyFetchWithRetry(
      `https://api.spotify.com/v1/tracks/${trackId}`,
    );

    const track = (await response.json()) as any;

    return {
      spotifyTrackId: track.id,
      name: track.name,
      artist: [track.artists?.[0]?.name ?? null],
    };
  } catch (err) {
    console.error("Error fetching track info from Spotify:", err);
    throw err;
  }
}

export async function getPlaylistName(
  playlistId: string,
): Promise<string> {
  try {
    const response = await spotifyFetchWithRetry(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
    );

    const playlist = (await response.json()) as any;
    return playlist.name;
  } catch (err) {
    console.error("Error fetching playlist info from Spotify:", err);
    throw err;
  }
}
