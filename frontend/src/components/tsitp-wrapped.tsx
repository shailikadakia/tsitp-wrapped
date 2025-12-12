import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  TsitpScoresResponse,
  Track,
  UserStats,
  TSITPWrappedProps,
  CharacterScore,
  ShipScores,
} from '../types/type';
import { CHARACTER_META } from "../styles/character-record"
import { MoodSlide } from './wrapped/mood';
import { ShipSlide } from './wrapped/ship';
import { CharacterMatchSlide } from './wrapped/character';
import { SummerRecap } from './wrapped/summer';
import { WelcomeSlide } from './wrapped/welcome';

function buildTracksFromSession(): Track[] {
  const raw = sessionStorage.getItem('tsitp_top_tracks');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.items?.length) return [];
    return parsed.items.map((track: any) => ({
      name: track.name ?? 'Unknown track',
      artist: track.artists?.[0]?.name ?? 'Unknown artist',
      energy: 0,
      valence: 0,
      danceability: 0,
      acousticness: 0,
      plays: track.popularity ?? 0,
    })) as Track[];
  } catch (e) {
    console.error('Failed to parse tsitp_top_tracks', e);
    return [];
  }
}

export function TSITPWrapped({ onBack, userData }: TSITPWrappedProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    // 1) Use real data if available, otherwise pull the user's top tracks saved during callback
    const tracksToAnalyze =
      userData && userData.length > 0 ? userData : buildTracksFromSession();

    if (tracksToAnalyze.length === 0) return;

    // 2) Calculate user stats from tracks
    const totalPlays = tracksToAnalyze.reduce(
      (sum, track) => sum + (track.plays ?? 0),
      0
    );
    const avgEnergy =
      tracksToAnalyze.reduce((sum, track) => sum + track.energy, 0) /
      tracksToAnalyze.length;
    const avgValence =
      tracksToAnalyze.reduce((sum, track) => sum + track.valence, 0) /
      tracksToAnalyze.length;

    const topTrack =
      [...tracksToAnalyze].sort(
        (a, b) => (b.plays ?? 0) - (a.plays ?? 0)
      )[0] ?? tracksToAnalyze[0];

    const summerMood: UserStats['summerMood'] =
      avgValence > 0.5 ? 'Sunny' : avgValence > 0.3 ? 'Bittersweet' : 'Moody';

    // 3) Load backend TSITP scores from sessionStorage (must exist; otherwise abort)
    const rawScores = sessionStorage.getItem('tsitp_scores');
    if (!rawScores) {
      console.warn('No tsitp_scores found in sessionStorage');
      return;
    }
    let scores: TsitpScoresResponse;
    try {
      scores = JSON.parse(rawScores);
    } catch (e) {
      console.error('Failed to parse tsitp_scores', e);
      return;
    }

    // 4) Use backend characterMatch as best match
    const backendBest = scores.characterMatch;
    const meta =
      CHARACTER_META[backendBest.name] ?? CHARACTER_META['Belly'];

    // 5) Use backend ship scores
    const teamConradScore = scores.shipScores.teamConrad.scorePercent;
    const teamJeremiahScore = scores.shipScores.teamJeremiah.scorePercent;

    // 6) Combine into single stats object for UI
    setUserStats({
      totalPlays,
      avgEnergy,
      avgValence,
      topTrack,
      summerMood,
      bestMatch: {
        name: backendBest.name,
        emoji: meta.emoji,
        color: meta.color,
        vibe: meta.vibe,
        scorePercent: backendBest.scorePercent,
      },
      teamConradScore,
      teamJeremiahScore,
    });
  }, [userData]);

  const slides = [
    // Welcome
    {
      title: "Your TSITP Summer Wrapped",
      content: <WelcomeSlide />
    },

    // Summer Stats
    {
      title: "Your Summer in Numbers",
      content: userStats && <SummerRecap userStats={userStats} />
    },

    // Character Match (now driven by backend characterMatch)
    {
      title: "Your Character Match",
      content: userStats && <CharacterMatchSlide userStats={userStats} />
    },

    // Team Analysis – now fully backend-driven
    {
      title: "Team Conrad vs Team Jeremiah",
      content: userStats && <ShipSlide userStats={userStats} />
    },

    // Summer Mood
    {
      title: "Your Summer Mood",
      content: userStats && <MoodSlide userStats={userStats} />
    },

  ];

  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      onBack(); 
      return;
    }
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl">
          <CardHeader className="text-center border-b border-gray-100">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-lg bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {slides[currentSlide].title}
              </CardTitle>
              <div className="w-8" />
            </div>
            <div className="flex justify-center space-x-1 mt-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentSlide ? 'bg-pink-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-6 min-h-[400px] flex items-center">
            {slides[currentSlide].content}
          </CardContent>

          <div className="flex justify-between p-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="border-blue-300/50 hover:bg-blue-50/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={nextSlide}
              className="bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 hover:opacity-90 shadow-md"
            >
              {currentSlide === slides.length - 1 ? "Back to Home" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
