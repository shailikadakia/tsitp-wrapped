import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';

import { Heart, Music, Waves, Sun, Sunset } from 'lucide-react';
import { TSITPWrapped } from './components/tsitp-wrapped';
import { SpotifyAuth } from './components/spotify-auth';
import { SpotifyCallback } from './components/spotify-callback';
import { LoadingScreen } from './components/loading-screen';
import { Toaster, toast } from 'sonner';
import { isAuthenticated, getSummerData, getUserProfile,  logout } from './lib/spotify-api';

type AppState = 'landing' | 'auth' | 'callback' | 'loading' | 'wrapped';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [userData, setUserData] = useState<any>(null);
  const [useDemo, setUseDemo] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('code')) {
      setAppState('callback');
    } else if (isAuthenticated()) {
      setAppState('landing');
    }
  }, []);

  const handleGetWrapped = async (demoMode: boolean = false) => {
    // Check if authenticated
    if (isAuthenticated()) {
      // Fetch real Spotify data
      setAppState('loading');
      try {
        setAppState('wrapped');
        const user = await getUserProfile();
        console.log(user)
      } catch (error) {
        console.error('Error fetching Spotify data:', error);
        alert('Failed to fetch your Spotify data. Please try again or use demo mode.');
        setAppState('landing');
      }
    } else {
      // Show auth screen
      setAppState('auth');
    }
    
  };

  const handleAuthSuccess = () => {
    // After successful auth, fetch data
    setAppState('loading');
    getSummerData()
      .then(tracks => {
        setUserData(tracks);
        setAppState('wrapped');
      })
      .catch(error => {
        console.error('Error fetching Spotify data:', error);
        alert('Failed to fetch your Spotify data. Please try again.');
        setAppState('landing');
      });
  };

  const handleAuthError = () => {
    setAppState('landing');
  };

  const handleBack = () => {
    setAppState('landing');
    setUserData(null);
  };

  const handleLogout = async () => {
    setAppState('loading');
    try {
      await Promise.resolve(logout());
      setUserData(null);
      toast.success('Spotify account disconnected');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to disconnect Spotify. Please try again.');
    } finally {
      setAppState('landing');
    }
  };

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" richColors />
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/90 via-orange-200/40 to-pink-300/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {appState === 'landing' && (
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Waves className="w-8 h-8 text-blue-500" />
                  <Heart className="w-6 h-6 text-pink-400" />
                  <Music className="w-8 h-8 text-orange-400" />
                  <Sunset className="w-8 h-8 text-purple-500"/>
                </div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  TSITP Wrapped
                </h1>
                <p className="text-xl text-gray-700 max-w-lg mx-auto">
                  Discover how your Spotify listening habits were impacted by the "The Summer I Turned Pretty".
                </p>
              </div>

              {/* Features Preview */}
              <div className="grid md:grid-cols-2 gap-4 my-8">
                <Card className="bg-white/70 backdrop-blur-sm border-blue-300/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <Sun className="w-5 h-5" />
                      Your OTP
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Are you Connie baby or dark-chocolate-raspberry Jeremiah? Your Spotify taste will tell us exactly which team you're on</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-pink-300/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-pink-500">
                      <Heart className="w-5 h-5" />
                      Character Match
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      See which character's playlist vibes match your summer listening
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-orange-300/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-orange-500">
                      <Music className="w-5 h-5" />
                      Summer Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Your personal summer soundtrack wrapped with TSITP moments
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-purple-300/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-purple-500">
                      <Waves className="w-5 h-5" />
                      Mood Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Deep dive into your music's energy, vibe, and overall cousins beach feels
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <div className="space-y-4">
                <Button 
                  onClick={() => {
                    setUseDemo(false);
                    handleGetWrapped();
                  }}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 hover:opacity-90 text-white px-8 py-3 text-lg shadow-lg"
                >
                  <Music className="w-5 h-5 mr-2" />
                  {isAuthenticated() ? 'Show me My TSITP Wrapped' : 'Connect to Spotify'}
                </Button>
                {isAuthenticated() && (
                  <div className="pt-2">
                    <Button 
                      onClick={handleLogout}
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Disconnect Spotify Account
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {appState === 'auth' && <SpotifyAuth />}
        
        {appState === 'callback' && (
          <SpotifyCallback 
            onSuccess={handleAuthSuccess} 
            onError={handleAuthError} 
          />
        )}
        
        {appState === 'loading' && <LoadingScreen />}
        
        {appState === 'wrapped' && (
          <TSITPWrapped 
            onBack={handleBack} 
            userData={userData}
          />
        )}
      </div>
    </div>
  );
}
