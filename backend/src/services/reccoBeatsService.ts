import { ReccoBeatsAudioFeatures } from "../types/reccoBeats";

export async function getTrackAudioFeaturesreccoResponse(spotifyTrackId: string) :Promise<ReccoBeatsAudioFeatures> {
  const reccoResponse = await fetch(
      `https://api.reccobeats.com/v1/audio-features?ids=${spotifyTrackId}`
    );

    if (!reccoResponse.ok) {
    const body = await reccoResponse.text();
    throw new Error(`ReccoBeats error ${reccoResponse.status}: ${body}`);
  }

  const raw = await reccoResponse.json();
  const data = raw as ReccoBeatsAudioFeatures;
  return data
}