import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { getTrackAudioFeaturesreccoResponse }from "../services/reccoBeatsService"
import { getOrFetchAudioFeaturesForTrackPerPlaylist } from "../services/audioFeaturesService";
import { getTrackNameAuthor } from "../services/spotifyService";

const trackRouter = router.get("/get-audio-features", async (req, res) => {
  const spotifyTrackId = req.query.spotifyTrackId as string | undefined;
  if (!spotifyTrackId) {
    return res
      .status(400)
      .json({ error: "Missing query param: spotifyTrackId" });
  }
  try {
    const recco = await getTrackAudioFeaturesreccoResponse(spotifyTrackId)
    const track = await getTrackNameAuthor(spotifyTrackId)
    const response = await getOrFetchAudioFeaturesForTrackPerPlaylist(recco, spotifyTrackId, track)
    return res.json({response});
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
