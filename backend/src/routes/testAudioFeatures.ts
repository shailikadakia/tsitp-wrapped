// routes/testAudioFeatures.ts
import express from "express";

const router = express.Router();

/**
 * GET /api/test/audio-features?spotifyTrackId=00vJzaoxM3Eja1doBUhX0P
 *
 * 1. Fetch track from Spotify (sanity + we get canonical ID).
 * 2. Use that Spotify ID to query ReccoBeats /track?ids=...
 * 3. Grab the ReccoBeats internal id from the response.
 * 4. Call /track/{reccobeats_id}/audio-features.
 * 5. Return combined payload.
 */
router.get("/api/test/audio-features", async (req, res) => {
  const spotifyTrackId = req.query.spotifyTrackId as string | undefined;

  if (!spotifyTrackId) {
    return res
      .status(400)
      .json({ error: "Missing query param: spotifyTrackId" });
  }
  console.log(spotifyTrackId)

  try {
    // 1) Get Spotify track (optional sanity check)

    // 2) Ask ReccoBeats for this track using Spotify ID
    const reccoResponse = await fetch(`https://api.reccobeats.com/v1/audio-features?ids=${spotifyTrackId}`)
    const data = await reccoResponse.json()
    console.log(data)
    return res.json(data)

  } catch (err: any) {
    console.error("Test audio-features error:", err);
    return res.status(500).json({
      error: "Failed to fetch audio features",
      message: err?.message ?? "Unknown error",
    });
  }
});

export default router;
