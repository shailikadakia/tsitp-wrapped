import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  TsitpScoresResponse,
  Track,
  UserStats,
  TSITPWrappedProps,
  SoundtrackOverlap,
  ArtistOverlap,
  CharacterAudioFeatures,
} from '../types/type';
import { CHARACTER_META } from "../styles/character-record"
// import { MoodSlide } from './wrapped/mood';
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
    const tracksToAnalyze =
      userData && userData.length > 0 ? userData : buildTracksFromSession();

    if (tracksToAnalyze.length === 0) return;
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
    const avgValence =  scores.characterAudioFeatures?.avgValence ?? 0
    const avgDanceability =  scores.characterAudioFeatures?.avgDanceability ?? 0
    const avgEnergy =  scores.characterAudioFeatures?.avgEnergy ?? 0

    const soundtrackOverlap: SoundtrackOverlap =
      scores.soundtrackOverlap ?? { overlapCount: 0, overlapTracks: [] };
    const artistOverlap: ArtistOverlap =
      scores.artistOverlap ?? { overlapCount: 0, overlapArtists: [] };
    const characterAudioFeatures: CharacterAudioFeatures | null =
      scores.characterAudioFeatures ?? null;
  
    const backendBest = scores.characterMatch;
    const meta =
      CHARACTER_META[backendBest.name]

    const teamConradScore = scores.shipScores.teamConrad.scorePercent;
    const teamJeremiahScore = scores.shipScores.teamJeremiah.scorePercent;

    setUserStats({
      avgDanceability,
      avgEnergy,
      avgValence,
      bestMatch: {
        name: backendBest.name,
        emoji: meta.emoji,
        color: meta.color,
        vibe: meta.vibe,
        scorePercent: backendBest.scorePercent,
      },
      teamConradScore,
      teamJeremiahScore,
      soundtrackOverlap,
      artistOverlap,
      characterAudioFeatures,
    });
  }, [userData]);

  const slides = [
    {
      title: "Your TSITP Summer Wrapped",
      content: <WelcomeSlide />
    },
    {
      title: "Your Summer in Numbers",
      content: userStats && <SummerRecap userStats={userStats} />
    },
    {
      title: "Your Character Match",
      content: userStats && <CharacterMatchSlide userStats={userStats} />
    },
    {
      title: "Team Conrad vs Team Jeremiah",
      content: userStats && <ShipSlide userStats={userStats} />
    },
    /*
    {
      title: "Your Summer Mood",
      content: userStats && <MoodSlide userStats={userStats} />
    },
    */
  ];

  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      onBack();
      return;
    }
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="flex flex-col w-full h-[80vh] max-h-[900px] min-h-0 bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl overflow-hidden">
          <CardHeader className="flex-shrink-0 text-center border-b border-gray-100">
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

          <CardContent className="flex-1 min-h-0 overflow-y-auto px-6 pt-3 pb-6">
            {slides[currentSlide].content}
        </CardContent>

          <div className="flex-shrink-0 flex justify-between p-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
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
              {currentSlide === slides.length - 1 ? 'Back to Home' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
