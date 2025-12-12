
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Music, Sun, Moon, ArrowLeft, ArrowRight } from 'lucide-react';
import { CharacterScore, ShipScores, TsitpScoresResponse, Track, CharacterPlaylist, UserStats, TSITPWrappedProps  } from '../../types/type';

export function ShipSlide({ userStats }: { userStats: UserStats }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-1">Based on your music vibes...</h2>
        <p className="text-sm text-gray-500">
          (Matched against the official Belly × Conrad and Belly × Jeremiah playlists)
        </p>
      </div>

      <div className="space-y-4">
        <Card className="bg-white/70">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-slate-600" />
                <span className="font-medium">Team Conrad</span>
              </div>
              <span className="font-bold">{Math.round(userStats.teamConradScore)}%</span>
            </div>
            <Progress value={userStats.teamConradScore} className="mb-2" />
            <p className="text-xs text-gray-600">Moody indie vibes • Introspective ballads</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Team Jeremiah</span>
              </div>
              <span className="font-bold">{Math.round(userStats.teamJeremiahScore)}%</span>
            </div>
            <Progress value={userStats.teamJeremiahScore} className="mb-2" />
            <p className="text-xs text-gray-600">Sunny pop hits • Feel-good anthems</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white/50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">
          You're <strong>{userStats.teamConradScore > userStats.teamJeremiahScore ? "Team Conrad" : "Team Jeremiah"}</strong> based on your summer playlist!
        </p>
      </div>
    </div>
  );
}