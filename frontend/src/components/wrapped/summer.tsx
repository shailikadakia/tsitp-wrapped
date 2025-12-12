
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Music } from 'lucide-react';
import { UserStats } from '../../types/type';


export function SummerRecap({ userStats }: { userStats: UserStats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/70">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{}</div>
            <div className="text-sm text-gray-600">Total Summer Plays</div>
          </CardContent>
        </Card>
        <Card className="bg-white/70">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-pink-500">{}</div>
            <div className="text-sm text-gray-600">Times you played "{}"</div>
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
              <div className="font-medium">{}</div>
              <div className="text-sm text-gray-600">{}</div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Just like Belly thinking about Conrad on repeat 💭
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-white/70">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Soundtrack Overlap</h3>
            <p className="text-sm text-gray-600">
              {userStats.soundtrackOverlap.overlapCount} of your songs appear in the TSITP soundtrack.
            </p>
            {userStats.soundtrackOverlap.overlapTracks.length > 0 && (
              <div className="mt-3 text-xs text-gray-500 space-y-1">
                {userStats.soundtrackOverlap.overlapTracks
                  .slice(0, 3)
                  .map((t) => (
                    <div key={t.spotifyTrackId}>
                      {t.name ?? 'Unknown'} — {(t.artist && t.artist[0]) || 'Unknown artist'}
                    </div>
                  ))}
                {userStats.soundtrackOverlap.overlapTracks.length > 3 && (
                  <div className="italic">+ more</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/70">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Artist Overlap</h3>
            <p className="text-sm text-gray-600">
              {userStats.artistOverlap.overlapCount} artists you love are in the TSITP soundtrack.
            </p>
            {userStats.artistOverlap.overlapArtists.length > 0 && (
              <div className="mt-3 text-xs text-gray-500">
                {userStats.artistOverlap.overlapArtists.slice(0, 5).join(', ')}
                {userStats.artistOverlap.overlapArtists.length > 5 && '…'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
