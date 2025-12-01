// routes/testAudioFeatures.ts
import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { getTrackAudioFeaturesreccoResponse }from "../services/reccoBeatsService"

router.get("/api/get-audio-features", async (req, res) => {
  const spotifyTrackId = req.query.spotifyTrackId as string | undefined;

  if (!spotifyTrackId) {
    return res
      .status(400)
      .json({ error: "Missing query param: spotifyTrackId" });
  }

  console.log("Fetching audio features for:", spotifyTrackId);

  try {
    let track = await prisma.track.findUnique({
      where: { spotifyTrackId },
    });

    if (!track) {
      track = await prisma.track.create({
        data: {
          spotifyTrackId,
          name: null,
          artist: null,
        },
      });
    }

    const data = await getTrackAudioFeaturesreccoResponse(spotifyTrackId)
    const af = data?.content?.[0];
    if (!af) {
      return res.status(404).json({
        error: "No audio features returned for this track",
        raw: data,
      });
    }
  
    const audioFeatures = await prisma.audioFeatures.upsert({
      where: { trackId: track.id },
      update: {
        danceability: af.danceability ?? null,
        energy: af.energy ?? null,
        valence: af.valence ?? null,
        tempo: af.tempo ?? null,
        acousticness: af.acousticness ?? null,
        instrumentalness: af.instrumentalness ?? null,
        loudness: af.loudness ?? null,
        liveness: af.liveness ?? null,
        speechiness: af.speechiness ?? null,
      },
      create: {
        trackId: track.id,
        danceability: af.danceability ?? null,
        energy: af.energy ?? null,
        valence: af.valence ?? null,
        tempo: af.tempo ?? null,
        acousticness: af.acousticness ?? null,
        instrumentalness: af.instrumentalness ?? null,
        loudness: af.loudness ?? null,
        liveness: af.liveness ?? null,
        speechiness: af.speechiness ?? null,
      },
    });
    

    return res.json({
      track,
      audioFeatures,
      data
    });
  } catch (err: any) {
    console.error("Test audio-features error:", err);
    return res.status(500).json({
      error: "Failed to fetch/store audio features",
      message: err?.message ?? "Unknown error",
    });
  }
});

export default router;
