import { ReccoBeatsAudioFeatures } from "../types/types";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getTrackAudioFeaturesreccoResponse(
  spotifyTrackId: string,
  attempt = 0,
): Promise<ReccoBeatsAudioFeatures> {
  const reccoResponse = await fetch(
    `https://api.reccobeats.com/v1/audio-features?ids=${spotifyTrackId}`
  );

  // Handle rate limiting
  if (reccoResponse.status === 429) {
    if (attempt >= 3) {
      throw new Error("ReccoBeats rate limit hit repeatedly, giving up.");
    }

    const retryAfterHeader = reccoResponse.headers.get("Retry-After");
    const retryAfterSeconds = retryAfterHeader
      ? Number.parseInt(retryAfterHeader, 10)
      : 2; // fallback if header missing

    await sleep(retryAfterSeconds * 1000);
    return getTrackAudioFeaturesreccoResponse(spotifyTrackId, attempt + 1);
  }

  if (!reccoResponse.ok) {
    const body = await reccoResponse.text();
    throw new Error(`ReccoBeats error ${reccoResponse.status}: ${body}`);
  }

  const raw = await reccoResponse.json();
  
  const data = raw as ReccoBeatsAudioFeatures;
  return data;
}
