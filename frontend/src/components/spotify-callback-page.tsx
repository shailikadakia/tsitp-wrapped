import { SpotifyCallback } from './spotify-callback';

export function SpotifyCallbackPage() {
  const handleSuccess = () => {
    window.location.replace('/results');
  };

  const handleError = () => {
    window.location.replace('/');
  };

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/90 via-orange-200/40 to-pink-300/50"></div>
      </div>

      <div className="relative z-10">
        <SpotifyCallback onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  );
}

