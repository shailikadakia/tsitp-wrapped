import express from "express";
import router from "./routes/getTrackAudioFeatures";

const app = express();

app.use(express.json());
app.use(router);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
