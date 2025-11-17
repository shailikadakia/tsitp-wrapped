import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Music, Waves, Heart, Sparkles } from 'lucide-react';
import { redirectToSpotifyAuth } from '../lib/spotify-api';

export function SpotifyAuth() {
  const handleLogin = () => {
    redirectToSpotifyAuth();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Waves className="w-8 h-8 text-blue-500" />
            <Heart className="w-6 h-6 text-pink-400" />
            <Music className="w-8 h-8 text-orange-400" />
          </div>
          <CardTitle className="text-3xl bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Connect to Spotify
          </CardTitle>
          <p className="text-gray-600">
            Connect your Spotify account to discover which TSITP character matches your music vibe
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50/60 rounded-lg p-4 border border-blue-200/40">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              What we'll analyze:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your top tracks from this summer</li>
              <li>• Music energy and mood patterns</li>
              <li>• Character personality matches</li>
              <li>• Team Conrad vs Team Jeremiah vibe</li>
            </ul>
          </div>

          <div className="bg-pink-50/60 rounded-lg p-4 border border-pink-200/40">
            <h3 className="font-semibold text-sm mb-2">Privacy & Data</h3>
            <p className="text-xs text-gray-600">
              We only access your listening history to create your personalized TSITP Wrapped. 
              Your data is processed locally and not stored on our servers.
            </p>
          </div>

          <Button 
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 hover:opacity-90 text-white py-6 text-lg shadow-lg"
          >
            <Music className="w-5 h-5 mr-2" />
            Connect with Spotify
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By connecting, you agree to Spotify's terms and conditions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
