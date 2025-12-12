import express from "express";
import playlistRouter from "./routes/playlist";
import trackRouter from "./routes/track";
import scoreRouter from "./routes/score";
import cors from "cors";

const app = express();

// Allow your frontend origin(s)
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  })
);
app.use(express.json());
app.use('/api/playlist', playlistRouter);
app.use('/api/track', trackRouter);
app.use('/api/score', scoreRouter)



const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
