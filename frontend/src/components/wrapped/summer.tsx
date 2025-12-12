
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Music, Sun, Moon, ArrowLeft, ArrowRight } from 'lucide-react';
import { CharacterScore, ShipScores, TsitpScoresResponse, Track, CharacterPlaylist, UserStats, TSITPWrappedProps  } from '../../types/type';


export function SummerRecap({ userStats }: { userStats: UserStats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/70">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{userStats.totalPlays}</div>
            <div className="text-sm text-gray-600">Total Summer Plays</div>
          </CardContent>
        </Card>
        <Card className="bg-white/70">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-pink-500">{userStats.topTrack.plays}</div>
            <div className="text-sm text-gray-600">Times you played "{userStats.topTrack.name}"</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/70">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Your Summer Anthem</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-medium">{userStats.topTrack.name}</div>
              <div className="text-sm text-gray-600">{userStats.topTrack.artist}</div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Just like Belly thinking about Conrad on repeat 💭
          </p>
        </CardContent>
      </Card>
    </div>
  );
}