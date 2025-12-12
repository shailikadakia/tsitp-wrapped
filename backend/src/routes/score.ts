import express from "express";
import { scoreUserForCharacters, scoreUserForShips } from "../services/scoringService";

const scoreRouter = express.Router();


scoreRouter.post("/get-score", async (req, res) => {
  try {
    const { spotifyTrackIds } = req.body;

    const characterScores = await scoreUserForCharacters(spotifyTrackIds);
    const shipScores = await scoreUserForShips(spotifyTrackIds);

    console.log("=== CHARACTER SCORES ===");
    console.log(JSON.stringify(characterScores, null, 2));

    console.log("=== SHIP SCORES ===");
    console.log(JSON.stringify(shipScores, null, 2));

    return res.json({
      characterMatch: characterScores.bestMatch,
      characterScores: characterScores.allScores,
      shipMatch: shipScores.shipMatch,
      shipScores: shipScores.scores,
    });
  } catch (err) {
    console.error("Error computing scores:", err);
    return res.status(500).json({ error: "Failed scoring" });
  }
});


export default scoreRouter;
