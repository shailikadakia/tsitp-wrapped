
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Music, Sun, Moon, ArrowLeft, ArrowRight } from 'lucide-react';
import { CharacterScore, ShipScores, TsitpScoresResponse, Track, CharacterPlaylist, UserStats, TSITPWrappedProps  } from '../../types/type';

export function CharacterMatchSlide({ userStats }: { userStats: UserStats }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-2">{userStats.bestMatch.emoji}</div>
        <h2 className="text-2xl font-bold mb-1">You're a {userStats.bestMatch.name}!</h2>
        <p className="text-sm text-gray-500 mb-1">
          Match score: {userStats.bestMatch.scorePercent}%
        </p>
        <Badge className={`bg-gradient-to-r ${userStats.bestMatch.color} text-white`}>
          {userStats.bestMatch.vibe}
        </Badge>
      </div>

      <Card className="bg-white/70">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Why you match {userStats.bestMatch.name}:</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Music Energy</span>
              <div className="flex items-center gap-2">
                <Progress value={userStats.avgEnergy * 100} className="w-20" />
                <span className="text-sm">{Math.round(userStats.avgEnergy * 100)}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Positivity Vibe</span>
              <div className="flex items-center gap-2">
                <Progress value={userStats.avgValence * 100} className="w-20" />
                <span className="text-sm">{Math.round(userStats.avgValence * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50/80 rounded-lg border border-blue-200/40">
            <p className="text-sm text-gray-700">
              {userStats.bestMatch.name === "Conrad" && "Your taste for introspective, moody tracks matches Conrad's deep, thoughtful nature - like late night walks on the beach."}
              {userStats.bestMatch.name === "Jeremiah" && "Your love for upbeat, sunny songs reflects Jeremiah's optimistic and fun personality - pure golden hour vibes."}
              {userStats.bestMatch.name === "Belly" && "Your mix of coming-of-age anthems and emotional tracks captures Belly's journey perfectly - the magic of summers at Cousins Beach."}
              {userStats.bestMatch.name === "Steven" && "You’ve got that chill, fun energy that keeps the group grounded – just like Steven."}
              {userStats.bestMatch.name === "Taylor" && "Bold bops, high energy, and main-character vibes? That’s pure Taylor energy."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}