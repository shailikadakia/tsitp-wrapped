import express from "express";
import trackRouter from "./routes/getTrackAudioFeatures";
import playlistRouter from "./routes/getPlaylistTracks";

const app = express();

app.use(express.json());
app.use('/api/track', trackRouter);
app.use('/api/playlist', playlistRouter);



const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
