import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Music, Disc3, ListMusic, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserStats } from '../../types/type';

export function SummerRecap({ userStats }: { userStats: UserStats }) {
  const artists = userStats.artistOverlap.overlapArtists;
  const artistCount = userStats.artistOverlap.overlapCount;
  const songCount = userStats.soundtrackOverlap.overlapCount;
  const songs = userStats.soundtrackOverlap.overlapTracks;
  const [songIndex, setSongIndex] = useState(0);

  const currentSong =
    songCount > 0 ? songs[(songIndex % songs.length + songs.length) % songs.length] : null;

  return (
    <div className="space-y-3 pb-4">
      <Card className="bg-white/80 border border-white/60 shadow-md">
        <CardContent className="pt-5 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <Disc3 className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">Artist Overlap</h3>
          </div>

          <p className="text-sm text-gray-700">
            {artistCount} artists you loved this year are in the soundtrack.
          </p>

          {artistCount > 0 && ( 
            <div className="mt-4 flex flex-wrap gap-2"> 
              {artists.map((artist) => ( 
                <span key={artist} 
                    className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-100 to-orange-100 text-gray-700 border border-white/70 shadow-sm" > 
                    {artist} 
                </span> 
              ))} 
              </div> 
            )} 
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 via-pink-50 to-orange-50 border border-white/60 shadow-md">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center gap-3 mb-2">
            <ListMusic className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Soundtrack Overlap</h3>
          </div>

          <p className="text-sm text-gray-700">
            {songCount} of your top 50 songs this year appear in the soundtrack.
          </p>

          {currentSong && (
            <div className="mt-4 space-y-3">
              <Card
                key={currentSong.spotifyTrackId}
                className="bg-white/80 border border-gray-100"
              >
                <CardContent className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {currentSong.name ?? 'Unknown track'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(currentSong.artist && currentSong.artist.join(', ')) || 'Unknown artist'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-blue-500">
                      <Music className="w-4 h-4" />
                      <span>Match #{songIndex + 1}</span>
                    </div>
                  </div>

                  {currentSong.spotifyTrackId && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                      <iframe
                        title={`spotify-${currentSong.spotifyTrackId}`}
                        src={`https://open.spotify.com/embed/track/${currentSong.spotifyTrackId}`}
                        width="100%"
                        height="80"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {songCount > 1 && (
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200"
                    onClick={() => setSongIndex((prev) => prev - 1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Prev
                  </Button>
                  <span className="text-gray-500">
                    {((songIndex % songCount) + songCount) % songCount + 1} of {songCount}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200"
                    onClick={() => setSongIndex((prev) => prev + 1)}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
