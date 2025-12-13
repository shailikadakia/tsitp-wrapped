import React from 'react';
import { Card, CardContent } from '../ui/card';
import { UserStats } from '../../types/type';

function computeSummerMood({
  avgValence,
  avgEnergy,
  avgDanceability,
  avgAcousticness,
}: {
  avgValence: number;
  avgEnergy: number;
  avgDanceability: number;
  avgAcousticness?: number;
}): string {
  if (avgValence > 0.6 && avgEnergy > 0.6) {
    return 'Golden Hour Sunny';
  }

  if (avgValence > 0.55 && avgDanceability > 0.55) {
    return 'Playful Summer';
  }

  if (avgValence < 0.45 && avgAcousticness && avgAcousticness > 0.5) {
    return 'Soft Nostalgia';
  }

  if (avgValence < 0.35 && avgEnergy < 0.5) {
    return 'Stormy Moody';
  }

  if (avgEnergy > 0.75 && avgDanceability > 0.6) {
    return 'Energetic Chaos';
  }

  if (avgValence >= 0.35 && avgValence <= 0.55) {
    return 'Bittersweet';
  }

  return 'A little bit of everything';
}

function getMoodMeta(mood: string) {
  switch (mood) {
    case 'Golden Hour Sunny':
      return {
        emoji: '☀️',
        titleSuffix: 'Golden Hour Sunny',
        description:
          'Your playlist is full of bright, upbeat tracks that feel like driving to Cousins with the windows down.',
        reference: "The first season's drive to Cousins",
      };
    case 'Playful Summer':
      return {
        emoji: '🌼',
        titleSuffix: 'Playful',
        description:
          'Dancey, fun, and carefree — your summer soundtrack is all about time at the beach and inside jokes.',
        reference: "The Great Boardwalk Showdown from S2 Ep4",
      };
    case 'Soft Nostalgia':
      return {
        emoji: '🌙✨',
        titleSuffix: 'Soft Nostalgia',
        description:
          'Acoustic, gentle, and a little wistful — like rereading old texts and reliving last summer in your head.',
        reference: 'folklore-coded Conrad writing to Belly in Paris or Belly singing We Love You Conrad as a young girl',
      };
    case 'Stormy Moody':
      return {
        emoji: '🌊',
        titleSuffix: 'Stormy Moody',
        description:
          'Emotional, introspective tracks that sound like watching a storm roll in over the ocean.',
        reference: 'Conrad staring at the waves at 2 a.m. and saying I thought you knew',
      };
    case 'Energetic Chaos':
      return {
        emoji: '🔥',
        titleSuffix: 'Chaotic',
        description:
          'High-energy, high-drama — your playlist screams yelling the bridge in the car with your friends.',
        reference: "Steven and Taylor dancing to Party in the USA",
      };
    case 'Bittersweet':
      return {
        emoji: '🌅',
        titleSuffix: 'Bittersweet',
        description:
          'You balance happy bops with emotional gut-punches — the perfect mix of magic and mess.',
        reference: "Belly giving back Conrad the infinity necklace and getting together with Jeremiah",
      };
    default:
      return {
        emoji: '🎧',
        titleSuffix: mood,
        description:
          "Your taste doesn’t fit in just one box — a little bit of everything, just like the love triangle.",
        reference: 'the entire Cousins Beach crew',
      };
  }
}

export function MoodSlide({ userStats }: { userStats: UserStats }) {
  const energy = userStats.summerMood?.avgEnergy ?? 0;
  const danceability = userStats.summerMood?.avgDanceability ?? 0;
  const valence = userStats.summerMood?.avgValence ?? 0;
  const acousticness = userStats.summerMood?.avgAcoustics ?? 0;

  const summerMood = computeSummerMood({
    avgValence: valence,
    avgEnergy: energy,
    avgDanceability: danceability,
    avgAcousticness: acousticness,
  });

  const { emoji, titleSuffix, description, reference } = getMoodMeta(summerMood);

  return (
    <div className="space-y-6 text-center">
      <div>
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-2xl font-bold mb-2">
          Your Summer Was {titleSuffix}
        </h2>
      </div>

      <Card className="bg-white/70">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600 mb-4">
            {description}
          </p>

          <div className="text-xs text-gray-500">
            Just like {reference}
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-blue-100 to-pink-100 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          "The summer that changed everything" 🏖️
        </p>
      </div>
    </div>
  );
}
