// routes/testAudioFeatures.ts
import express from "express";
const playlistRouter = express.Router();
import { getTracksByPlaylist } from "../services/spotifyService";
import { addOrGetPlaylist } from "../services/playlistService";

playlistRouter.get("/get-tracks", async (req, res) => {
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
    console.error("Inserting getting playlist info", err);
    return res.status(500).json({
      error: 
      "Failed to fetch playlist tracks",
      message: err?.message ?? "Unknown error",
    });
  }
});


playlistRouter.get("/get-tracks-audio-features", async (req, res) => {
  const playlistId = req.query.playlistId as string | undefined;
  if (!playlistId) {
    return res
      .status(400)
      .json({ error: "Missing query param: spotifyTrackId" });
  }
  try {
    const playlist = await getTracksByPlaylist(playlistId)
    for (const track of playlist.tracks) {
      console.log(track.spotifyTrackId)
      //const recco = await getTrackAudioFeaturesreccoResponse(track.spotifyTrackId)
      //const response = await getOrFetchAudioFeaturesForTrack(recco, track.spotifyTrackId)
    }
    return res.json({ tracks: playlist.tracks });
  } catch (err: any) {
    console.error("Inserting a track into the DB error", err);
    return res.status(500).json({
      error: 
      "Failed to fetch/store audio features",
      message: err?.message ?? "Unknown error",
    });
  }
});

playlistRouter.get("/add-playlists-to-db", async (req, res) => {
  const playlistId = req.query.playlistId as string | undefined;
  if (!playlistId) {
    return res
      .status(400)
      .json({ error: "Missing query param: spotifyTrackId" });
  }
  try {
    const playlist = await addOrGetPlaylist(playlistId)
    return res.json({playlist});
  } catch (err: any) {
    console.error("Inserting adding playlist to the DB", err);
    return res.status(500).json({
      error: 
      "Failed to fetch playlist tracks",
      message: err?.message ?? "Unknown error",
    });
  }
});

export default playlistRouter;
