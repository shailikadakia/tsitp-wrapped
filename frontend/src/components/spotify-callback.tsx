import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { exchangeCodeForToken } from '../lib/spotify-api';

interface SpotifyCallbackProps {
  onSuccess: () => void;
  onError: () => void;
}

export function SpotifyCallback({ onSuccess, onError }: SpotifyCallbackProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Get authorization code from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        setError('Authorization failed. Please try again.');
        return;
      }

      if (!code) {
        setError('No authorization code received.');
        return;
      }

      try {
        // Exchange code for access token
        await exchangeCodeForToken(code);
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Success!
        onSuccess();
      } catch (err) {
        console.error('Token exchange error:', err);
        setError('Failed to connect to Spotify. Please try again.');
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
          <p className="text-gray-600">Please wait while we set up your account</p>
        </CardContent>
      </Card>
    </div>
  );
}
