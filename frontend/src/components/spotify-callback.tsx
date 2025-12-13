import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { exchangeCodeForToken, getTopTracks } from '../lib/spotify-api';

interface SpotifyCallbackProps {
  onSuccess: () => void;
  onError: () => void;
}

export function SpotifyCallback({ onSuccess, onError }: SpotifyCallbackProps) {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Connecting to Spotify...');

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const authError = params.get('error');

      if (authError) {
        setError('Authorization failed. Please try again.');
        return;
      }

      if (!code) {
        setError('No authorization code received.');
        return;
      }

      try {
        setStatus('Exchanging code for access token...');
        await exchangeCodeForToken(code);

        setStatus('Fetching your top tracks...');
        const topTracksData: any = await getTopTracks('long_term', 50);
        const spotifyTrackIds: string[] = topTracksData.items.map(
          (track: any) => track.id
        );

        sessionStorage.setItem('tsitp_top_tracks', JSON.stringify(topTracksData));

        setStatus('Analyzing your TSITP vibes...');
        const res = await fetch(`${import.meta.env.VITE_API_URL}api/score/get-score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spotifyTrackIds }),
        });

        if (!res.ok) {
          const body = await res.text();
          console.error('Score API error:', body);
          throw new Error('Failed to compute TSITP scores');
        }

        const scores = await res.json();
        console.log(scores);

        sessionStorage.setItem('tsitp_scores', JSON.stringify(scores));

        window.history.replaceState({}, document.title, window.location.pathname);

        onSuccess();
      } catch (err) {
        console.error('Token / scoring error:', err);
        setError('Failed to connect to Spotify or analyze your music. Please try again.');
      }
    };

    handleCallback();
  }, [onSuccess]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h2 className="text-xl font-semibold">Connection Failed</h2>
            <p className="text-gray-600">{error}</p>
            <Button
              onClick={onError}
              className="bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 hover:opacity-90"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6 text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
          <h2 className="text-xl font-semibold">Connecting to Spotify...</h2>
          <p className="text-gray-600">{status}</p>
        </CardContent>
      </Card>
    </div>
  );
}
