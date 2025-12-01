// routes/testAudioFeatures.ts
import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
import { getTrackAudioFeaturesreccoResponse }from "../services/reccoBeatsService"
import { getOrFetchAudioFeaturesForTrack} from "../services/audioFeaturesService"
import { getTracksByPlaylist } from "../services/spotifyService";

const trackRouter  = router.get("/get-tracks", async (req, res) => {
  const playlistId = req.query.playlistId as string | undefined;
  if (!playlistId) {
    return res
      .status(400)
      .json({ error: "Missing query param: spotifyTrackId" });
  }
  try {
    const tracks = await getTracksByPlaylist(playlistId)
    return res.json({tracks});
  } catch (err: any) {
    console.error("Inserting a track into the DB error", err);
    return res.status(500).json({
      error: 
      "Failed to fetch/store audio features",
      message: err?.message ?? "Unknown error",
    });
  }
});

export default trackRouter;
