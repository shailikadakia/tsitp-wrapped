
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { UserStats } from '../../types/type';

export function MoodSlide({ userStats }: { userStats: UserStats }) {
  return (
    <div className="space-y-6 text-center">
      <div>
        <div className="text-6xl mb-4">
          {userStats.summerMood === "Sunny" ? "☀️" : userStats.summerMood === "Bittersweet" ? "🌅" : "🌙"}
        </div>
        <h2 className="text-2xl font-bold mb-2">Your Summer Was {userStats.summerMood}</h2>
      </div>

      <Card className="bg-white/70">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600 mb-4">
            {userStats.summerMood === "Sunny" && "Your playlist was full of upbeat, positive tracks that screamed summer fun!"}
            {userStats.summerMood === "Bittersweet" && "You balanced happy summer hits with some deeper, more emotional tracks."}
            {userStats.summerMood === "Moody" && "Your summer soundtrack leaned introspective - perfect for those deep beach walks."}
          </p>

          <div className="text-xs text-gray-500">
            Just like {userStats.summerMood === "Sunny" ? "Jeremiah's golden hour energy" :
                     userStats.summerMood === "Bittersweet" ? "Belly's coming-of-age journey" :
                     "Conrad's contemplative beach moments"}
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
