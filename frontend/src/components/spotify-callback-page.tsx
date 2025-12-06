import React from 'react';
import { SpotifyCallback } from './spotify-callback';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function SpotifyCallbackPage() {
  const handleSuccess = () => {
    // After successful auth + scoring, send user to results
    window.location.replace('/results');
  };

  const handleError = () => {
    window.location.replace('/');
  };

  return (
    <div className="min-h-screen">
      {/* background + callback as you already had */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1621622807857-ae68f7e707f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBiZWFjaCUyMG9jZWFuJTIwc3Vuc2V0fGVufDF8fHx8MTc1ODQ3NzUwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Summer beach sunset"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/90 via-orange-200/40 to-pink-300/50"></div>
      </div>

      <div className="relative z-10">
        <SpotifyCallback onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  );
}

