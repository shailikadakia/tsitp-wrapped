/*
import express from "express";
import { getAppAccessToken } from "./services/spotifyClient";

const app = express();

app.get("/test/playlist", async (_req, res) => {
  try {
    const accessToken = await getAppAccessToken();

    const playlistId = "7kQgEsY7hsBRxO5dEcBaEG"; // <-- TEST PLAYLIST

    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  
   const id = "11dFghVXANMlKmJXsNCbNl"
   const response = await fetch(
      `https://api.spotify.com/v1/audio-features/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    console.log("Playlist response:", data);

    res.json(data); // return the playlist JSON to browser
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(8000, () => {
  console.log("Server listening on http://localhost:8000");
});
*/
// server.ts or app.ts
import express from "express";
import testAudioFeaturesRouter from "./routes/testAudioFeatures";

const app = express();

app.use(express.json());
app.use(testAudioFeaturesRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
