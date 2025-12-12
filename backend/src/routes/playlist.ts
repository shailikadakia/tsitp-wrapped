import express from "express";
const playlistRouter = express.Router();
import { getTracksByPlaylist } from "../services/spotifyService";
import { addOrGetPlaylist, addTracksToPlaylist } from "../services/playlistService";

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
playlistRouter.get("/link-playlist-to-db", async (req, res) => {
  const playlistId = req.query.playlistId as string | undefined;

  if (!playlistId) {
    return res
      .status(400)
      .json({ error: "Missing query param: playlistId" });
  }
  try {
    const result = await addTracksToPlaylist(playlistId);
    return res.json ({
      id: result.playlist.id,
      name: result.playlist.name,
      spotifyPlaylistId: result.playlist.spotifyPlaylistId,
      tracks: result.tracks,
    }
    )
  } catch (err: any) {
    console.error("Inserting a track into the DB error", err);
    return res.status(500).json({
      error: "Failed to fetch/store audio features",
      message: err?.message ?? "Unknown error",
    });
  }
});

export default playlistRouter;
