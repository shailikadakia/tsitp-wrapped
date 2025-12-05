import express from "express";
import playlistRouter from "./routes/playlist";
import trackRouter from "./routes/track";
const app = express();

app.use(express.json());
app.use('/api/playlist', playlistRouter);
app.use('/api/track', trackRouter);



const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
