import express from "express";
import { 
  scoreUserForCharacters, 
  scoreUserForShips, 
  countSoundtrackOverlap, 
  countArtistOverlap, 
  getAverageAudioFeaturesForBestMatch,
  getAverageAudioFeaturesForUser 
} from "../services/scoringService";
import { json } from "stream/consumers";
import { get } from "https";

const scoreRouter = express.Router();

scoreRouter.post("/get-score", async (req, res) => {
  try {
    const { spotifyTrackIds } = req.body;

    const characterScores = await scoreUserForCharacters(spotifyTrackIds);
    const shipScores = await scoreUserForShips(spotifyTrackIds);
    const soundtrackOverlap = await countSoundtrackOverlap(spotifyTrackIds)
    const artistOverlap = await countArtistOverlap(spotifyTrackIds)
    const characterAudioFeatures = characterScores.bestMatch 
      ? await getAverageAudioFeaturesForBestMatch(characterScores.bestMatch)
      : null;

    const summerMood = await getAverageAudioFeaturesForUser(spotifyTrackIds)
    console.log("=== CHARACTER SCORES ===");
    console.log(JSON.stringify(characterScores, null, 2));

    console.log("=== SHIP SCORES ===");
    console.log(JSON.stringify(shipScores, null, 2));

    console.log(JSON.stringify(soundtrackOverlap))
    console.log(JSON.stringify(artistOverlap))

    console.log(JSON.stringify(characterAudioFeatures))
    console.log(JSON.stringify(summerMood))

    return res.json({
      characterMatch: characterScores.bestMatch,
      characterScores: characterScores.allScores,
      shipMatch: shipScores.shipMatch,
      shipScores: shipScores.scores,
      soundtrackOverlap, 
      artistOverlap,
      characterAudioFeatures,
      summerMood
    });
  } catch (err) {
    console.error("Error computing scores:", err);
    return res.status(500).json({ error: "Failed scoring" });
  }
});


export default scoreRouter;
